import React from 'react'

const AnalyticsPage = () => {
  const analyticsData = {
    overview: [
      { label: 'Total Users', value: 5432, change: '+12%', trend: 'up' },
      { label: 'Active Courses', value: 12, change: '+3', trend: 'up' },
      { label: 'Total Revenue', value: '৳2.34M', change: '+18%', trend: 'up' },
      { label: 'Completion Rate', value: '78%', change: '-2%', trend: 'down' }
    ],
    coursePerformance: [
      { course: 'AI Fundamentals', enrollments: 432, revenue: 2160000, completion: 85 },
      { course: 'Web Development', enrollments: 856, revenue: 3852000, completion: 78 },
      { course: 'Data Science', enrollments: 623, revenue: 3738000, completion: 92 },
      { course: 'MERN Stack', enrollments: 512, revenue: 2816000, completion: 71 },
      { course: 'Mobile Development', enrollments: 289, revenue: 1387200, completion: 68 }
    ],
    monthlyData: [
      { month: 'Jan', users: 423, revenue: 185000 },
      { month: 'Feb', users: 512, revenue: 234000 },
      { month: 'Mar', users: 689, revenue: 312000 },
      { month: 'Apr', users: 834, revenue: 398000 },
      { month: 'May', users: 956, revenue: 445000 },
      { month: 'Jun', users: 1123, revenue: 512000 }
    ]
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Users</p>
            <h3 className="text-3xl font-bold">5,432</h3>
          </div>
          <div className="text-4xl opacity-80">👥</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Active Courses</p>
            <h3 className="text-3xl font-bold">12</h3>
          </div>
          <div className="text-4xl opacity-80">📚</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Revenue</p>
            <h3 className="text-3xl font-bold">৳2.34M</h3>
          </div>
          <div className="text-4xl opacity-80">💰</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Completion Rate</p>
            <h3 className="text-3xl font-bold">78%</h3>
          </div>
          <div className="text-4xl opacity-80">✅</div>
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
              {analyticsData.coursePerformance.map((course, index) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-6">User Growth (6 Months)</h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{data.month}</span>
                  <span className="text-sm font-bold text-green-600">{data.users} users</span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-700 to-green-400 h-3 rounded-full"
                    style={{
                      width: `${
                        (data.users / Math.max(...analyticsData.monthlyData.map((d) => d.users))) *
                        100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Growth Chart */}
        <div className="bg-white p-8 rounded-2xl shadow">
          <h3 className="text-xl font-semibold mb-6">Revenue Growth (6 Months)</h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{data.month}</span>
                  <span className="text-sm font-bold text-green-600">
                    ৳{(data.revenue / 1000).toFixed(0)}k
                  </span>
                </div>
                <div className="bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-700 to-blue-400 h-3 rounded-full"
                    style={{
                      width: `${
                        (data.revenue /
                          Math.max(...analyticsData.monthlyData.map((d) => d.revenue))) *
                        100
                      }%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Top Performing Instructor</h4>
          <p className="text-2xl font-bold text-green-600">Dr. Jane Smith</p>
          <p className="text-sm text-gray-600 mt-1">5 courses • 1,234 students</p>
          <p className="text-sm text-gray-600">Rating: 4.8/5.0</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Most Popular Course</h4>
          <p className="text-2xl font-bold text-green-600">Web Development</p>
          <p className="text-sm text-gray-600 mt-1">856 enrollments</p>
          <p className="text-sm text-gray-600">Revenue: ৳3.85M</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h4 className="text-lg font-semibold mb-4">Average Rating</h4>
          <p className="text-2xl font-bold text-green-600">4.7/5.0</p>
          <p className="text-sm text-gray-600 mt-1">Based on 2,341 reviews</p>
          <div className="flex gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="text-yellow-500 text-lg">
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
