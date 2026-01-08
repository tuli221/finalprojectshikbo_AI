import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'

const AdminCourseView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [courseInfo, setCourseInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    
    console.log('Fetching course data for ID:', id)
    
    // Fetch both course and course information
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/course-information/course/${id}`)
    ])
      .then(([courseRes, infoRes]) => {
        console.log('Course data:', courseRes.data)
        console.log('Course info data:', infoRes.data)
        if (mounted) {
          setCourse(courseRes.data)

          // Normalize modules: API may return modules as a JSON string.
          let info = infoRes?.data || null
          if (info && info.modules) {
            if (typeof info.modules === 'string') {
              try {
                info.modules = JSON.parse(info.modules)
              } catch (e) {
                console.warn('Failed to parse courseInfo.modules JSON, using empty array', e)
                info.modules = []
              }
            }
          }

          setCourseInfo(info)
        }
      })
      .catch(err => {
        console.error('Failed to fetch course data', err)
        console.error('Error details:', err.response?.data)
        // Still set course even if info fails
        api.get(`/courses/${id}`)
          .then(res => mounted && setCourse(res.data))
          .catch(e => console.error(e))
      })
      .finally(() => mounted && setLoading(false))
    
    return () => { mounted = false }
  }, [id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!course) return <div className="p-6">Course not found</div>

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">{course.title}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/admin/courses')} className="px-4 py-2 bg-gray-200 rounded">Back</button>
          <button onClick={() => navigate(`/admin/courses/edit/${course.id}`)} className="px-4 py-2 bg-yellow-400 rounded">Edit</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <img src={course.thumbnail ? (course.thumbnail.startsWith('http') ? course.thumbnail : `${api.defaults.baseURL.replace(/\/api\/?$/, '')}/storage/${course.thumbnail}`) : '/assets/React.jpg'} alt={course.title} className="w-full h-64 object-cover rounded" />
          <h4 className="text-lg font-semibold mt-4">Description</h4>
          <p className="text-gray-700 mt-2">{course.description}</p>
        </div>
        <div className="space-y-3">
          <p><strong>Category:</strong> {course.category}</p>
          <p><strong>Level:</strong> {course.level}</p>
          <p><strong>Price:</strong> ৳{course.price}</p>
          <p><strong>Lessons:</strong> {course.lessons}</p>
          <p><strong>Status:</strong> {course.status}</p>
        </div>
      </div>

      {/* Course Information Section */}
      {courseInfo && (
        <div className="mt-8 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Course Information</h2>
            <button
              onClick={() => navigate(`/admin/modules/edit/${courseInfo.id}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Course Information
            </button>
          </div>

          {/* About This Course */}
          {courseInfo.about_course && (
            <div className="bg-gray-800 text-white p-6 rounded-xl">
              <h3 className="text-2xl font-bold mb-4">About This Course</h3>
              <p className="text-gray-300 whitespace-pre-line">{courseInfo.about_course}</p>
            </div>
          )}

          {/* What You'll Learn */}
          {courseInfo.what_you_learn && (
            <div className="bg-gray-800 text-white p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-500 text-2xl">📚</span>
                <h3 className="text-2xl font-bold">What You'll Learn</h3>
              </div>
              <div className="text-gray-300 whitespace-pre-line">{courseInfo.what_you_learn}</div>
            </div>
          )}

          {/* Course Modules */}
          {courseInfo.modules && courseInfo.modules.length > 0 && (
            <div className="bg-gray-800 text-white p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-green-500 text-2xl">📖</span>
                <h3 className="text-2xl font-bold">Course Modules</h3>
              </div>
              <div className="space-y-4">
                {Array.isArray(courseInfo.modules) && courseInfo.modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="bg-gray-700 p-4 rounded-lg flex items-start gap-4">
                    <div className="flex-none w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">{moduleIndex + 1}</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-green-400 mb-1">
                        {module.module_title || `Module ${moduleIndex + 1}`}
                      </h4>
                      {module.module_description && (
                        <p className="text-gray-300">{module.module_description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!courseInfo && !loading && (
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">No additional course information available</p>
          <button
            onClick={() => navigate('/admin/modules/add')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Course Information
          </button>
        </div>
      )}
    </div>
  )
}

export default AdminCourseView
