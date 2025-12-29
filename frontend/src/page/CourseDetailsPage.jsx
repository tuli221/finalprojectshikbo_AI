import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { courseDetailsData } from '../data/courseDetailsData'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'

const CourseDetailsPage = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const course = courseDetailsData[courseId]
  const [expandedModules, setExpandedModules] = useState({})

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Course Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const toggleModule = (moduleNumber) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleNumber]: !prev[moduleNumber]
    }))
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gray-950 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-300 hover:text-green-400 mb-6 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Courses
          </button>
          <br />

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            {/* LEFT CONTENT */}
            <div>
              <div className="flex gap-4 items-center mb-4">
                <span className="bg-green-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {course.level}
                </span>
                <span className="text-gray-300">{course.category}</span>
              </div>

              <h1 className="text-4xl font-bold mb-3">{course.fullTitle}</h1>

              <p className="text-gray-300 text-lg mb-6">
                {course.description}
              </p>

              <div className="flex items-center gap-6 text-gray-400 text-sm">
                <div className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-gray-300"></i>
                  {course.duration}
                </div>

                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-users text-gray-300"></i>
                  {course.students} students
                </div>

                <div className="flex items-center gap-1">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  {course.rating}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR CARD */}
            <div className="bg-gray-800 rounded-3xl p-3 shadow-xl w-full md:max-w-[700px] md:-mt-16">
              <img 
                src={course.imageSrc}
                alt={course.title}
                className="rounded-xl mb-6 w-full h-40 object-cover"
              />

              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-green-400 mb-1">৳{course.price}</h2>
                <p className="text-gray-400 line-through">৳{course.originalPrice}</p>
                <p className="text-gray-300 text-sm mb-6">50% off! One-time payment</p>

                <button className="w-full bg-green-500 hover:bg-green-600 text-gray-900 font-semibold py-3 rounded-xl text-lg transition">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-4">About This Course</h2>
              <p className="text-gray-300 leading-relaxed">
                {course.about}
              </p>
            </div>

            {/* What you'll learn */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <span className="text-green-500 text-3xl">📗</span> What You'll Learn
              </h2>

              <ul className="list-disc text-white ml-6 space-y-3 leading-relaxed">
                {course.whatYouLearn.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Modules */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold mb-6">Course Modules</h2>

              <div className="space-y-4">
                {course.modules.map((module) => (
                  <div 
                    key={module.number}
                    className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-black font-bold">
                          {module.number}
                        </div>
                        <div>
                          <p className="text-lg font-semibold">{module.title}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => toggleModule(module.number)}
                        className="p-2 text-gray-400"
                        aria-expanded={expandedModules[module.number] || false}
                      >
                        <i className={`fa-solid ${expandedModules[module.number] ? 'fa-chevron-up' : 'fa-chevron-right'}`}></i>
                      </button>
                    </div>
                    {expandedModules[module.number] && (
                      <div className="mt-3 text-sm text-gray-400 pl-12">
                        {module.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-8">
            {/* Instructor */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl text-center">
              <h3 className="text-2xl font-bold mb-6">Instructor</h3>

              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-black font-bold text-xl">
                  {course.instructor.initials}
                </div>
              </div>

              <h4 className="text-xl font-semibold">{course.instructor.name}</h4>
              <p className="text-gray-400 text-sm mt-1">{course.instructor.title}</p>
            </div>

            {/* Course details */}
            <div className="bg-black/50 backdrop-blur-xl rounded-3xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Course Details</h3>

              <div className="space-y-4 text-gray-300">
                <div className="flex justify-between">
                  <span>Duration</span>
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span>Students</span>
                  <span className="font-semibold">{course.students}</span>
                </div>
                <div className="flex justify-between">
                  <span>Rating</span>
                  <span className="font-semibold flex items-center gap-1">
                    ★ {course.rating}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Level</span>
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default CourseDetailsPage
