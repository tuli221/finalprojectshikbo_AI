import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'
import ChatBot from '../component/ui/ChatBot'

const LearningCenter = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [programs, setPrograms] = useState([])

  const transformProgram = (p) => {
    // normalize image URL: backend may return absolute URL or a relative path like /storage/...
    let imageUrl = p.image || '/assets/aipython.png'
    if (imageUrl && typeof imageUrl === 'string' && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
      // prefix with backend host if needed (api.baseURL is like http://localhost:8000/api)
      try {
        const base = api.defaults.baseURL.replace(/\/?api\/?$/, '')
        imageUrl = `${base}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
      } catch (e) {
        // fallback: leave as-is
      }
    }

    return {
      id: p.id,
      title: p.title,
      image: imageUrl,
      badge: p.badge || (p.price_current ? 'Premium' : 'Free'),
      badgeColor: (p.badge && p.badge.toLowerCase().includes('free')) ? 'bg-green-500' : 'bg-yellow-500',
      features: Array.isArray(p.features) ? p.features : (p.features ? JSON.parse(p.features) : []),
      price: p.price_current ? { current: p.price_current, original: p.price_original } : null
    }
  }

  // Load programs from backend, fallback to localStorage
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await api.get('/programs')
        if (res && res.data && !cancelled) {
          const list = (res.data || []).map(transformProgram)
          if (list.length) return setPrograms(list)
        }
      } catch (e) {
        // ignore and fallback
      }

      try {
        const stored = localStorage.getItem('learningPrograms')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed) && parsed.length > 0 && !cancelled) {
            setPrograms(parsed)
          }
        }
      } catch (e) {
        console.error('Failed to load programs from localStorage')
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const slides = [
    '/assets/learning1.jpg',
    '/assets/learning2.jpg',
    '/assets/learning3.jpg',
    '/assets/learning4.jpg'
  ]

  const features = [
    {
      icon: 'fa-users',
      title: 'Expert Networking',
      description: 'Direct networking opportunity with industry experts'
    },
    {
      icon: 'fa-award',
      title: 'Direct Mentorship',
      description: 'Experienced mentors mentorship'
    },
    {
      icon: 'fa-book-open',
      title: 'Affordable fees & scholarships',
      description: 'Affordable course fees with scholarship opportunities'
    },
    {
      icon: 'fa-briefcase',
      title: 'Job preparation & placements',
      description: 'Job preparation support & placement guidance'
    },
    {
      icon: 'fa-bullseye',
      title: 'Live projects & Performance tracking',
      description: 'Project-based live experience'
    }
  ]

  // Auto-advance slides every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [slides.length])

  const handleDotClick = (index) => {
    setCurrentSlide(index)
  }

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-r from-emerald-900 via-emerald-900 to-emerald-900">
      <Navbar />

      {/* HERO SECTION */}
      <section className="mt-10 relative overflow-hidden bg-gradient-to-br from-emerald-800 via-green-600 to-emerald-800 text-white py-16 px-4 max-w-[1250px] mx-auto rounded-xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-36 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-10">
            {/* Left Content */}
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Shikhbo AI</h1>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Learning Center</h2>

              <p className="text-lg leading-relaxed mb-6">
                Start your learning journey on this platform to build your career with skills! Skill development, expert guidelines, job placement, career support, and various programs—all in one place.
              </p>
              <button className="bg-white text-emerald-700 hover:bg-gray-100 px-6 py-3 rounded-xl font-semibold transition shadow-lg flex-shrink-0">
                <i className="fas fa-calendar-check mr-2"></i>Book Now
              </button>
            </div>

            {/* Right Image Slider */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                {/* Image Slider Container */}
                <div className="relative h-[300px] md:h-[400px]">
                  {slides.map((slide, index) => (
                    <img
                      key={index}
                      src={slide}
                      alt={`Slide ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                        currentSlide === index ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                
                {/* Slider Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleDotClick(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        currentSlide === index ? 'bg-white' : 'bg-white/50'
                      } hover:bg-white`}
                    />
                  ))}
                </div>
              </div>
              {/* Decorative Badge */}
              <div className="absolute -bottom-4 -right-4 bg-yellow-400 text-gray-900 px-6 py-3 rounded-2xl font-bold shadow-xl">
                <div className="text-2xl">500+</div>
                <div className="text-xs">Students</div>
              </div>
            </div>
          </div>

          {/* Location Badge with Modern Design */}
          <div className="bg-white/15 backdrop-blur-lg rounded-2xl p-4 border border-white/30 shadow-xl max-w-xl mx-auto">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 bg-white/25 rounded-xl flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-map-marker-alt text-lg"></i>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-base mb-1">Sector 10, Uttara Model Town</h3>
                  <p className="text-xs text-white/90">Flat-3A, House 73/F, Road 12/B, Dhaka-1230, Bangladesh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8 -mt-2">
          <h2 className="text-4xl font-bold text-white mb-4">Our Programs</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
              <div className="relative h-48 overflow-hidden">
                <img src={program.image} alt={program.title} className="w-full h-full object-cover object-center" />
                <div className="absolute top-4 right-4">
                  <span className={`${program.badgeColor} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                    {program.badge}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col" style={{ minHeight: '320px' }}>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{program.title}</h3>
                
                <div className="space-y-2 mb-6 flex-grow">
                  {(program.features || []).map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-600 mt-1"></i>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {program.price && (
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">{program.price.current}</span>
                    <span className="text-gray-500 line-through ml-2">{program.price.original}</span>
                  </div>
                )}

                <div className="mt-auto">
                  <button onClick={() => navigate(`/booking/${program.id}`)} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT YOU CAN LEARN */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-8 -mt-8">
          <h2 className="text-4xl font-bold text-white mb-4">What can you learn in our Offline class?</h2>
          <p className="text-lg text-white max-w-3xl mx-auto">
            Opportunity for direct networking with industry experts, mentorship from experienced mentors, job preparation support & placement guidance, project-based live experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`fas ${feature.icon} text-3xl text-blue-600`}></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <Footer />
    </div>
  )
}

export default LearningCenter
