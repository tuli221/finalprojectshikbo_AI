import React, { useState } from 'react'
import api from '../../../config/api'
import { useNavigate } from 'react-router-dom'

const CourseCard = ({ course }) => {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)

  // Support course objects from static data and from API responses
  const id = course.id
  const level = course.level || course.level_name || 'Beginner'
  const category = course.category || ''
  const courseType = course.type || course.mode || ''
  const title = course.title || ''
  const description = course.description || ''
  const duration = typeof course.duration === 'number' ? `${course.duration} hours` : (course.duration || '—')
  const students = course.enrolled_count ? `${course.enrolled_count} students` : (course.students || '0 students')
  const rating = course.rating ?? 4.8
  // Show discount price as the main price when available, otherwise show regular price.
  const price = (course.discount_price !== undefined && course.discount_price !== null && course.discount_price !== '')
    ? course.discount_price
    : (course.price ?? '0')
  const originalPrice = (course.discount_price !== undefined && course.discount_price !== null && course.discount_price !== '')
    ? (course.price ?? '')
    : ''
  const lessons = course.lessons ?? 0
  // Normalize thumbnail to an absolute URL if provided by backend
  let imageSrc = course.imageSrc || ''
  if (!imageSrc && course.thumbnail) {
    const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : 'http://localhost:8000'
    imageSrc = course.thumbnail.startsWith('http') ? course.thumbnail : `${base}/storage/${course.thumbnail}`
  }
  if (!imageSrc) imageSrc = '/assets/React.jpg'

  const toggleDescription = () => {
    setIsExpanded(!isExpanded)
  }

  const truncatedDescription = description.length > 100 && !isExpanded 
    ? `${description.substring(0, 100)}...` 
    : description

  return (
    <div 
      className="bg-[#11161b] rounded-2xl overflow-hidden shadow-lg border-2 border-gray-700 hover:border-green-500 transition-all duration-300 h-full flex flex-col relative"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={imageSrc} 
          alt={title} 
          className="h-48 sm:h-56 w-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 left-3 right-3 flex justify-between">
          <span className={`${level === 'Intermediate' ? 'bg-yellow-500 text-black' : 'bg-red-600 text-white'} text-xs sm:text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm`}>
            {level}
          </span>
          <span className="bg-green-500 text-black text-xs sm:text-sm font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            Featured
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <p className="text-green-400 text-sm font-semibold">{category}</p>
          {courseType && (
            <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${courseType.toLowerCase() === 'online' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}`}>
              {courseType}
            </span>
          )}
        </div>
        <h3 className="text-white font-bold text-lg sm:text-xl mb-3 line-clamp-2 hover:text-green-400 transition-colors duration-300">
          {title}
        </h3>
        
        {/* Description with expand functionality */}
        <div className="mb-4 flex-1">
          <p className="text-gray-400 text-sm leading-relaxed">
            {truncatedDescription}
          </p>
          {description.length > 100 && (
            <button 
              onClick={toggleDescription}
              className="text-green-400 text-xs font-semibold mt-2 hover:underline focus:outline-none"
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </button>
          )}
        </div>

        {/* Course Info */}
        <div className="flex items-center text-gray-400 text-xs sm:text-sm mb-4 space-x-3 sm:space-x-4 flex-wrap">
          <span className="flex items-center">
            <i className="fa-regular fa-clock mr-1 text-green-400"></i>
            {duration}
          </span>
          <span className="flex items-center">
            <i className="fa-solid fa-users mr-1 text-green-400"></i>
            {students}
          </span>
          <span className="flex items-center">
            <i className="fa-solid fa-star mr-1 text-yellow-400"></i>
            {rating}
          </span>
        </div>

        {/* Price and Lessons */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400">৳{price}</span>
            <span className="text-gray-500 line-through ml-2 text-sm sm:text-base">৳{originalPrice}</span>
          </div>
          <span className="text-gray-400 text-sm bg-gray-800 px-2 py-1 rounded">
            {lessons} lessons
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-4 flex items-center">
          <i className="fa-solid fa-bolt text-yellow-400 mr-2"></i>
          50% off! One-time payment
        </p>
        
        <button 
          onClick={() => navigate(`/course/${id}`)}
          className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
        >
          <span className="relative z-10 group-hover:text-white transition-colors duration-300">
            View Details
          </span>
          <div className="absolute inset-0 bg-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
        </button>
      </div>
    </div>
  )
}

export default CourseCard