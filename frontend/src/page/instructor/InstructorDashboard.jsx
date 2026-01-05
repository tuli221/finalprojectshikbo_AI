import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MyCourses from './MyCourses'
import Students from './Students'
import Messages from './Messages'
import Profile from './Profile'
import { useAuth } from '../../context/AuthContext'
import courseApi from '../../config/courseApi'

const InstructorDashboard = () => {
  const location = useLocation()
  const { user } = useAuth()

  const [totalCourses, setTotalCourses] = useState(0)
  const [myCoursesCount, setMyCoursesCount] = useState(0)
  const [myStudentsCount, setMyStudentsCount] = useState(0)
  const [myCourses, setMyCourses] = useState([])
  const [totalViews, setTotalViews] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)


  const renderContent = () => {
    const path = location.pathname
    
    if (path === '/instructor/my-courses') return <MyCourses />
    if (path === '/instructor/students') return <Students />
    if (path === '/instructor/messages') return <Messages />
    if (path === '/instructor/profile') return <Profile />
    
    // Default dashboard content
    return (
      <>
        {/* TOP STATS CARDS (dynamic) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-10">
          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 md:p-8 rounded-2xl shadow-lg flex justify-between items-center">
            <p className="text-white font-semibold text-sm md:text-base">Total Courses</p>
            <h3 className="text-2xl md:text-3xl font-bold">{totalCourses}</h3>
          </div>

          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 md:p-8 rounded-2xl shadow-lg flex justify-between items-center">
            <p className="text-white font-semibold text-sm md:text-base">My Students</p>
            <h3 className="text-2xl md:text-3xl font-bold">{myStudentsCount}</h3>
          </div>

          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 md:p-8 rounded-2xl shadow-lg flex justify-between items-center sm:col-span-2 lg:col-span-1">
            <p className="text-white font-semibold text-sm md:text-base">My Courses</p>
            <h3 className="text-2xl md:text-3xl font-bold">{myCoursesCount}</h3>
          </div>
        </div>

        {/* RECENT COURSES */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 md:mb-8">
          <h3 className="text-lg md:text-xl font-bold mb-4">My Recent Courses</h3>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 md:px-4 text-sm md:text-base">Course</th>
                    <th className="py-2 px-2 md:px-4 text-sm md:text-base">Students</th>
                    <th className="py-2 px-2 md:px-4 text-sm md:text-base">Status</th>
                    <th className="py-2 px-2 md:px-4 text-sm md:text-base">Action</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {myCourses.map((course) => (
                    <tr key={course.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 md:px-4 font-semibold text-sm md:text-base">{course.title || course.name}</td>
                      <td className="py-3 px-2 md:px-4 text-sm md:text-base">{(
                        typeof course.enrollments_count === 'number' ? course.enrollments_count : (
                          typeof course.students_count === 'number' ? course.students_count : (
                            typeof course.students === 'number' ? course.students : (
                              Array.isArray(course.students) ? course.students.length : 0
                            )
                          )
                        )
                      )}</td>
                      <td className="py-3 px-2 md:px-4">
                        <span className={`px-2 md:px-3 py-1 ${course.statusColor || 'bg-gray-100 text-gray-700'} rounded-lg text-xs md:text-sm`}>
                          {course.status || course.state || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3 px-2 md:px-4">
                        <button className="px-3 md:px-4 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* STUDENT ENGAGEMENT */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg md:text-xl font-bold mb-3">Student Engagement</h3>
          <p className="text-gray-600 mb-4 text-sm md:text-base">Last 7 days activity</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div className="bg-green-50 p-4 md:p-5 rounded-xl shadow-sm text-center">
              <h4 className="text-xl md:text-2xl font-bold text-green-600">{myStudentsCount}</h4>
              <p className="text-gray-600 text-sm md:text-base">Total Enrollments</p>
            </div>

            <div className="bg-green-50 p-4 md:p-5 rounded-xl shadow-sm text-center">
              <h4 className="text-xl md:text-2xl font-bold text-green-600">{totalViews}</h4>
              <p className="text-gray-600 text-sm md:text-base">Video Views</p>
            </div>

            <div className="bg-green-50 p-4 md:p-5 rounded-xl shadow-sm text-center sm:col-span-2 lg:col-span-1">
              <h4 className="text-xl md:text-2xl font-bold text-green-600">{completionRate}%</h4>
              <p className="text-gray-600 text-sm md:text-base">Avg Completion Rate</p>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Fetch counts when component mounts or user changes
  useEffect(() => {
    let mounted = true

    const getCountFromCourse = (c) => {
      if (!c) return 0
      if (typeof c.enrollments_count === 'number') return c.enrollments_count
      if (typeof c.students_count === 'number') return c.students_count
      if (typeof c.students === 'number') return c.students
      if (Array.isArray(c.students)) return c.students.length
      if (Array.isArray(c.enrollments)) return c.enrollments.length
      return 0
    }

    const fetchCounts = async () => {
      try {
        const all = await courseApi.getAllCourses()
        const allList = Array.isArray(all) ? all : (all.data || [])
        if (mounted) setTotalCourses(allList.length)

        // Instructor's courses
        const my = await courseApi.getMycourses()
        const myList = Array.isArray(my) ? my : (my.data || [])
        if (mounted) {
          setMyCoursesCount(myList.length)
          setMyCourses(myList)
        }

        // Sum students across instructor's courses
        const studentsSum = myList.reduce((sum, c) => sum + getCountFromCourse(c), 0)
        if (mounted) setMyStudentsCount(studentsSum)

        // Sum views across courses (common field names)
        const viewsSum = myList.reduce((s, c) => s + (c.views_count || c.views || 0), 0)
        if (mounted) setTotalViews(viewsSum)

        // Average completion rate if present (assumes 0-100 or 0-1)
        const completionValues = myList
          .map(c => c.completion_rate)
          .filter(v => typeof v === 'number')
        let avgCompletion = 0
        if (completionValues.length > 0) {
          const sumComp = completionValues.reduce((s, v) => s + v, 0)
          avgCompletion = sumComp / completionValues.length
          // if values are in 0..1 scale convert to percent
          if (avgCompletion <= 1) avgCompletion = Math.round(avgCompletion * 100)
          else avgCompletion = Math.round(avgCompletion)
        }
        if (mounted) setCompletionRate(avgCompletion)
      } catch (err) {
        console.error('Failed to load course counts', err)
      }
    }

    fetchCounts()
    return () => { mounted = false }
  }, [user])

  return <div className="w-full">{renderContent()}</div>
}

export default InstructorDashboard
