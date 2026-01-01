import React, { useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'

const InstructorLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    } finally {
      setShowProfileDropdown(false)
      navigate('/')
    }
  }

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const navLinks = [
    { path: '/instructor/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/instructor/my-courses', label: 'My Courses', icon: '📚' },
    { path: '/instructor/students', label: 'Students', icon: '👨‍🎓' },
    { path: '/instructor/request', label: 'Request', icon: '✉️' },
    
    { path: '/instructor/messages', label: 'Messages', icon: '💬' },
    { path: '/instructor/profile', label: 'Profile', icon: '👤' }
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
              <span>{link.icon}</span>
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
            name: 'Shikbo Instructor',
            avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=SI',
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
