import React, { useState, useEffect } from 'react'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'
import ChatBot from '../component/ui/ChatBot'
import { instructorApi } from '../config/instructorApi'

const InstructorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedExpertise, setSelectedExpertise] = useState('All Expertise')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch instructors from API
  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const data = await instructorApi.getAll()
      // Filter only approved instructors for public page
      const approvedInstructors = data.filter(inst => inst.status === 'Approved')
      setInstructors(approvedInstructors)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to parse expertise tags
  const getExpertiseArray = (instructor) => {
    if (instructor.expertise_tags) {
      return instructor.expertise_tags.split(',').map(tag => tag.trim())
    }
    if (instructor.specialization) {
      return [instructor.specialization]
    }
    return []
  }


  const filteredInstructors = instructors.filter((instructor) => {
    const expertiseArray = getExpertiseArray(instructor)
    const matchesSearch = instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expertiseArray.some(exp => exp.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesExpertise = selectedExpertise === 'All Expertise' || 
                            expertiseArray.includes(selectedExpertise)
    return matchesSearch && matchesExpertise
  })

  const allExpertise = ['All Expertise', ...new Set(instructors.flatMap(i => getExpertiseArray(i)))]

  // Format join date
  const formatJoinDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
  }

  // Get image URL
  const getImageUrl = (instructor) => {
    if (instructor.image) {
      return `http://localhost:8000/storage/${instructor.image}`
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=22c55e&color=fff&size=100`
  }

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* TITLE SECTION */}
      <div className="text-center mt-16 px-4">
        <h1 className="text-4xl font-bold text-gray-900">
          Meet Our Expert Instructors
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Learn from industry professionals with years of practical experience and passion
          for teaching
        </p>
      </div>

      {/* SEARCH + FILTER */}
      <div className="max-w-7xl mx-auto mt-12 px-4">
        <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col md:flex-row items-center md:justify-between gap-4">
          
          {/* Search Box */}
          <div className="w-full md:w-2/3 flex items-center border rounded-lg px-4 py-3 bg-gray-50">
            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search instructors by name, skills, or expertise..."
              className="w-full bg-transparent outline-none text-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Dropdown */}
          <select 
            className="w-full md:w-1/3 border px-4 py-3 rounded-lg bg-gray-50 text-gray-700"
            value={selectedExpertise}
            onChange={(e) => setSelectedExpertise(e.target.value)}
          >
            {allExpertise.map((exp, index) => (
              <option key={index} value={exp}>{exp}</option>
            ))}
          </select>

        </div>

        <p className="mt-4 text-gray-600">
          {loading ? 'Loading...' : `Showing ${filteredInstructors.length} of ${instructors.length} instructors`}
        </p>
      </div>

      {/* INSTRUCTOR CARDS */}
      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading instructors...</div>
      ) : (
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mt-10 mb-16">

          {filteredInstructors.map((instructor) => {
            const expertiseArray = getExpertiseArray(instructor)
            
            return (
              <div key={instructor.id} className="bg-[#0D1117] rounded-xl overflow-hidden border border-[#1f2937] shadow-xl">

                {/* GREEN TOP HEADER */}
                <div className="bg-[#22c55e] p-4 flex items-center gap-3">
                  <img 
                    src={getImageUrl(instructor)} 
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" 
                    alt={instructor.name} 
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                    <p className="text-white flex items-center gap-2 text-xs">
                      ⭐ {instructor.rating || 0} <span className="text-gray-100">({instructor.total_students || 0} students)</span>
                    </p>
                  </div>
                </div>

                {/* BLACK BODY */}
                <div className="p-4 text-gray-200">

                  <p className="text-xs mb-4 tracking-wide leading-relaxed line-clamp-3">
                    {instructor.role || instructor.title || instructor.specialization || 'Instructor'} 
                    {instructor.company && (
                      <span className="font-semibold tracking-widest"> {instructor.company}</span>
                    )}
                  </p>

                  {/* STATS */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#111827] p-4 rounded-lg text-center border border-gray-700">
                      <i className="fa-solid fa-user-graduate text-green-400 text-lg"></i>
                      <p className="text-2xl font-bold mt-1">{instructor.total_students || 0}</p>
                      <p className="text-xs">Students</p>
                    </div>

                    <div className="bg-[#111827] p-4 rounded-lg text-center border border-gray-700">
                      <i className="fa-solid fa-book text-green-400 text-lg"></i>
                      <p className="text-2xl font-bold mt-1">{instructor.total_courses || 0}</p>
                      <p className="text-xs">Courses</p>
                    </div>
                  </div>

                  {/* EXPERTISE */}
                  <h4 className="font-semibold text-white mb-2 text-sm">Expertise</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {expertiseArray.slice(0, 3).map((exp, index) => (
                      <span key={index} className="bg-[#0f172a] border border-gray-700 px-3 py-1 rounded-lg text-xs">
                        {exp}
                      </span>
                    ))}
                    {expertiseArray.length > 3 && (
                      <span className="bg-[#0f172a] border border-gray-700 px-3 py-1 rounded-lg text-xs">
                        +{expertiseArray.length - 3}
                      </span>
                    )}
                  </div>

                  {/* JOINED ROW */}
                  <div className="flex items-center justify-between mt-4 text-xs text-gray-400">
                    <div className="flex items-center gap-3">
                      <i className="fa-solid fa-id-card text-green-400"></i>
                      <i className="fa-solid fa-mug-hot text-green-400"></i>
                    </div>
                    <span>Joined {formatJoinDate(instructor.join_date)}</span>
                  </div>

                  {/* BUTTON */}
                  <button className="w-full bg-[#22c55e] hover:bg-[#38d96e] text-black font-semibold mt-4 py-2.5 rounded-lg shadow-md transition text-sm">
                    View Profile
                  </button>

                </div>
              </div>
            )
          })}

        </div>
      )}

      {filteredInstructors.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          No instructors found matching your criteria.
        </div>
      )}

      <ChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <Footer />
    </div>
  )
}

export default InstructorsPage
