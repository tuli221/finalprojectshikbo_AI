import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    yearsOfExperience: '',
    education: '',
    bio: '',
    location: ''
  })

  // Fetch instructor profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem('token')
        const response = await axios.get('http://localhost:8000/api/instructor/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        // Map API response to form fields
        const data = response.data
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          expertise: data.specialization || '',
          yearsOfExperience: data.age ? (new Date().getFullYear() - parseInt(data.age)) : '',
          education: data.title || '',
          bio: data.bio || '',
          location: data.company || ''
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        alert('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const formDataToSend = new FormData()
      
      // Map form fields to API fields
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('specialization', formData.expertise)
      formDataToSend.append('title', formData.education)
      formDataToSend.append('bio', formData.bio)
      formDataToSend.append('company', formData.location)
      
      await axios.post('http://localhost:8000/api/instructor/profile/update', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })
      
      setIsEditing(false)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset form data to original values if needed
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deleted')
      alert('Account deletion requested. This will be processed by admin.')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {/* Header with Edit/Save Button */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
          <div className="flex gap-3">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Profile Photo Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <img
            src="https://api.dicebear.com/6.x/initials/svg?seed=SI"
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-green-100"
          />
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">Upload a professional photo. JPG or PNG, max 2MB</p>
            <div className="flex gap-3">
              <button 
                disabled={!isEditing}
                className={`px-4 py-2 ${isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-lg text-sm transition`}
              >
                Upload New Photo
              </button>
              <button 
                disabled={!isEditing}
                className={`px-4 py-2 border ${isEditing ? 'border-gray-300 hover:bg-gray-50' : 'border-gray-200 cursor-not-allowed'} text-gray-700 rounded-lg text-sm transition`}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Form */}
      <form onSubmit={handleSave}>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
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
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expertise <span className="text-red-500">*</span>
              </label>
              <select
                name="expertise"
                value={formData.expertise}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                required
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Data Science">Data Science</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="DevOps">DevOps</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                  !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
                min="0"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Education <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio <span className="text-red-500">*</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows="4"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                !isEditing ? 'bg-gray-50 cursor-not-allowed' : ''
              }`}
              placeholder="Tell us about yourself and your teaching experience..."
              required
            />
          </div>
        </div>
      </form>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-red-200">
        <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-gray-600 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button
          onClick={handleDelete}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Account
        </button>
      </div>
      </>
      )}
    </div>
  )
}

export default Profile
