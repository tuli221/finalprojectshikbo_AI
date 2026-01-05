import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import api from '../../config/api'

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    courseUpdates: true,
    marketingEmails: false
  })
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { user } = useAuth()

  useEffect(() => {
    if (!user) return
    setFormData(prev => ({
      ...prev,
      fullName: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || ''
    }))
  }, [user])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    try {
      // send to backend to persist
      (async () => {
        try {
          const res = await api.put('/user/profile', {
            name: formData.fullName || undefined,
            email: formData.email || undefined,
            phone: formData.phone || undefined,
            bio: formData.bio || undefined,
          })
          const updatedUser = res.data.user || {}
          // merge into localStorage user object
          const stored = JSON.parse(localStorage.getItem('user') || '{}')
          const merged = { ...stored, ...updatedUser }
          localStorage.setItem('user', JSON.stringify(merged))
          setSuccessMsg(res.data.message || 'Profile saved')
          setTimeout(() => setSuccessMsg(''), 4000)
        } catch (err) {
          console.error('Failed to save profile to server', err)
          const m = err.response?.data?.message || 'Failed to save profile'
          setErrorMsg(m)
          setTimeout(() => setErrorMsg(''), 5000)
        }
      })()
    } catch (err) {
      console.error('Failed to save profile locally', err)
    }
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    const current = formData.currentPassword
    const next = formData.newPassword
    const confirm = formData.confirmPassword

    if (!current || !next) {
      alert('Please enter current and new password')
      return
    }
    if (next !== confirm) {
      alert('New password and confirmation do not match')
      return
    }

    (async () => {
      try {
        const res = await api.post('/user/password', {
          current_password: current,
          new_password: next,
          new_password_confirmation: confirm
        })
        setSuccessMsg(res.data.message || 'Password updated')
        setTimeout(() => setSuccessMsg(''), 4000)
        // clear password fields
        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      } catch (err) {
        console.error('Password change failed', err)
        const msg = err.response?.data?.message || 'Failed to change password'
        setErrorMsg(msg)
        setTimeout(() => setErrorMsg(''), 5000)
      }
    })()
  }

  return (
    <div className="w-full">

      {/* Inline toasts for success / error */}
      {successMsg && (
        <div className="fixed top-6 right-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-4">
            <div className="font-semibold">{successMsg}</div>
            <button onClick={() => setSuccessMsg('')} className="ml-2 text-green-700 font-bold">OK</button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="fixed top-6 right-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center gap-4">
            <div className="font-semibold">{errorMsg}</div>
            <button onClick={() => setErrorMsg('')} className="ml-2 text-red-700 font-bold">Close</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <div id="profile" className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h4>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                ></textarea>
              </div>

              <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
                Save Changes
              </button>
            </form>
          </div>

          {/* Password Section */}
          <div id="password" className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Change Password</h4>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button type="submit" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
                Update Password
              </button>
            </form>
          </div>

         
        </div>
      </div>
    </div>
  )
}

export default Settings
