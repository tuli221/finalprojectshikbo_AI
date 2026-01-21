import React, { useState, useEffect } from 'react'
import api from '../../config/api'

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState({
    overview: {},
    coursePerformance: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/admin/analytics')
        setAnalyticsData(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading analytics...</div>
      </div>
    )
  }

  const { overview, coursePerformance } = analyticsData

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Users</p>
            <h3 className="text-3xl font-bold">{overview.totalUsers || 0}</h3>
          </div>
          <div className="text-4xl opacity-80">👥</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Active Courses</p>
            <h3 className="text-3xl font-bold">{overview.activeCourses || 0}</h3>
          </div>
          <div className="text-4xl opacity-80">📚</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Revenue</p>
            <h3 className="text-3xl font-bold">৳{Number(overview.totalRevenue || 0).toLocaleString()}</h3>
          </div>
          <div className="text-4xl opacity-80">💰</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Pending Revenue</p>
            <h3 className="text-3xl font-bold">৳{Number(overview.pendingRevenue || 0).toLocaleString()}</h3>
          </div>
          <div className="text-4xl opacity-80">⏳</div>
        </div>
      </section>

      {/* Course Performance */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-6">Course Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-black border-b bg-gray-50">
                <th className="p-3">Course Name</th>
                <th className="p-3">Enrollments</th>
                <th className="p-3">Revenue (৳)</th>
                <th className="p-3">Completion Rate</th>
                <th className="p-3">Performance</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {coursePerformance && coursePerformance.length > 0 ? coursePerformance.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{course.course}</td>
                  <td className="p-3">{course.enrollments}</td>
                  <td className="p-3 font-bold">৳{course.revenue.toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${course.completion}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold">{course.completion}%</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        course.completion >= 80
                          ? 'bg-green-100 text-green-600'
                          : course.completion >= 70
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {course.completion >= 80
                        ? 'Excellent'
                        : course.completion >= 70
                        ? 'Good'
                        : 'Needs Improvement'}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="p-3 text-center text-gray-500">No course data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section - Removed static monthly data (can be added later with proper backend) */}
      
      {/* Additional Metrics - Using dynamic data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Students</h4>
          <p className="text-2xl font-bold text-green-600">{overview.totalStudents || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Total enrolled students</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Instructors</h4>
          <p className="text-2xl font-bold text-green-600">{overview.totalInstructors || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Active instructors</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Total Revenue</h4>
          <p className="text-2xl font-bold text-green-600">৳{Number(overview.totalRevenue || 0).toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">From completed payments</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
