import React, { useState } from 'react'

const Settings = () => {
  const [formData, setFormData] = useState({
    fullName: 'Student Name',
    email: 'student@example.com',
    phone: '+880 123-456-7890',
    bio: 'Passionate learner exploring new technologies',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    courseUpdates: true,
    marketingEmails: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleProfileUpdate = (e) => {
    e.preventDefault()
    console.log('Profile updated:', formData)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    console.log('Password change requested')
  }

  return (
    <div className="w-full">

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

          {/* Notifications Section */}
          <div id="notifications" className="bg-white rounded-xl shadow-lg p-6">
            <h4 className="text-lg font-bold text-gray-800 mb-4">Notification Preferences</h4>
            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Email Notifications</span>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Course Updates</span>
                <input
                  type="checkbox"
                  name="courseUpdates"
                  checked={formData.courseUpdates}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-gray-700">Marketing Emails</span>
                <input
                  type="checkbox"
                  name="marketingEmails"
                  checked={formData.marketingEmails}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <h4 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h4>
            <p className="text-sm text-gray-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
