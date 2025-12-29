import React, { useState } from 'react'
import Navbar from '../component/sections/Header/Navbar.jsx'
import Hero from '../component/sections/Hero/Hero.jsx'
import FeaturedCourses from '../component/sections/Course/FeaturedCourses.jsx'
import WhyChoose from '../component/sections/WhyChoose/WhyChoose.jsx'
import LearningPaths from '../component/sections/LearningPaths/LearningPaths.jsx'
import SuccessStories from '../component/sections/SuccessStories/SuccessStories.jsx'
import TestimonialsSection from '../component/sections/Testimonials/TestimonialsSection.jsx'
import CTA from '../component/sections/CTA/CTA.jsx'
import Footer from '../component/sections/Footer/Footer.jsx'
import ChatButton from '../component/ui/ChatBot.jsx'

const LandingPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)

  const openChat = () => setIsChatOpen(true)

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-950 via-emerald-950 to-emerald-950">
      <Navbar />
      <Hero openChat={openChat} />
      <FeaturedCourses />
      <WhyChoose />
      <LearningPaths />
      <SuccessStories />
      <CTA openChat={openChat} />
      <Footer />
      <ChatButton isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
    </div>
  )
}

export default LandingPage
