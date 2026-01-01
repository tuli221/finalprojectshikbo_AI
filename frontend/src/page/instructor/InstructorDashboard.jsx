import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MyCourses from './MyCourses'
import Students from './Students'
import Messages from './Messages'
import Profile from './Profile'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const isActive = (path) => location.pathname === path

  const renderContent = () => {
    const path = location.pathname
    
    if (path === '/instructor/my-courses') return <MyCourses />
    if (path === '/instructor/students') return <Students />
    // payments removed
    if (path === '/instructor/messages') return <Messages />
    if (path === '/instructor/profile') return <Profile />
    
    // Default dashboard content
    // If user is instructor but hasn't sent a request yet, show CTA
    const requestSent = localStorage.getItem('instructor_request_sent')
    if (user?.role === 'instructor' && !requestSent) {
      return (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-2xl font-semibold mb-2">Complete your Instructor Profile</h3>
            <p className="text-gray-600 mb-4">Before you can access instructor features, complete your profile and request instructor approval.</p>
            <div className="flex gap-3">
              <Link to="/instructor/request" className="px-4 py-2 bg-green-600 text-white rounded-lg">Complete Profile / Request</Link>
              <Link to="/instructor/profile" className="px-4 py-2 border rounded-lg">Edit Account Profile</Link>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 rounded-xl shadow">
            <p className="text-white font-semibold mb-2">My Courses</p>
            <h3 className="text-3xl font-bold">0</h3>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 rounded-xl shadow">
            <p className="text-white font-semibold mb-2">Total Students</p>
            <h3 className="text-3xl font-bold">0</h3>
          </div>
          <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 rounded-xl shadow">
            <p className="text-white font-semibold mb-2">Earnings</p>
            <h3 className="text-3xl font-bold">৳0</h3>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  )
}

export default InstructorDashboard
