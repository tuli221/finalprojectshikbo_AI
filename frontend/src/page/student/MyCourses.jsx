import React, { useEffect, useState } from 'react'
import courseApi from '../../config/courseApi'
import api from '../../config/api'
import { useNavigate } from 'react-router-dom'

const MyCourses = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    const fetch = async () => {
      setLoading(true)
      try {
        // Try student dashboard first (returns user and recommended)
        const dashRes = await api.get('/student/dashboard')
        const dash = dashRes.data || {}

        let list = []
        // If the authenticated student has an assigned course, unenroll them first
        const courseId = dash.user?.course_id
        if (courseId) {
          try {
            // Call unenroll endpoint to remove assignment from database
            await api.post('/user/unenroll')
            // After unenrolling, do not show any courses
            list = []
          } catch (unenrollErr) {
            // If unenroll fails (e.g., unauthorized), fall back to showing the enrolled course
            console.error('Failed to unenroll user, falling back to showing course', unenrollErr)
            try {
              const course = await courseApi.getCourse(courseId)
              list = [course]
            } catch (innerErr) {
              console.error('Failed to load enrolled course', innerErr)
            }
          }
        }

        // Do NOT show recommended courses here — only show courses the student is enrolled in.
        if (mounted) setEnrolledCourses(list)
      } catch (err) {
        console.error(err)
        if (mounted) setError('Failed to load courses')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetch()
    return () => { mounted = false }
  }, [])

  const filteredCourses = enrolledCourses.filter((course) => {
    const title = (course.title || course.name || '').toString().toLowerCase()
    const category = (course.category || '').toString().toLowerCase()
    return title.includes(searchQuery.toLowerCase()) || category.includes(searchQuery.toLowerCase())
  })

  const handleContinue = (course) => {
    const id = course.id || course.course_id
    if (id) navigate(`/course/${id}`)
  }

  if (loading) return <div className="text-center py-8">Loading courses...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">My Enrolled Courses</h3>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
        />
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const title = course.title || course.name || 'Untitled'
            const instructor = typeof course.instructor === 'string' ? course.instructor : (course.instructor?.name || '')
            const totalLessons = course.totalLessons || course.total_lessons || course.lessons_count || 0
            const completedLessons = course.completedLessons || course.completed_lessons || course.progress_steps || 0
            const progress = typeof course.progress === 'number' ? course.progress : (totalLessons ? Math.round((completedLessons / totalLessons) * 100) : 0)
            const thumbnail = course.thumbnail || course.thumbnail_url || '/assets/downloadShikbo.png'

            return (
              <div key={course.id || course.course_id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                <img src={thumbnail} alt={title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <span className="text-green-500 text-xs font-semibold">{course.category || ''}</span>
                  <h3 className="font-bold text-lg text-gray-800 mt-1 mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 mb-3">Instructor: {instructor}</p>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-gray-800">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                    <span>{completedLessons}/{totalLessons} Lessons</span>
                  </div>

                  <button onClick={() => handleContinue(course)} className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
                    Continue Learning
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default MyCourses
