import React, { useState, useEffect } from 'react'
import api from '../../config/api'

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true)
      try {
        const res = await api.get('/instructor/students')
        setStudents(res.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStudents()
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">Students</h3>
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
        />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center py-10">Loading students...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="text-center py-12">
            <i className="fa-solid fa-users text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-600 text-lg">No students enrolled yet</p>
            <p className="text-gray-500 text-sm mt-2">Students will appear here when they enroll in your courses</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">{s.email}</td>
                  <td className="px-4 py-3">{s.course?.title || '-'}</td>
                  <td className="px-4 py-3">{s.enrollment_date ? new Date(s.enrollment_date).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Students
