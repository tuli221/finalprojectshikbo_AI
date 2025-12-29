import React, { useState } from 'react'

const Messages = () => {
  const [messages] = useState([
    {
      id: 1,
      from: 'Rahul Ahmed',
      course: 'Web Development Bootcamp',
      message: 'Hi, I have a question about the React module assignment.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      from: 'Sadia Rahman',
      course: 'Python for Data Science',
      message: 'Thank you for the detailed explanation in the last session!',
      time: '5 hours ago',
      read: true
    },
    {
      id: 3,
      from: 'Tahmid Khan',
      course: 'Machine Learning Basics',
      message: 'Could you please share the dataset used in the classification example?',
      time: '1 day ago',
      read: false
    },
    {
      id: 4,
      from: 'Nusrat Jahan',
      course: 'Web Development Bootcamp',
      message: 'When will the next live session be scheduled?',
      time: '2 days ago',
      read: true
    },
    {
      id: 5,
      from: 'Fahim Islam',
      course: 'React Advanced Patterns',
      message: 'Great course! I learned a lot about custom hooks.',
      time: '3 days ago',
      read: true
    }
  ])

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <h3 className="text-xl md:text-2xl font-bold">Messages</h3>
        <span className="px-3 md:px-4 py-2 bg-green-100 text-green-600 rounded-full text-xs md:text-sm font-semibold">
          {unreadCount} Unread
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-lg divide-y">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition ${
              !message.read ? 'bg-green-50' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  {message.from.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{message.from}</h4>
                  <p className="text-sm text-gray-500">{message.course}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{message.time}</span>
                {!message.read && (
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                )}
              </div>
            </div>
            <p className="text-gray-700 ml-15">{message.message}</p>
            <div className="mt-3 ml-15">
              <button className="px-4 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition mr-2">
                Reply
              </button>
              <button className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold transition">
                Mark as Read
              </button>
            </div>
          </div>
        ))}
      </div>

      {messages.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <p className="text-gray-500 text-lg">No messages yet</p>
        </div>
      )}
    </div>
  )
}

export default Messages
