import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../config/api'

const StudentPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    course: '',
    status: 'Active',
    enrollmentDate: '',
    address: ''
  })
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  const [validationErrors, setValidationErrors] = useState(null)
  const [editingUser, setEditingUser] = useState(null)
  const location = useLocation()

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const res = await api.get('/admin/students')
        setUsers(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    const fetchCourses = async () => {
      try {
        const res = await api.get('/admin/courses')
        setCourses(res.data)
      } catch (err) {
        // ignore courses error for now
      }
    }

    fetchStudents()
    fetchCourses()
  }, [])

  useEffect(() => {
    if (location?.state?.openEditId && users.length) {
      const target = users.find(u => u.id === location.state.openEditId)
      if (target) openEdit(target)
    }
  }, [location, users])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setValidationErrors(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setValidationErrors(null)
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password,
        role: 'student',
        phone: formData.phone,
        address: formData.address,
        enrollment_date: formData.enrollmentDate || null,
        course_id: formData.course || null
      }
      const res = await api.post('/register', payload)
      const json = res.data
      const created = json.user || json
      setUsers((prev) => [created, ...prev])
      setShowAddModal(false)
      setFormData({
        name: '',
        email: '',
        password: '',
        phone: '',
        course: '',
        status: 'Active',
        enrollmentDate: '',
        address: ''
      })
    } catch (err) {
      const data = err.response?.data
      if (data?.errors) {
        setValidationErrors(data.errors)
      } else {
        alert(err.response?.data?.message || err.message)
      }
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try {
      await api.delete(`/admin/students/${id}`)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  const openEdit = (user) => {
    setEditingUser(user)
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      phone: user.phone || '',
      course: user.course?.id || '',
      status: user.status || 'Active',
      enrollmentDate: user.enrollment_date || '',
      address: user.address || ''
    })
    setShowAddModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      const res = await api.put(`/admin/students/${editingUser.id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        course_id: formData.course || null,
        enrollment_date: formData.enrollmentDate || null
      })
      const updated = res.data
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)))
      setShowAddModal(false)
      setEditingUser(null)
    } catch (err) {
      alert(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      {error && (
        <div className="mb-4 text-red-600">{error}</div>
      )}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">All Users</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow"
          >
            + Add New Student
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {loading && <div className="py-4 text-gray-600">Loading students...</div>}
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-black border-b bg-gray-50">
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Course</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="p-3">#{user.id}</td>
                <td className="p-3 font-medium">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.course?.title || user.course || '-'}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active'
                        ? 'bg-green-100 text-green-600'
                        : user.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm"
                    onClick={() => navigate(`/admin/students/${user.id}`)}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm"
                    onClick={() => openEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No users found</div>
      )}

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Add New Student</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✖
              </button>
            </div>

            <form onSubmit={editingUser ? handleEditSubmit : handleSubmit} className="p-6 space-y-4">
              {validationErrors && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded">
                  <ul className="list-disc pl-5">
                    {Object.entries(validationErrors).map(([field, msgs]) => (
                      msgs.map((m, i) => <li key={`${field}-${i}`}>{m}</li>)
                    ))}
                  </ul>
                </div>
              )}
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="student@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password and Phone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Create a password"
                    required
                    minLength="6"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+880 1234567890"
                    required
                  />
                </div>
              </div>

              {/* Course and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrolled Course <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Select a course</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Enrollment Date and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enrollment Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="enrollmentDate"
                    value={formData.enrollmentDate}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter address"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingUser(null) }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  {editingUser ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentPage
