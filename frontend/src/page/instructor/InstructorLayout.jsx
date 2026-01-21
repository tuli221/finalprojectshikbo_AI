import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import { useAuth } from '../../context/AuthContext'

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    setShowProfileDropdown(false)
    navigate('/')
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinks = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-pie' },
    { path: '/instructor/my-courses', label: 'My Courses', icon: 'fa-solid fa-book' },
    { path: '/instructor/students', label: 'Students', icon: 'fa-solid fa-user-graduate' },
    { path: '/instructor/request', label: 'Request', icon: 'fa-solid fa-paper-plane' },
    { path: '/instructor/profile', label: 'Profile', icon: 'fa-solid fa-user' }
  ]

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* SIDEBAR */}
      <aside
        className={`w-64 bg-white border-r shadow-lg p-6 space-y-6 fixed inset-y-0 left-0 z-30 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-all duration-300`}
        aria-hidden={!sidebarOpen && 'true'}
      >
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/assets/downloadShikbo.png" alt="Shikbo.AI" className="h-10 rounded-md" />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-600 text-2xl"
          >
            ✖
          </button>
        </div>

        <nav className="space-y-1 text-black font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${
                isActive(link.path)
                  ? 'bg-green-100 text-green-600'
                  : 'hover:bg-green-100 hover:text-green-600'
              }`}
            >
              <i className={link.icon}></i>
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 ml-64">
        <TopBar
          title="Instructor Dashboard"
          showSidebarToggle={true}
          onToggleSidebar={() => setSidebarOpen(true)}
          showSearch={false}
          profile={{
            name: user?.name || 'Instructor',
            avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${user?.name || 'Instructor'}`,
            actions: [
              { label: 'Profile', onClick: () => navigate('/instructor/profile') },
              { label: 'Logout', onClick: handleLogout }
            ]
          }}
        />

        <main className="max-w-7xl mx-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default InstructorLayout
