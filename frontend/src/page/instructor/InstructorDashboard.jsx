import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MyCourses from './MyCourses'
import Students from './Students'
import Payments from './Payments'
import Messages from './Messages'
import Profile from './Profile'

const InstructorDashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  const isActive = (path) => location.pathname === path

  const renderContent = () => {
    const path = location.pathname
    
    if (path === '/instructor/my-courses') return <MyCourses />
    if (path === '/instructor/students') return <Students />
    if (path === '/instructor/payments') return <Payments />
    if (path === '/instructor/messages') return <Messages />
    if (path === '/instructor/profile') return <Profile />
    
    // Default dashboard content
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-2xl font-bold mb-4">Welcome to Instructor Dashboard</h3>
          <p className="text-gray-600">View your assigned courses in the "My Courses" section</p>
        </div>

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
