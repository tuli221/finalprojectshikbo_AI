import React, { useState } from 'react'

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('')

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

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="text-center py-12">
          <i className="fa-solid fa-users text-6xl text-gray-300 mb-4"></i>
          <p className="text-gray-600 text-lg">No students enrolled yet</p>
          <p className="text-gray-500 text-sm mt-2">Students will appear here when they enroll in your courses</p>
        </div>
      </div>
    </div>
  )
}

export default Students
