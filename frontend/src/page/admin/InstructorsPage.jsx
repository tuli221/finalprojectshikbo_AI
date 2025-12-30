import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { instructorApi } from '../../config/instructorApi'

const InstructorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    title: '',
    role: '',
    company: '',
    specialization: '',
    expertise_tags: '',
    bio: '',
    status: 'Approved',
    image: null
  })

  // Load instructors on component mount
  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const data = await instructorApi.getAll()
      setInstructors(data)
    } catch (error) {
      console.error('Error fetching instructors:', error)
      alert('Failed to load instructors')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value} = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isEditMode && selectedInstructor) {
        await instructorApi.update(selectedInstructor.id, formData)
        alert('Instructor updated successfully!')
      } else {
        await instructorApi.create(formData)
        alert('Instructor added successfully!')
      }
      setShowAddModal(false)
      resetForm()
      fetchInstructors()
    } catch (error) {
      console.error('Error saving instructor:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save instructor'
      alert(`Failed to save instructor: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      title: '',
      role: '',
      company: '',
      specialization: '',
      expertise_tags: '',
      bio: '',
      status: 'Approved',
      image: null
    })
    setImagePreview(null)
    setIsEditMode(false)
    setSelectedInstructor(null)
  }

  const handleViewDetails = (instructor) => {
    setSelectedInstructor(instructor)
    setShowViewModal(true)
  }

  const handleEditClick = (instructorParam) => {
    const instr = instructorParam || selectedInstructor
    if (!instr) return
    setFormData({
      name: instr.name,
      email: instr.email,
      phone: instr.phone || '',
      age: instr.age || '',
      title: instr.title || '',
      role: instr.role || '',
      company: instr.company || '',
      specialization: instr.specialization || '',
      expertise_tags: instr.expertise_tags || '',
      bio: instr.bio || '',
      status: instr.status || 'Approved',
      image: null
    })
    if (instr.image) {
      setImagePreview(`http://localhost:8000/storage/${instr.image}`)
    }
    setSelectedInstructor(instr)
    setIsEditMode(true)
    setShowViewModal(false)
    setShowAddModal(true)
  }

  const location = useLocation()

  useEffect(() => {
    if (!location?.state) return
    const { openViewId, openEditId } = location.state
    if (openViewId && instructors.length) {
      const found = instructors.find(i => i.id === openViewId)
      if (found) handleViewDetails(found)
    }
    if (openEditId && instructors.length) {
      const found = instructors.find(i => i.id === openEditId)
      if (found) handleEditClick(found)
    }
  }, [location, instructors])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this instructor?')) {
      try {
        await instructorApi.delete(id)
        alert('Instructor deleted successfully!')
        fetchInstructors()
      } catch (error) {
        console.error('Error deleting instructor:', error)
        alert('Failed to delete instructor')
      }
    }
  }

  const filteredInstructors = instructors.filter(
    (instructor) =>
      instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (instructor.specialization && instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (instructor.expertise_tags && instructor.expertise_tags.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Instructors</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          />
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow"
          >
            + Add Instructor
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstructors.map((instructor) => (
          <div
            key={instructor.id}
            className="border rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {instructor.image && (
                  <img 
                    src={`http://localhost:8000/storage/${instructor.image}`} 
                    alt={instructor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-lg">{instructor.name}</h4>
                  <p className="text-sm text-gray-600">{instructor.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  instructor.status === 'Approved'
                    ? 'bg-green-100 text-green-600'
                    : instructor.status === 'Rejected'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}
              >
                {instructor.status}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-green-600">
                {instructor.specialization || instructor.title}
              </p>
              {instructor.company && (
                <p className="text-xs text-gray-500 mt-1">{instructor.company}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">{instructor.total_courses || 0}</p>
                <p className="text-xs text-gray-500">Courses</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{instructor.total_students || 0}</p>
                <p className="text-xs text-gray-500">Students</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{instructor.rating || 0}</p>
                <p className="text-xs text-gray-500">Rating</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => handleViewDetails(instructor)}
                className="flex-1 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm"
              >
                View Details
              </button>
              <button 
                onClick={() => handleDelete(instructor.id)}
                className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInstructors.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">No instructors found</div>
      )}

      {/* View Details Modal */}
      {showViewModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">Instructor Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false)
                  setSelectedInstructor(null)
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✖
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Image and Basic Info */}
              <div className="flex items-start gap-6">
                {selectedInstructor.image ? (
                  <img 
                    src={`http://localhost:8000/storage/${selectedInstructor.image}`} 
                    alt={selectedInstructor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold">
                    {selectedInstructor.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-900">{selectedInstructor.name}</h4>
                  <p className="text-gray-600 mt-1">{selectedInstructor.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedInstructor.status === 'Approved'
                      ? 'bg-green-100 text-green-600'
                      : selectedInstructor.status === 'Rejected'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {selectedInstructor.status}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedInstructor.total_courses || 0}</p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedInstructor.total_students || 0}</p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedInstructor.rating || 0}</p>
                  <p className="text-sm text-gray-600">Rating</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedInstructor.phone && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Phone</p>
                    <p className="text-gray-600">{selectedInstructor.phone}</p>
                  </div>
                )}
                {selectedInstructor.age && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Age</p>
                    <p className="text-gray-600">{selectedInstructor.age}</p>
                  </div>
                )}
                {selectedInstructor.title && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Title</p>
                    <p className="text-gray-600">{selectedInstructor.title}</p>
                  </div>
                )}
                {selectedInstructor.company && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Company</p>
                    <p className="text-gray-600">{selectedInstructor.company}</p>
                  </div>
                )}
                {selectedInstructor.specialization && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Specialization</p>
                    <p className="text-gray-600">{selectedInstructor.specialization}</p>
                  </div>
                )}
                {selectedInstructor.join_date && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Join Date</p>
                    <p className="text-gray-600">{new Date(selectedInstructor.join_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              {/* Role */}
              {selectedInstructor.role && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Role</p>
                  <p className="text-gray-600">{selectedInstructor.role}</p>
                </div>
              )}

              {/* Expertise Tags */}
              {selectedInstructor.expertise_tags && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Expertise</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedInstructor.expertise_tags.split(',').map((tag, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedInstructor.bio && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Bio</p>
                  <p className="text-gray-600 leading-relaxed">{selectedInstructor.bio}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowViewModal(false)
                    setSelectedInstructor(null)
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={handleEditClick}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                >
                  Edit Instructor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {isEditMode ? 'Edit Instructor' : 'Add New Instructor'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  resetForm()
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview && (
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

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
                    placeholder="Enter instructor's full name"
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
                    placeholder="instructor@example.com"
                    required
                  />
                </div>
              </div>

              {/* Phone and Age */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+880 1234567890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter age"
                    min="18"
                    max="100"
                  />
                </div>
              </div>

              {/* Title and Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., Senior ML Engineer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="e.g., CODETREE"
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Full-stack developer and UI/UX expert"
                />
              </div>

              {/* Specialization and Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select specialization</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="AI Fundamentals">AI Fundamentals</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Cloud Computing">Cloud Computing</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Full-Stack Development">Full-Stack Development</option>
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
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Expertise Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expertise Tags
                </label>
                <input
                  type="text"
                  name="expertise_tags"
                  value={formData.expertise_tags}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., React, Node.js, TypeScript, UI/UX Design (comma-separated)"
                />
                <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Brief bio about the instructor"
                  rows="4"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition disabled:opacity-50"
                >
                  {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Instructor' : 'Add Instructor')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorsPage
