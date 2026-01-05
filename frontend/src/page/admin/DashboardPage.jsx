import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../config/api'

const DashboardPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [searchInstructor, setSearchInstructor] = useState('')

  const [students, setStudents] = useState([])
  const [instructors, setInstructors] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [sRes, cRes, iRes] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin/courses'),
          api.get('/admin/instructors/users')
        ])
        setStudents(sRes.data || [])
        setCourses(cRes.data || [])
        setInstructors(iRes.data || [])
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Count active students as those who are enrolled in a course
  const activeStudentsCount = (students || []).filter(s => {
    // backend may provide a `course` relation or a `course_id` field
    return !!(s?.course || s?.course_id)
  }).length

  return (
    <>
      {/* STATS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Active Students</p>
            <h3 className="text-3xl font-bold">{(activeStudentsCount || 0).toLocaleString()}</h3>
          </div>
          <div className="text-4xl opacity-80">👥</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Instructors</p>
            <h3 className="text-3xl font-bold">{instructors ? instructors.length.toLocaleString() : '0'}</h3>
          </div>
          <div className="text-4xl opacity-80">🎓</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Courses</p>
            <h3 className="text-3xl font-bold">{courses ? courses.length.toLocaleString() : '0'}</h3>
          </div>
          <div className="text-4xl opacity-80">📚</div>
        </div>
      </section>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* USERS TABLE */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Recent Users</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search user..."
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <button className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow">
                  + New
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-sm text-black border-b bg-gray-50">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Course</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {loading && <tr><td colSpan="5" className="p-4 text-gray-600">Loading...</td></tr>}
                  {!loading && students
                    .filter(s => s.name.toLowerCase().includes(searchUser.toLowerCase()) || s.email.toLowerCase().includes(searchUser.toLowerCase()))
                    .map((user) => (
                      <tr key={`stu-${user.id}`} className="hover:bg-gray-50">
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">{user.email}</td>
                        <td className="p-3">{user.course?.title || '-'}</td>
                        <td
                          className={`p-3 font-semibold ${
                            user.status === 'Active' ? 'text-green-600' : (user.status === 'Pending' ? 'text-yellow-600' : 'text-gray-600')
                          }`}
                        >
                          {user.status}
                        </td>
                        <td className="p-3">
                          <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm mr-2"
                            onClick={() => navigate('/admin/users', { state: { openViewId: user.id } })}
                          >
                            View
                          </button>
                          <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm"
                            onClick={() => navigate('/admin/users', { state: { openEditId: user.id } })}
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* INSTRUCTOR LIST */}
          <div className="bg-white p-7 rounded-2xl shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Instructors</h3>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search instructor..."
                  value={searchInstructor}
                  onChange={(e) => setSearchInstructor(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                />
                <button className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm shadow">
                  Approve
                </button>
              </div>
            </div>

            <ul className="space-y-3">
              {instructors.filter(i => i.name.toLowerCase().includes(searchInstructor.toLowerCase())).map((instructor) => {
                const initials = instructor.name ? instructor.name.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() : ''
                return (
                  <li key={instructor.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-700">
                        {initials}
                      </div>
                      <div>
                        <p className="font-semibold">{instructor.name}</p>
                        <p className="text-sm text-black">Instructor • {instructor.total_courses || instructor.courses || 0} courses</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm" onClick={() => navigate('/admin/instructors', { state: { openViewId: instructor.id } })}>
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm" onClick={() => navigate('/admin/instructors', { state: { openEditId: instructor.id } })}>
                        Edit
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <aside className="space-y-6">
          {/* PAYMENTS BOX */}
          <div className="bg-white p-4 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Payments Overview</h3>

            <div className="text-sm text-black mb-4">Total Revenue: <span className="font-bold text-green-600">৳2,340,000</span></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Successful</p>
                  <p className="font-semibold">৳2,100,000</p>
                </div>
                <span className="text-green-600 font-bold">+8%</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Pending</p>
                  <p className="font-semibold">৳120,000</p>
                </div>
                <span className="text-yellow-600 font-bold">-2%</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Refunds</p>
                  <p className="font-semibold">৳20,000</p>
                </div>
                <span className="text-red-600 font-bold">+1%</span>
              </div>
            </div>
          </div>

          {/* ANALYTICS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Analytics</h3>

            <svg viewBox="0 0 200 40" className="w-full h-12 mb-3">
              <polyline
                fill="none"
                stroke="#16a34a"
                strokeWidth="3"
                points="0,30 30,18 60,22 90,10 120,14 150,6 180,12 200,8"
              />
            </svg>

            <div className="space-y-3 text-sm">
              <div>
                <div className="flex justify-between mb-1">
                  <span>Web Dev</span>
                  <span>500</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Machine Learning</span>
                  <span>350</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Data Science</span>
                  <span>300</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-green-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-xl font-semibold">Add / Edit Course</h4>
              <button onClick={() => setShowModal(false)} className="text-black text-xl">
                ✖
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  className="border rounded px-3 py-2"
                  placeholder="Course Title"
                />
                <input type="text" className="border rounded px-3 py-2" placeholder="Category" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input type="number" className="border rounded px-3 py-2" placeholder="Price" />
                <input
                  type="number"
                  className="border rounded px-3 py-2"
                  placeholder="Duration (Months)"
                />
              </div>

              <textarea
                className="border w-full rounded px-3 py-2"
                placeholder="Write Description..."
              ></textarea>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="border px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
    
  )
}

export default DashboardPage
