import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'

const AdminCoursesPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/admin/courses')
      .then(res => {
        if (!mounted) return
        setCourses(res.data || [])
      })
      .catch(err => {
        console.error('Failed to load admin courses', err)
      })
      .finally(() => mounted && setLoading(false))

    return () => { mounted = false }
  }, [])

  const filteredCourses = courses.filter((course) => {
    const title = (course.title || '').toString().toLowerCase()
    const instructor = (course.instructor?.name || course.instructor || course.instructor_profile?.name || '').toString().toLowerCase()
    const category = (course.category || '').toString().toLowerCase()
    const q = searchQuery.toLowerCase()
    return title.includes(q) || instructor.includes(q) || category.includes(q)
  })

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">All Courses</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button onClick={() => navigate('/admin/courses/add')} className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow">
            + Add New Course
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-black border-b bg-gray-50">
              <th className="p-3">ID</th>
              <th className="p-3">Course Title</th>
              <th className="p-3">Instructor</th>
              <th className="p-3">Category</th>
              <th className="p-3">Students</th>
              <th className="p-3">Price (৳)</th>
              <th className="p-3">Rating</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {loading
              ? (
                <tr><td colSpan={9} className="p-6 text-center text-gray-500">Loading courses...</td></tr>
              ) : (
                filteredCourses.map((course) => (
                  <AdminCourseRow
                    key={course.id}
                    course={course}
                    onDeleted={(id) => setCourses(prev => prev.filter(c => c.id !== id))}
                  />
                ))
              )}
          </tbody>
        </table>
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
          <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
        </div>
      </div>
    </div>
  )
}

export default AdminCoursesPage

// Small sub-component for a table row with wired actions
function AdminCourseRow({ course, onDeleted }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  const handleView = () => {
    navigate(`/admin/courses/${course.id}`)
  }

  const handleEdit = () => {
    navigate(`/admin/courses/edit/${course.id}`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this course?')) return
    try {
      setDeleting(true)
      await api.delete(`/admin/courses/${course.id}`)
      onDeleted(course.id)
    } catch (err) {
      console.error('Failed to delete course', err)
      alert('Failed to delete course')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3">#{course.id}</td>
      <td className="p-3 font-medium">{course.title}</td>
      <td className="p-3">{course.instructor?.name || course.instructor || course.instructor_profile?.name || '-'}</td>
      <td className="p-3">
        <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
          {course.category}
        </span>
      </td>
      <td className="p-3">{course.enrolled_count ?? course.students ?? 0}</td>
      <td className="p-3">৳{(course.price ?? 0).toLocaleString()}</td>
      <td className="p-3">
        <div className="flex items-center">
          <span className="text-yellow-500 mr-1">★</span>
          {course.rating ?? ''}
        </div>
      </td>
      <td className="p-3">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            course.status === 'Published'
              ? 'bg-green-100 text-green-600'
              : course.status === 'Draft'
              ? 'bg-gray-100 text-gray-600'
              : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {course.status}
        </span>
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <button title="View" onClick={handleView} className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
            <i className="fa-solid fa-eye" />
          </button>
          <button title="Edit" onClick={handleEdit} className="p-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm">
            <i className="fa-solid fa-pen" />
          </button>
          <button title="Delete" onClick={handleDelete} disabled={deleting} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
            <i className="fa-solid fa-trash" />
          </button>
        </div>
      </td>
    </tr>
  )
}
