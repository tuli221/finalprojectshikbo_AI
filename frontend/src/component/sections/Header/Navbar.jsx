import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

const Navbar = ({ hideLogin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isAuthenticated } = useAuth()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking on a link
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    setShowProfileDropdown(false)
    navigate('/')
    setIsMenuOpen(false)
  }

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'admin') return '/admin/dashboard'
    if (user.role === 'instructor') return '/instructor/dashboard'
    return '/student/dashboard'
  }

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white/80 shadow-md sticky top-0 z-50 backdrop-blur-sm">
      {/* Logo */}
      <div className="flex items-center">
        <img src="/assets/downloadShikbo.png" alt="Shikhbo.AI Logo" className="h-10" />
      </div>

      {/* Desktop Menu */}
      <ul className="hidden md:flex space-x-6 font-medium items-center">
        <li><Link to="/" className={`hover:text-green-500 ${location.pathname === '/' ? 'text-green-500 underline' : ''}`}>Home</Link></li>
        <li><Link to="/courses" className={`hover:text-green-500 ${location.pathname === '/courses' ? 'text-green-500 underline' : ''}`}>Courses</Link></li>
        <li><Link to="/learning-center" className={`hover:text-green-500 ${location.pathname === '/learning-center' ? 'text-green-500 underline' : ''}`}>Learning center</Link></li>
        <li><Link to="/instructors" className={`hover:text-green-500 ${location.pathname === '/instructors' ? 'text-green-500 underline' : ''}`}>Instructors</Link></li>
        <li><Link to="/leaderboard" className={`hover:text-green-500 ${location.pathname === '/leaderboard' ? 'text-green-500 underline' : ''}`}>Leaderboard</Link></li>
        
        {/* Show login button only if not authenticated */}
        {!hideLogin && !isAuthenticated() && (
          <Link to="/login" className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-green-500 transition">
            <span className="font-semibold">Log in</span>
          </Link>
        )}

        {/* Show profile dropdown if authenticated */}
        {isAuthenticated() && (
          <div className="relative">
            <button 
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 bg-white shadow-md px-4 py-2 rounded-full hover:shadow-lg transition"
            >
              <span className="font-semibold text-gray-800">{user?.name}</span>
              <img 
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.name}`} 
                className="w-8 h-8 rounded-full" 
                alt="Profile" 
              />
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                <button
                  onClick={() => {
                    navigate(getDashboardPath())
                    setShowProfileDropdown(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>

                <div className="border-t border-gray-100 my-1"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        )}
      </ul>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-2xl"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg md:hidden">
          <ul className="flex flex-col space-y-4 p-6">
            <li><Link to="/" onClick={handleLinkClick} className={`hover:text-green-500 ${location.pathname === '/' ? 'text-green-500 underline' : ''}`}>Home</Link></li>
            <li><Link to="/courses" onClick={handleLinkClick} className={`hover:text-green-500 ${location.pathname === '/courses' ? 'text-green-500 underline' : ''}`}>Courses</Link></li>
            <li><Link to="/learning-center" onClick={handleLinkClick} className={`hover:text-green-500 ${location.pathname === '/learning-center' ? 'text-green-500 underline' : ''}`}>Learning center</Link></li>
            <li><Link to="/instructors" onClick={handleLinkClick} className={`hover:text-green-500 ${location.pathname === '/instructors' ? 'text-green-500 underline' : ''}`}>Instructors</Link></li>
            <li><Link to="/leaderboard" onClick={handleLinkClick} className={`hover:text-green-500 ${location.pathname === '/leaderboard' ? 'text-green-500 underline' : ''}`}>Leaderboard</Link></li>
            
            {/* Show login button only if not authenticated */}
            {!hideLogin && !isAuthenticated() && (
              <Link to="/login" onClick={handleLinkClick} className="bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-green-500 transition text-center">
                <span className="font-semibold">Log in</span>
              </Link>
            )}
            
            {/* Show profile options if authenticated */}
            {isAuthenticated() && (
              <div className="flex flex-col space-y-2 border-t border-gray-200 pt-2">
                <button
                  onClick={() => {
                    navigate(getDashboardPath())
                    handleLinkClick()
                  }}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  )
}

export default Navbar