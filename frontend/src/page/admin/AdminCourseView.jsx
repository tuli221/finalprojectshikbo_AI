import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'

const AdminCourseView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get(`/courses/${id}`)
      .then(res => mounted && setCourse(res.data))
      .catch(err => console.error('Failed to fetch course', err))
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
    </div>
  )
}

export default AdminCourseView
