import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseCard from './CourseCard'
import { courseApi } from '../../../config/courseApi'
import api from '../../../config/api'

// Featured courses now fetch live data from API (falls back to empty array)

const FeaturedCourses = () => {
  const navigate = useNavigate()
  const [counts, setCounts] = useState({
    students: 0,
    courses: 0,
    instructors: 0
  })

  const [targetCounts, setTargetCounts] = useState({
    students: 0,
    courses: 0,
    instructors: 0
  })

  const [courses, setCourses] = useState([])

  // Fetch real stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats')
        setTargetCounts({
          students: response.data.students,
          courses: response.data.courses,
          instructors: response.data.instructors
        })
      } catch (err) {
        console.error('Failed to fetch stats', err)
        // Fallback to default values
        setTargetCounts({
          students: 0,
          courses: 0,
          instructors: 0
        })
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    let mounted = true
    const fetchCourses = async () => {
      try {
        const data = await courseApi.getAllCourses()
        if (mounted && Array.isArray(data)) setCourses(data)
      } catch (err) {
        console.error('Failed to fetch featured courses', err)
      }
    }
    fetchCourses()
    return () => { mounted = false }
  }, [])

  // Stats counting animation
  useEffect(() => {
    if (targetCounts.students === 0 && targetCounts.courses === 0 && targetCounts.instructors === 0) {
      return // Don't animate if no data loaded yet
    }

    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const counters = {}
    Object.keys(targetCounts).forEach(key => {
      counters[key] = setInterval(() => {
        setCounts(prev => {
          const current = prev[key]
          const target = targetCounts[key]
          const increment = Math.ceil(target / steps)
          
          if (current + increment >= target) {
            clearInterval(counters[key])
            return { ...prev, [key]: target }
          }
          
          return { ...prev, [key]: current + increment }
        })
      }, stepDuration)
    })

    return () => {
      Object.values(counters).forEach(interval => clearInterval(interval))
    }
  }, [targetCounts])

  return (
    <>
      {/* Featured Courses Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-8 md:px-16 py-10 backdrop-blur-md rounded-xl shadow-md mx-10 -mt-6 bg-green-50" id="courses">
        <div>
          {/* Background box */}
          <div className="rounded-3xl -mt-4">
            <h1 className="text-4xl font-bold mb-3 text-black-400 text-center py-0">Featured Courses</h1>
            <p className="text-black-400 font-bold text-lg max-w-2xl mx-auto text-center mb-2">
              Start your journey with our most popular and highly-rated courses.
            </p>
          </div>

          {/* Courses Grid */}
          <div className="max-w-20xl mx-auto py-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-10">
            {courses.slice(0, 3).map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* View All Button */}
          <div className="flex items-center justify-center">
            <button 
              onClick={() => navigate('/courses')}
              className="bg-black-500 hover:white-600 bg-green-600 hover:bg-green-500 text-lg text-black font-bold px-6 py-2 mt-2 rounded-xl transition"
            >
              View all courses<i className="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black/80 backdrop-blur-md rounded-2xl shadow-lg m-10 p-10 flex flex-col md:flex-row items-center justify-between md:space-x-10 space-y-6 md:space-y-0">
        {/* Card 1 */}
        <div className="flex flex-col items-center text-center">
          <i className="fa-solid fa-users text-green-500 text-4xl mb-3"></i>
          <h3 className="text-3xl font-bold text-gray-300">{counts.students.toLocaleString()}+</h3>
          <p className="text-gray-300">Active Students</p>
        </div>

        {/* Card 2 */}
        <div className="flex flex-col items-center text-center">
          <i className="fa-solid fa-book-open text-green-500 text-4xl mb-3"></i>
          <h3 className="text-3xl font-bold text-gray-300">{counts.courses.toLocaleString()}+</h3>
          <p className="text-gray-300">Courses Available</p>
        </div>

        {/* Card 3 */}
        <div className="flex flex-col items-center text-center">
          <i className="fa-solid fa-chalkboard-teacher text-green-500 text-4xl mb-3"></i>
          <h3 className="text-3xl font-bold text-gray-300">{counts.instructors.toLocaleString()}+</h3>
          <p className="text-gray-300">Instructors</p>
        </div>

        
      </section>
    </>
  )
}
export default FeaturedCourses

