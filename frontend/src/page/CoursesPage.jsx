import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'
import ChatButton from '../component/ui/ChatBot'
import CourseCard from '../component/sections/Course/CourseCard'

const CoursesPage = () => {
  const navigate = useNavigate()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [courses, setCourses] = useState([])

  // Fetch courses from API
  useEffect(() => {
    axios.get("http://localhost:8000/api/courses")
      .then(res => setCourses(res.data))
      .catch(err => console.error(err));
  }, []);

  // Filter courses based on search query
  const filteredCourses = searchQuery
    ? courses.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : courses

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-emerald-950 to-emerald-950 min-h-screen">
      
      {/* Navbar */}
      <Navbar />

      {/* Header Section */}
      <div className="md:w-1/2 space-y-6 text-center mx-auto text-white pt-8">
        <h1 className="text-2xl md:text-2xl font-semibold leading-tight text-white">
          Discover courses designed to help you master the skills needed for your dream tech career
        </h1>
      </div>

      {/* Search Section */}
      <section className="bg-green-600 w-screen py-6 shadow-md rounded-2xl hover:border hover:border-green-white max-w-[1400px] mx-auto mt-8">
        <div className="max-w-full mx-auto px-6">
          <div className="flex items-center bg-white hover:border hover:border-black rounded-full shadow-md px-4 py-3">
            <i className="fa-solid fa-magnifying-glass text-gray-500"></i>
            <input
              type="text"
              placeholder="Search courses, instructors, topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              list="suggestions"
              id="course-search"
              autoComplete="off"
              className="w-full outline-none ml-3 text-gray-700"
            />
            <datalist id="suggestions">
              <option value="Machine Learning Fundamentals" />
              <option value="Data Science with Python" />
              <option value="AI & Machine Learning" />
              <option value="Web Development" />
              <option value="Web Development with Mern" />
            </datalist>
          </div>

          <button className="flex items-center gap-2 mt-2 text-black font-medium">
            <i className="fa-solid fa-sliders"></i>
            Filters
          </button>
        </div>
      </section>

      {/* Course Count */}
      <div className="text-white -mb-8 mt-2 px-6 max-w-[1400px] mx-auto">
        <p>
          Showing <span className="font-semibold">{filteredCourses.length}</span> of {courses.length} courses
        </p>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto p-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Footer */}
      <Footer />

      {/* Chatbot */}
      <ChatButton isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}

export default CoursesPage
