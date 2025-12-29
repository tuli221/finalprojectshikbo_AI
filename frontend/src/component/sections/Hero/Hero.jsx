import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = ({ openChat }) => {
  const navigate = useNavigate()

  // Smooth scroll to sections
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
<section className="w-full py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 -mt-5" id="home">
      <div className="max-w-4xl mx-auto text-center space-y-2 sm:space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-white">
          Learn Tech with AI
        </h1>
        
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto animate-fade-in">
          Empower your future with personalized tech education. Get AI-powered course recommendations, expert guidance, and practical skills that lead to real careers.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-1">
          <button 
            onClick={() => navigate('/courses')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white font-semibold px-3 py-3 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Explore Courses
          </button>
          <button
            onClick={openChat}
            className="w-full sm:w-auto border-2 border-green-400 text-white hover:bg-green-600 hover:text-white font-semibold px-3 py-3 sm:px-8 sm:py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Ask AI Assistant
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero