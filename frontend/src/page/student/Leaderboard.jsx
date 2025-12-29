import React from 'react'

const Leaderboard = () => {
  const leaderboardData = [
    {
      rank: 1,
      name: 'Sabikun Nahar',
      xp: 2450,
      courses: 8,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=SN'
    },
    {
      rank: 2,
      name: 'Ahmed Rahman',
      xp: 2340,
      courses: 7,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=AR'
    },
    {
      rank: 3,
      name: 'Fatima Khan',
      xp: 2120,
      courses: 6,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=FK'
    },
    {
      rank: 4,
      name: 'You',
      xp: 1240,
      courses: 5,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=SA',
      isCurrentUser: true
    },
    {
      rank: 5,
      name: 'Rashid Ali',
      xp: 1180,
      courses: 4,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=RA'
    },
    {
      rank: 6,
      name: 'Nusrat Jahan',
      xp: 980,
      courses: 4,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=NJ'
    },
    {
      rank: 7,
      name: 'Karim Hossain',
      xp: 850,
      courses: 3,
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=KH'
    },
    
  ]

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">Leaderboard</h3>
        <p className="text-gray-600">See how you rank among other students</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8 max-w-2xl mx-auto">
        {/* 2nd Place */}
        <div className="flex flex-col items-center pt-8">
          <div className="relative">
            <img src={leaderboardData[1].avatar} alt={leaderboardData[1].name} className="w-16 h-16 rounded-full border-4 border-gray-300" />
            <span className="absolute -top-2 -right-2 bg-gray-300 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
          </div>
          <p className="font-semibold text-gray-800 mt-2 text-sm">{leaderboardData[1].name}</p>
          <p className="text-green-600 font-bold text-lg">{leaderboardData[1].xp} XP</p>
        </div>

        {/* 1st Place */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <img src={leaderboardData[0].avatar} alt={leaderboardData[0].name} className="w-20 h-20 rounded-full border-4 border-yellow-400" />
            <span className="absolute -top-2 -right-2 bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">1</span>
            <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">👑</span>
          </div>
          <p className="font-semibold text-gray-800 mt-2">{leaderboardData[0].name}</p>
          <p className="text-green-600 font-bold text-xl">{leaderboardData[0].xp} XP</p>
        </div>

        {/* 3rd Place */}
        <div className="flex flex-col items-center pt-12">
          <div className="relative">
            <img src={leaderboardData[2].avatar} alt={leaderboardData[2].name} className="w-14 h-14 rounded-full border-4 border-orange-300" />
            <span className="absolute -top-2 -right-2 bg-orange-300 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">3</span>
          </div>
          <p className="font-semibold text-gray-800 mt-2 text-xs">{leaderboardData[2].name}</p>
          <p className="text-green-600 font-bold">{leaderboardData[2].xp} XP</p>
        </div>
      </div>

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
            Complete lessons: <span className="font-semibold">10 XP each</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Pass quizzes: <span className="font-semibold">50 XP each</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Finish courses: <span className="font-semibold">200 XP each</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span>
            Attend live sessions: <span className="font-semibold">30 XP each</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Leaderboard
