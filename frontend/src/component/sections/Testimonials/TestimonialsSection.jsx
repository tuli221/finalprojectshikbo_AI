import React, { useState, useEffect } from 'react'
import { testimonialsData } from '../../../data/testimonialsData.js'

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play testimonials
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToTestimonial = (index) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
    
    // Resume auto-play after manual navigation
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonialsData.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8" id="success-stories">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-gray-300">
            Hear from students who transformed their careers with us
          </p>
        </div>

        {/* Carousel for Mobile */}
        <div className="lg:hidden">
          <div className="relative bg-black/80 border border-gray-700 rounded-2xl p-6 shadow-md mb-6 transition-all duration-500">
            <TestimonialCard testimonial={testimonialsData[currentTestimonial]} />
          </div>
          
          {/* Carousel Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button 
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              <i className="fa-solid fa-chevron-left text-white"></i>
            </button>
            
            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-green-500 scale-125' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors duration-300"
            >
              <i className="fa-solid fa-chevron-right text-white"></i>
            </button>
          </div>
        </div>

        {/* Grid for Desktop */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonialsData.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-black/80 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-green-500/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
              onClick={() => goToTestimonial(index)}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const TestimonialCard = ({ testimonial }) => {
  if (!testimonial) return null;

  const [isExpanded, setIsExpanded] = useState(false)

  const toggleQuote = () => {
    setIsExpanded(!isExpanded)
  }

  const displayQuote =
    testimonial.text && testimonial.text.length > 150 && !isExpanded
      ? `${testimonial.text.substring(0, 150)}...`
      : testimonial.text;

  return (
    <>
      {/* Stars */}
      <div className="flex items-center text-green-400 mb-4">
        {[...Array(testimonial.rating || 5)].map((_, i) => (
          <i key={i} className="fa-solid fa-star text-sm sm:text-base"></i>
        ))}
      </div>
      
      {/* Quote */}
      <div className="mb-6">
        <p className="text-gray-300 italic text-sm sm:text-base leading-relaxed">
          "{displayQuote}"
        </p>
        {testimonial.text && testimonial.text.length > 150 && (
          <button 
            onClick={toggleQuote}
            className="text-green-400 text-xs font-semibold mt-2 hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show Less' : 'Read More'}
          </button>
        )}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img 
          src={testimonial.image}
          alt={testimonial.name}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-green-400 object-cover"
        />
        <div>
          <h4 className="font-semibold text-white text-sm sm:text-base">
            {testimonial.name}
          </h4>
          <p className="text-gray-400 text-xs sm:text-sm">
            {testimonial.role}
          </p>
        </div>
      </div>
    </>
  )
}
export default TestimonialsSection