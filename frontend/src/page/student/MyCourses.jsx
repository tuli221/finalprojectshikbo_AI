import React, { useState } from 'react'

const MyCourses = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [enrolledCourses] = useState([
    {
      id: 1,
      title: 'Complete Web Development with React',
      instructor: 'John Doe',
      progress: 75,
      thumbnail: './download.jpeg',
      category: 'Web Development',
      totalLessons: 48,
      completedLessons: 36
    },
    {
      id: 2,
      title: 'Machine Learning Fundamentals',
      instructor: 'Jane Smith',
      progress: 60,
      thumbnail: './Data-Analysis-With-Python.svg',
      category: 'AI & ML',
      totalLessons: 42,
      completedLessons: 25
    },
    {
      id: 3,
      title: 'Data Science with Python',
      instructor: 'Alex Johnson',
      progress: 45,
      thumbnail: './images.jpeg',
      category: 'Data Science',
      totalLessons: 36,
      completedLessons: 16
    }
  ])

  const filteredCourses = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800">My Enrolled Courses</h3>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <span className="text-green-500 text-xs font-semibold">{course.category}</span>
              <h3 className="font-bold text-lg text-gray-800 mt-1 mb-2">{course.title}</h3>
              <p className="text-sm text-gray-600 mb-3">Instructor: {course.instructor}</p>
              
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-semibold text-gray-800">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                <span>{course.completedLessons}/{course.totalLessons} Lessons</span>
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
                Continue Learning
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-8 text-gray-500">No courses found</div>
      )}
    </div>
  )
}

export default MyCourses
