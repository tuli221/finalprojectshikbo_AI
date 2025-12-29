import React, { useState } from 'react'

const LiveSessions = () => {
  const [activeTab, setActiveTab] = useState('upcoming')
  const [sessions] = useState([
    {
      id: 1,
      title: 'React Live Class',
      instructor: 'John Doe',
      date: '16 Nov, 4 PM',
      duration: '2 hours',
      status: 'upcoming',
      participants: 45,
      thumbnail: './download.jpeg'
    },
    {
      id: 2,
      title: 'Machine Learning Live',
      instructor: 'Jane Smith',
      date: '17 Nov, 5 PM',
      duration: '1.5 hours',
      status: 'upcoming',
      participants: 38,
      thumbnail: './Data-Analysis-With-Python.svg'
    },
    {
      id: 3,
      title: 'Data Science Workshop',
      instructor: 'Alex Johnson',
      date: '18 Nov, 3 PM',
      duration: '3 hours',
      status: 'upcoming',
      participants: 52,
      thumbnail: './images.jpeg'
    },
    {
      id: 4,
      title: 'JavaScript Advanced Concepts',
      instructor: 'John Doe',
      date: '10 Nov, 6 PM',
      duration: '2 hours',
      status: 'past',
      recording: true
    },
    {
      id: 5,
      title: 'Python Data Analysis',
      instructor: 'Jane Smith',
      date: '12 Nov, 4 PM',
      duration: '2.5 hours',
      status: 'past',
      recording: true
    }
  ])

  const filteredSessions = sessions.filter(session => 
    activeTab === 'all' || session.status === activeTab
  )

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Live Sessions</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'upcoming'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'past'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Past Sessions
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'all'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          All
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSessions.map((session) => (
          <div key={session.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            {session.thumbnail && (
              <img src={session.thumbnail} alt={session.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg text-gray-800">{session.title}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  session.status === 'upcoming' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {session.status === 'upcoming' ? 'Upcoming' : 'Past'}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-3">Instructor: {session.instructor}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <span className="material-icons text-sm mr-2">event</span>
                  <span>{session.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="material-icons text-sm mr-2">schedule</span>
                  <span>{session.duration}</span>
                </div>
                {session.status === 'upcoming' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="material-icons text-sm mr-2">people</span>
                    <span>{session.participants} participants</span>
                  </div>
                )}
              </div>

              {session.status === 'upcoming' ? (
                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
                  Join Class
                </button>
              ) : session.recording ? (
                <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition">
                  Watch Recording
                </button>
              ) : (
                <button className="w-full bg-gray-300 text-gray-600 font-semibold py-2 rounded-lg cursor-not-allowed">
                  No Recording
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredSessions.length === 0 && (
        <div className="text-center py-8 text-gray-500">No sessions found</div>
      )}
    </div>
  )
}

export default LiveSessions
