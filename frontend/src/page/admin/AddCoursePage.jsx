import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'

const AddCoursePage = () => {
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [instructorUsers, setInstructorUsers] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    discount_price: '',
    duration: '',
    lessons: '',
    description: '',
    instructor_id: '',
    instructor_profile_id: '',
    level: 'Beginner',
      type: 'Offline',
    language: 'English',
    status: 'Published',
    video_url: '',
    video_url: '',
    certificate: true,
  })
  const [thumbnail, setThumbnail] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    
    api.get('/instructors')
      .then(res => setInstructors((res.data || []).filter(i => i.status === 'Approved')))
      .catch(err => console.error(err))
    
    api.get('/admin/instructors/users')
      .then(res => setInstructorUsers(res.data))
      .catch(err => console.error(err))
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      setThumbnail(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert('Please login as admin')
      navigate('/login')
      return
    }
    
    const data = new FormData()
    data.append('title', formData.title)
    data.append('category', formData.category)
    data.append('price', formData.price)
    data.append('duration', formData.duration)
    data.append('lessons', formData.lessons)
    data.append('description', formData.description)
    data.append('level', formData.level)
    data.append('language', formData.language)
    data.append('status', formData.status)
    if (formData.instructor_id) data.append('instructor_id', formData.instructor_id)
    data.append('certificate', formData.certificate ? '1' : '0')
    
    if (formData.discount_price) data.append('discount_price', formData.discount_price)
    if (formData.instructor_profile_id) data.append('instructor_profile_id', formData.instructor_profile_id)
    // `requirements`, `what_you_learn`, and `course_modules` removed (dropped from DB)
    if (formData.video_url) data.append('video_url', formData.video_url)
    
    if (thumbnail) {
      console.log('Adding thumbnail to FormData:', thumbnail)
      data.append('thumbnail', thumbnail)
    }

    if (formData.type) data.append('type', formData.type)

    console.log('Submitting form with instructor_id:', formData.instructor_id)

    try {
      await api.post('/admin/courses', data)
      alert('Course created successfully!')
      navigate('/admin/courses')
    } catch (error) {
      console.error('Full error:', error.response?.data)
      const errors = error.response?.data?.errors
      if (errors) {
        const errorMessages = Object.entries(errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join('\n')
        alert('Validation errors:\n' + errorMessages)
      } else {
        alert(error.response?.data?.message || 'Failed to create course')
      }
    }
  }

  const handleCancel = () => {
    navigate('/admin/courses')
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Add New Course</h3>
        <p className="text-gray-600">Fill in the details to create a new course</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Course Title and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter course title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Select category</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="DevOps">DevOps</option>
            </select>
          </div>
        </div>

        {/* Price and Discount Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (৳) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter price in BDT"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discount Price (৳)
            </label>
            <input
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter discount price (optional)"
              min="0"
            />
          </div>
        </div>

        {/* Duration and Lessons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Months) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter duration in months"
              required
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Lessons <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="lessons"
              value={formData.lessons}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter number of lessons"
              required
              min="1"
            />
          </div>
        </div>

        {/* Instructor Assignment and Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Instructor
            </label>
            <select
              name="instructor_id"
              value={formData.instructor_id}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select instructor</option>
              {instructorUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Optional: assign this course to an instructor for management.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructor Profile (Display)
            </label>
            <select
              name="instructor_profile_id"
              value={formData.instructor_profile_id}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select instructor profile (optional)</option>
              {instructors.map(instructor => (
                <option key={instructor.id} value={instructor.id}>
                  {instructor.name} {instructor.title && `- ${instructor.title}`}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Optional: Link to instructor profile for public display
            </p>
          </div>
        </div>

        {/* Level and Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level <span className="text-red-500">*</span>
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="w-full border rounded-lg px-3 py-2 text-gray-700">Offline</div>
              <input type="hidden" name="type" value="Offline" />
            </div>
        </div>

        {/* Language and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language <span className="text-red-500">*</span>
            </label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="English">English</option>
              <option value="Bengali">Bengali</option>
              <option value="Both">Both (English & Bengali)</option>
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
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Thumbnail and Video URL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Thumbnail
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              accept="image/*"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video URL (Optional)
            </label>
            <input
              type="url"
              name="video_url"
              value={formData.video_url}
              onChange={handleInputChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Certificate Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="certificate"
            checked={formData.certificate}
            onChange={handleInputChange}
            className="w-4 h-4"
          />
          <label className="text-sm text-gray-700">
            Course includes certificate upon completion
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Course Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Write a detailed description about the course..."
            rows="4"
            required
          ></textarea>
        </div>

        {/* Note: Requirements, What You'll Learn and Course Modules fields were removed because they are dropped from the database. */}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
          >
            Create Course
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddCoursePage
