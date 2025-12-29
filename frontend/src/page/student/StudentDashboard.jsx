import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const stats = [
  { title: 'Course Enrolled', value: 5 },
  { title: 'Lessons Completed', value: 12 },
  { title: 'XP Earned', value: 1240 }
]

const courses = [
  { id: 1, category: 'Web Development', title: 'Complete Web Development with React', description: 'Learn React with hands-on projects.', price: 0, image: '' },
  { id: 2, category: 'AI & ML', title: 'Machine Learning Fundamentals', description: 'Learn ML algorithms with Python.', price: 0, image: '' },
  { id: 3, category: 'Data Science', title: 'Data Science with Python', description: 'Real-world Data Visualization Project.', price: 0, image: '' }
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)

  return (
    <div>

      {/* Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {stats.map((s) => (
          <div key={s.title} className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
            <div>
              <p className="text-bold opacity-80">{s.title}</p>
              <h3 className="text-3xl font-bold">{s.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Recommended Courses */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recommended Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => (
            <div key={c.id} className="bg-white rounded-lg shadow border p-6">
              <div className="h-36 bg-gray-50 rounded-md mb-4 flex items-start">
                <img alt={c.title} src={c.image} className="h-full w-full object-cover rounded-md" />
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
          ))}
        </div>
      </section>
    </div>
  )
}