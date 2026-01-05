import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { instructorApi } from '../../config/instructorApi'
import { useAuth } from '../../context/AuthContext'

const InstructorRequest = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [hasPendingRequest, setHasPendingRequest] = useState(false)
  const [isApproved, setIsApproved] = useState(false)
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

  useEffect(() => {
    // Check if user has an approved instructor profile
    // When backend creates instructor profile, user.role = 'instructor' but we need to check the actual profile
    const checkApprovalStatus = async () => {
      if (user?.role === 'instructor' && user?.id) {
        try {
          // Check if instructor profile exists (means approved)
          const response = await fetch(`http://localhost:8000/api/instructors?user_id=${user.id}`)
          const data = await response.json()
          if (data && data.length > 0) {
            // Instructor profile exists, user is approved
            setIsApproved(true)
            localStorage.removeItem('instructor_request_sent')
            localStorage.removeItem('instructor_request_data')
            return
          }
        } catch (err) {
          console.log('Could not check instructor status:', err)
        }
      }
    }

    checkApprovalStatus()

    // Check if there's a pending request
    const requestSent = localStorage.getItem('instructor_request_sent')
    const savedData = localStorage.getItem('instructor_request_data')
    
    if (requestSent === '1' && savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        // Only show pending if it belongs to current logged-in user
        if (parsedData?.email && user?.email && parsedData.email.toLowerCase() === user.email.toLowerCase()) {
          setHasPendingRequest(true)
          setFormData(prev => ({ ...prev, ...parsedData }))
        } else {
          // Different user, show form
          setShowForm(true)
        }
      } catch (err) {
        // Parsing error, show form
        setShowForm(true)
      }
    } else {
      // No pending request, show form
      setShowForm(true)
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) setFormData(prev => ({ ...prev, image: file }))
  }

  const handleResubmit = () => {
    setShowForm(true)
    setHasPendingRequest(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await instructorApi.request(formData)
      // Save form data and mark as sent
      const dataToSave = { ...formData }
      delete dataToSave.image // Don't save file object
      localStorage.setItem('instructor_request_data', JSON.stringify(dataToSave))
      localStorage.setItem('instructor_request_sent', '1')
      setHasPendingRequest(true)
      setShowForm(false)
    } catch (error) {
      console.error('Request error:', error)
      alert('Failed to submit request')
    } finally {
      setLoading(false)
    }
  }

  // Show approval congratulations
  if (isApproved) {
    return (
      <div className="min-h-screen bg-white p-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-full opacity-25 animate-ping"></div>
              <div className="relative bg-green-100 rounded-full p-6">
                <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Congratulations Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            🎉 Congratulations!
          </h1>
          
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">
              Your instructor application has been approved!
            </p>
            <p className="text-base text-gray-500">
              You now have full access to all instructor features. 
            </p>
          </div>

          

          {/* Action Button */}
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Show pending status
  if (hasPendingRequest && !showForm) {
    return (
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="text-center max-w-2xl mx-auto">
          {/* Animated Clock Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-25 animate-ping"></div>
              <div className="relative bg-yellow-100 rounded-full p-6">
                <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
            </div>
          </div>

          {/* Main Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Your Request is Pending
          </h1>
          
          <div className="mb-8">
            <p className="text-lg text-gray-600 mb-4">
              Thank you for applying to become an instructor!
            </p>
            <p className="text-base text-gray-500">
              Your application is currently under review. Please wait for admin approval.
            </p>
          </div>

          {/* Status Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="space-y-4 text-left">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">Application Submitted</h3>
                  <p className="text-sm text-gray-600">Your request has been successfully received</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 opacity-60">
                <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">Under Review</h3>
                  <p className="text-sm text-gray-600">Admin is reviewing your application</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 opacity-40">
                <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div>
                  <h3 className="font-semibold text-gray-800">Approval</h3>
                  <p className="text-sm text-gray-600">You'll be notified once approved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>What's next?</strong><br />
              We'll review your application within 24-48 hours. You'll receive an email notification once a decision is made.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/instructor/dashboard')}
              className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all duration-200"
            >
              Back to Dashboard
            </button>
            <button
              onClick={handleResubmit}
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Edit & Resubmit
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show form
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
          <button type="submit" disabled={loading} className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{loading ? 'Submitting...' : 'Request Instructor Approval'}</button>
        </div>
      </form>
    </div>
  )
}

export default InstructorRequest
