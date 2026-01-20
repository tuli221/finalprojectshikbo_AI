import React, { useState, useEffect } from 'react'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'
import ChatButton from '../component/ui/ChatBot'
import api from '../config/api'

const LeaderboardPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/leaderboard')
        setLeaderboardData(response.data)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        setLeaderboardData([])
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading leaderboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-800 mb-4">
            Student Leaderboard
          </h1>
          <p className="text-lg text-gray-600 font-semibold max-w-2xl mx-auto">
            Celebrate achievements and track progress across all courses          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboardData.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 md:gap-8 mb-12 max-w-3xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center pt-8 md:pt-12">
            <div className="relative">
              <img 
                src={leaderboardData[1].avatar} 
                alt={leaderboardData[1].name} 
                className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-gray-300 shadow-lg" 
              />
              <span className="absolute -top-2 -right-2 bg-gray-300 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-sm md:text-base shadow-md">
                2
              </span>
            </div>
            <p className="font-semibold text-gray-800 mt-3 text-sm md:text-base text-center">{leaderboardData[1].name}</p>
            <p className="text-green-600 font-bold text-lg md:text-xl">{leaderboardData[1].xp} XP</p>
            <p className="text-gray-500 text-xs md:text-sm">{leaderboardData[1].courses} courses</p>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center -mt-4 md:-mt-6">
            <div className="relative">
              <img 
                src={leaderboardData[0].avatar} 
                alt={leaderboardData[0].name} 
                className="w-20 h-20 md:w-28 md:h-28 rounded-full border-4 border-yellow-400 shadow-xl" 
              />
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                1
              </span>
              <span className="absolute -top-6 md:-top-8 left-1/2 transform -translate-x-1/2 text-4xl md:text-5xl">👑</span>
            </div>
            <p className="font-bold text-gray-800 mt-3 text-base md:text-lg text-center">{leaderboardData[0].name}</p>
            <p className="text-green-600 font-bold text-xl md:text-2xl">{leaderboardData[0].xp} XP</p>
            <p className="text-gray-500 text-sm md:text-base">{leaderboardData[0].courses} courses</p>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center pt-12 md:pt-16">
            <div className="relative">
              <img 
                src={leaderboardData[2].avatar} 
                alt={leaderboardData[2].name} 
                className="w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-orange-300 shadow-lg" 
              />
              <span className="absolute -top-2 -right-2 bg-orange-300 text-white w-7 h-7 md:w-9 md:h-9 rounded-full flex items-center justify-center font-bold text-xs md:text-sm shadow-md">
                3
              </span>
            </div>
            <p className="font-semibold text-gray-800 mt-3 text-xs md:text-base text-center">{leaderboardData[2].name}</p>
            <p className="text-green-600 font-bold text-base md:text-lg">{leaderboardData[2].xp} XP</p>
            <p className="text-gray-500 text-xs md:text-sm">{leaderboardData[2].courses} courses</p>
          </div>
        </div>
        )}

        {leaderboardData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No students with XP yet. Start earning XP to appear on the leaderboard!</p>
          </div>
        )}

        {/* Full Leaderboard Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-700 to-green-500 text-white px-6 py-4">
            <h2 className="text-xl md:text-2xl font-bold">Top Students</h2>
            <p className="text-green-100 text-sm">Ranked by XP Points</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">XP Points</th>
                  <th className="px-4 md:px-6 py-4 text-left text-sm font-semibold text-gray-700">Courses</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leaderboardData.map((student) => (
                  <tr 
                    key={student.rank} 
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <span className={`font-bold text-base md:text-lg ${
                        student.rank === 1 ? 'text-yellow-500' :
                        student.rank === 2 ? 'text-gray-400' :
                        student.rank === 3 ? 'text-orange-400' :
                        'text-gray-600'
                      }`}>
                        #{student.rank}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={student.avatar} 
                          alt={student.name} 
                          className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-gray-200" 
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm md:text-base">
                            {student.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-green-600 text-sm md:text-base">{student.xp} XP</span>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <span className="text-gray-700 text-sm md:text-base">{student.courses}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* XP Info Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 md:p-8 shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              How to earn XP?
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-gray-700">
              <li className="flex items-center gap-3">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                <span>Complete lessons: <span className="font-bold text-green-600">10 XP each</span></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                <span>Pass quizzes: <span className="font-bold text-green-600">50 XP each</span></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                <span>Finish courses: <span className="font-bold text-green-600">200 XP each</span></span>
              </li>
              <li className="flex items-center gap-3">
                <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">✓</span>
                <span>Attend live sessions: <span className="font-bold text-green-600">30 XP each</span></span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 md:p-8 shadow-md">
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              Why compete?
            </h3>
            <ul className="space-y-3 text-sm md:text-base text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 text-xl flex-shrink-0">•</span>
                <span><span className="font-semibold">Stay motivated</span> by tracking your progress</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 text-xl flex-shrink-0">•</span>
                <span><span className="font-semibold">Earn rewards</span> for top rankings each month</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 text-xl flex-shrink-0">•</span>
                <span><span className="font-semibold">Connect</span> with other high achievers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-indigo-600 text-xl flex-shrink-0">•</span>
                <span><span className="font-semibold">Showcase</span> your skills to employers</span>
              </li>
            </ul>
          </div>
        </div>
        
      </main>

      <ChatButton isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      <Footer />
    </div>
  )
}

export default LeaderboardPage
