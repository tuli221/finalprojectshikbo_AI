import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { instructorApi } from '../../config/instructorApi'
import { useAuth } from '../../context/AuthContext'

const InstructorRequest = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    age: '',
    title: '',
    role: 'Instructor',
    company: '',
    specialization: '',
    expertise_tags: '',
    bio: '',
    image: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await instructorApi.request(formData)
      // mark locally so dashboard won't show again until refresh from server
      localStorage.setItem('instructor_request_sent', '1')
      alert('Request submitted successfully. Admin will review your request.')
      navigate('/instructor/dashboard')
    } catch (error) {
      console.error('Request error:', error)
      alert('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-2xl font-semibold mb-4">Complete your Instructor Profile / Request</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input name="age" type="number" value={formData.age} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
            <input name="company" value={formData.company} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
          <select name="specialization" value={formData.specialization} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Select specialization</option>
            <option>Web Development</option>
            <option>Mobile Development</option>
            <option>Data Science</option>
            <option>AI Fundamentals</option>
            <option>Machine Learning</option>
            <option>Cloud Computing</option>
            <option>Cybersecurity</option>
            <option>DevOps</option>
            <option>Full-Stack Development</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expertise Tags (comma separated)</label>
          <input name="expertise_tags" value={formData.expertise_tags} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={() => navigate('/instructor/dashboard')} className="px-4 py-2 border rounded-lg">Cancel</button>
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg">{loading ? 'Submitting...' : 'Request Instructor Approval'}</button>
        </div>
      </form>
    </div>
  )
}

export default InstructorRequest
