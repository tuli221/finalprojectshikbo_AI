import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../config/api'

const defaultStats = {
  course_enrolled: 0,
  lessons_completed: 0,
  xp_earned: 0,
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [stats, setStats] = useState(defaultStats)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/student/dashboard')
        if (!mounted) return
        setStats(res.data.stats || defaultStats)
        setCourses(res.data.recommended || [])
      } catch (e) {
        // if unauthorized, redirect to login
        if (e.response?.status === 401 || e.response?.status === 403) {
          logout()
          navigate('/login')
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchDashboard()
    return () => { mounted = false }
  }, [])

  return (
    <div>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Course Enrolled</p>
            <h3 className="text-3xl font-bold">{stats.course_enrolled}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Lessons Completed</p>
            <h3 className="text-3xl font-bold">{stats.lessons_completed}</h3>
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">XP Earned</p>
            <h3 className="text-3xl font-bold">{stats.xp_earned}</h3>
          </div>
        </div>
      </section>

      {/* Recommended Courses */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div>Loading courses...</div>
          ) : (
            courses.map((c) => (
              <div key={c.id} className="bg-white rounded-lg shadow border p-6">
                <div className="h-36 bg-gray-50 rounded-md mb-4 flex items-start">
                  <img alt={c.title} src={c.thumbnail || c.image || ''} className="h-full w-full object-cover rounded-md" />
                </div>

                <div className="text-xs text-green-600 font-medium mb-1">{c.category}</div>
                <div className="font-semibold text-lg mb-2">{c.title}</div>
                <p className="text-black text-sm mb-4">{c.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-600 font-bold">৳{Number(c.price || 0).toLocaleString()}</span>
                  <button className="w-32 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 rounded-md text-lg transition">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}