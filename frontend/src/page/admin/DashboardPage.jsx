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
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch students, courses, admin users list, public instructor profiles, and payments
        const [sRes, cRes, adminUsersRes, profilesRes, paymentsRes] = await Promise.all([
          api.get('/admin/students'),
          api.get('/admin/courses'),
          api.get('/admin/instructors/users'),
          api.get('/instructors'),
          api.get('/admin/payments')
        ])

        setStudents(sRes.data || [])
        const coursesData = cRes.data || []
        setCourses(coursesData)
        setPayments(paymentsRes.data.payments || [])

        const adminUsers = adminUsersRes.data || []
        const profiles = profilesRes.data || []

        // Merge admin users and approved instructor profiles into one deduped list
        const map = new Map()
        const push = (u) => {
          if (!u) return
          const key = (u.email || u.id || '').toString().toLowerCase()
          if (!map.has(key)) map.set(key, u)
        }

        adminUsers.forEach(u => push({ id: u.id, name: u.name || '', email: u.email || '', total_courses: u.total_courses }))
        // include only approved profiles
        profiles.filter(p => p.status === 'Approved').forEach(p => push({ id: p.user_id || p.id, name: p.name || '', email: p.email || '', total_courses: p.total_courses || p.courses || 0 }))

        // Build instructors array and compute total_courses from courses list when missing or zero
        const instructorsArr = Array.from(map.values())

        // Precompute counts by various keys for robust matching
        const countsByInstructorId = new Map()
        const countsByProfileId = new Map()
        const countsByEmail = new Map()

        coursesData.forEach((c) => {
          if (!c) return
          // instructor_id
          if (c.instructor_id != null) {
            const key = String(c.instructor_id)
            countsByInstructorId.set(key, (countsByInstructorId.get(key) || 0) + 1)
          }
          // instructor_profile_id
          if (c.instructor_profile_id != null) {
            const key = String(c.instructor_profile_id)
            countsByProfileId.set(key, (countsByProfileId.get(key) || 0) + 1)
          }
          // nested relations (instructor, instructorProfile) with email
          if (c.instructor && c.instructor.email) {
            const key = String(c.instructor.email).toLowerCase()
            countsByEmail.set(key, (countsByEmail.get(key) || 0) + 1)
          }
          if (c.instructorProfile && c.instructorProfile.email) {
            const key = String(c.instructorProfile.email).toLowerCase()
            countsByEmail.set(key, (countsByEmail.get(key) || 0) + 1)
          }
        })

        const instructorsWithCounts = instructorsArr.map((u) => {
          const existing = typeof u.total_courses === 'number' ? u.total_courses : null
          if (existing && existing > 0) return u

          let count = 0
          const idKey = u.id != null ? String(u.id) : null
          const emailKey = u.email ? String(u.email).toLowerCase() : null

          if (idKey && countsByInstructorId.has(idKey)) count = countsByInstructorId.get(idKey)
          else if (idKey && countsByProfileId.has(idKey)) count = countsByProfileId.get(idKey)
          else if (emailKey && countsByEmail.has(emailKey)) count = countsByEmail.get(emailKey)
          else {
            // fallback: count courses where instructor object name/email matches
            count = coursesData.filter(c => {
              if (!c) return false
              if (idKey && (String(c.instructor_id) === idKey || String(c.instructor_profile_id) === idKey)) return true
              if (emailKey && ((c.instructor && String(c.instructor.email).toLowerCase() === emailKey) || (c.instructorProfile && String(c.instructorProfile.email).toLowerCase() === emailKey))) return true
              return false
            }).length
          }

          return { ...u, total_courses: count }
        })

        setInstructors(instructorsWithCounts)
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

  // Calculate payment statistics
  const totalRevenue = (payments || []).reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const successfulPayments = (payments || []).filter(p => p.status?.toLowerCase() === 'completed' || p.status?.toLowerCase() === 'success')
  const pendingPayments = (payments || []).filter(p => p.status?.toLowerCase() === 'pending')
  const refundPayments = (payments || []).filter(p => p.status?.toLowerCase() === 'refunded')
  
  const successfulTotal = successfulPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const pendingTotal = pendingPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
  const refundTotal = refundPayments.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)

  // Calculate course analytics from enrollments
  const courseAnalytics = courses.slice(0, 3).map(course => ({
    name: course.title,
    count: course.enrollments_count || 0
  }))
  const maxEnrollments = Math.max(...courseAnalytics.map(c => c.count), 1)

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
                <button
                  className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm shadow"
                  onClick={() => navigate('/admin/users', { state: { openAdd: true } })}
                >
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
                          <div className="flex items-center gap-1">
                            <button 
                              className="p-1.5 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded transition"
                              onClick={() => navigate(`/admin/students/${user.id}`)}
                              title="View"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button 
                              className="p-1.5 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded transition"
                              onClick={() => navigate('/admin/users', { state: { openEditId: user.id } })}
                              title="Edit"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
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
               
              </div>
            </div>

            <ul className="space-y-3">
              {instructors.filter(i => i.name.toLowerCase().includes(searchInstructor.toLowerCase())).map((instructor) => {
                // Always show 2 letters: for multi-word names use first letter of each word, for single-word use first 2 chars
                const nameParts = instructor.name ? instructor.name.trim().split(/\s+/) : []
                const initials = nameParts.length > 1 
                  ? nameParts.slice(0, 2).map(n => n[0]).join('').toUpperCase()
                  : (nameParts[0] || '').substring(0, 2).toUpperCase()
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

            <div className="text-sm text-black mb-4">Total Revenue: <span className="font-bold text-green-600">৳{totalRevenue.toLocaleString()}</span></div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Successful ({successfulPayments.length})</p>
                  <p className="font-semibold">৳{successfulTotal.toLocaleString()}</p>
                </div>
                <span className="text-green-600 font-bold text-xs">✓</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Pending ({pendingPayments.length})</p>
                  <p className="font-semibold">৳{pendingTotal.toLocaleString()}</p>
                </div>
                <span className="text-yellow-600 font-bold text-xs">⏳</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-black">Refunds ({refundPayments.length})</p>
                  <p className="font-semibold">৳{refundTotal.toLocaleString()}</p>
                </div>
                <span className="text-red-600 font-bold text-xs">↩</span>
              </div>
            </div>
          </div>

          {/* ANALYTICS */}
          <div className="bg-white p-6 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Top Courses</h3>

            <div className="space-y-3 text-sm">
              {courseAnalytics.map((course, idx) => (
                <div key={idx}>
                  <div className="flex justify-between mb-1">
                    <span className="truncate">{course.name}</span>
                    <span className="font-semibold">{course.count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: `${(course.count / maxEnrollments) * 100}%` }}></div>
                  </div>
                </div>
              ))}
              {courseAnalytics.length === 0 && (
                <p className="text-gray-500 text-center py-4">No course data available</p>
              )}
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
