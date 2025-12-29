import React, { useState } from 'react'

const DashboardPage = () => {
  const [showModal, setShowModal] = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [searchInstructor, setSearchInstructor] = useState('')

  const users = [
    { name: 'Bob', email: 'bob@example.com', course: 'AI Fundamentals', status: 'Active' },
    { name: 'Mim', email: 'mim@example.com', course: 'Web Dev', status: 'Pending' }
  ]

  const instructors = [
    { name: 'Tania Mia', initials: 'TM', courses: 5 },
    { name: 'Arif Rahman', initials: 'AR', courses: 3 }
  ]

  return (
    <>
      {/* STATS CARDS */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Active Students</p>
            <h3 className="text-3xl font-bold">5,432</h3>
          </div>
          <div className="text-4xl opacity-80">👥</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Courses</p>
            <h3 className="text-3xl font-bold">12</h3>
          </div>
          <div className="text-4xl opacity-80">📚</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">This Month Earnings</p>
            <h3 className="text-3xl font-bold">৳380,000</h3>
          </div>
          <div className="text-4xl opacity-80">💳</div>
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
                  {users.map((user, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{user.course}</td>
                      <td
                        className={`p-3 font-semibold ${
                          user.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {user.status}
                      </td>
                      <td className="p-3">
                        <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm mr-2">
                          View
                        </button>
                        <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm">
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
              {instructors.map((instructor, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center font-semibold text-green-700">
                      {instructor.initials}
                    </div>
                    <div>
                      <p className="font-semibold">{instructor.name}</p>
                      <p className="text-sm text-black">
                        Instructor • {instructor.courses} courses
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                      Message
                    </button>
                    <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm">
                      Block
                    </button>
                  </div>
                </li>
              ))}
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
