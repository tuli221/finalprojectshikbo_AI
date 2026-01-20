import React, { useState, useEffect } from 'react'
import api from '../../config/api'

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get current user
        const userRes = await api.get('/user')
        setCurrentUser(userRes.data)
        
        // Get leaderboard
        const leaderboardRes = await api.get('/leaderboard')
        const data = leaderboardRes.data.map(student => ({
          ...student,
          isCurrentUser: student.name === userRes.data.name
        }))
        setLeaderboardData(data)
      } catch (err) {
        console.error('Failed to fetch leaderboard:', err)
        setLeaderboardData([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="w-full text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <p className="mt-2 text-gray-600">Loading leaderboard...</p>
      </div>
    )
  }

  if (leaderboardData.length === 0) {
    return (
      <div className="w-full text-center py-8">
        <p className="text-gray-500">No leaderboard data available</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Leaderboard</h3>
        <p className="text-gray-600">See how you rank among other students</p>
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
          {/* 2nd Place */}
          {leaderboardData[1] && (
            <div className="flex flex-col items-center pt-8">
              <div className="relative">
                <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="w-16 h-16 rounded-full border-4 border-gray-300" />
                <span className="absolute -top-2 -right-2 bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
              </div>
              <p className="font-semibold text-gray-800 mt-2 text-sm">{leaderboardData[1].name}</p>
              <p className="text-green-600 font-bold text-lg">{leaderboardData[1].xp} XP</p>
            </div>
          )}

          {/* 1st Place */}
          {leaderboardData[0] && (
            <div className="flex flex-col items-center">
              <div className="relative">
                <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="w-20 h-20 rounded-full border-4 border-yellow-400" />
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</span>
                <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">👑</span>
              </div>
              <p className="font-semibold text-gray-800 mt-2">{leaderboardData[0].name}</p>
              <p className="text-green-600 font-bold text-xl">{leaderboardData[0].xp} XP</p>
            </div>
          )}

          {/* 3rd Place */}
          {leaderboardData[2] && (
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="w-14 h-14 rounded-full border-4 border-orange-300" />
                <span className="absolute -top-2 -right-2 bg-orange-300 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">3</span>
              </div>
              <p className="font-semibold text-gray-800 mt-2 text-xs">{leaderboardData[2].name}</p>
              <p className="text-green-600 font-bold">{leaderboardData[2].xp} XP</p>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">XP Points</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Courses</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {leaderboardData.map((student) => (
                <tr 
                  key={student.rank} 
                  className={`hover:bg-gray-50 ${student.isCurrentUser ? 'bg-green-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <span className={`font-bold text-lg ${
                      student.rank === 1 ? 'text-yellow-500' :
                      student.rank === 2 ? 'text-gray-400' :
                      student.rank === 3 ? 'text-orange-400' :
                      'text-gray-600'
                    }`}>
                      #{student.rank}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} alt={student.name} className="w-10 h-10 rounded-full" />
                      <div>
                        <p className={`font-semibold ${student.isCurrentUser ? 'text-green-600' : 'text-gray-800'}`}>
                          {student.name}
                          {student.isCurrentUser && ' (You)'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">{student.xp} XP</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700">{student.courses}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* XP Info */}
      <div className="mt-6 bg-green-50 rounded-xl p-6">
        <h4 className="font-bold text-gray-800 mb-3">How to earn XP?</h4>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            5% Complete lessons: <span className="font-semibold">50 XP each</span>
          </li>
          
        </ul>
      </div>
    </div>
  )
}

export default Leaderboard
