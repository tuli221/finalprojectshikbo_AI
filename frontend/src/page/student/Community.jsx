import React, { useState } from 'react'

const Community = () => {
  const [activeTab, setActiveTab] = useState('discussions')
  const [discussions] = useState([
    {
      id: 1,
      title: 'Best practices for React Hooks?',
      author: 'Ahmed Rahman',
      category: 'React',
      replies: 12,
      views: 145,
      timeAgo: '2 hours ago',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=AR'
    },
    {
      id: 2,
      title: 'How to optimize ML model performance?',
      author: 'Fatima Khan',
      category: 'Machine Learning',
      replies: 8,
      views: 98,
      timeAgo: '5 hours ago',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=FK'
    },
    {
      id: 3,
      title: 'Python vs R for Data Science?',
      author: 'Rashid Ali',
      category: 'Data Science',
      replies: 15,
      views: 234,
      timeAgo: '1 day ago',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=RA'
    },
    {
      id: 4,
      title: 'Help with async/await in JavaScript',
      author: 'Nusrat Jahan',
      category: 'JavaScript',
      replies: 6,
      views: 67,
      timeAgo: '3 hours ago',
      avatar: 'https://api.dicebear.com/6.x/initials/svg?seed=NJ'
    }
  ])

  const [announcements] = useState([
    {
      id: 1,
      title: 'New AI Course Coming Next Month!',
      content: 'We\'re excited to announce a new Advanced AI course starting next month...',
      date: '2024-11-15',
      type: 'info'
    },
    {
      id: 2,
      title: 'Platform Maintenance Schedule',
      content: 'The platform will undergo maintenance on Sunday from 2 AM to 4 AM...',
      date: '2024-11-14',
      type: 'warning'
    },
    {
      id: 3,
      title: 'Student Success Story',
      content: 'Congratulations to our student who just landed a job at a top tech company!',
      date: '2024-11-12',
      type: 'success'
    }
  ])

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Community</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('discussions')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'discussions'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Discussions
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'announcements'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Announcements
        </button>
      </div>

      {activeTab === 'discussions' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
              + Start New Discussion
            </button>
          </div>

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-start gap-4">
                  <img src={discussion.avatar} alt={discussion.author} className="w-12 h-12 rounded-full" />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-lg text-gray-800 mb-1">{discussion.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{discussion.author}</span>
                          <span>•</span>
                          <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-semibold">
                            {discussion.category}
                          </span>
                          <span>•</span>
                          <span>{discussion.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600 mt-3">
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">chat_bubble_outline</span>
                        <span>{discussion.replies} replies</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-icons text-sm">visibility</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                  </div>

                  <button className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-600 font-semibold rounded-lg transition">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`rounded-xl shadow-lg p-6 ${
                announcement.type === 'info' ? 'bg-blue-50 border-l-4 border-blue-500' :
                announcement.type === 'warning' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
                'bg-green-50 border-l-4 border-green-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`material-icons text-2xl ${
                  announcement.type === 'info' ? 'text-blue-600' :
                  announcement.type === 'warning' ? 'text-yellow-600' :
                  'text-green-600'
                }`}>
                  {announcement.type === 'info' ? 'info' :
                   announcement.type === 'warning' ? 'warning' : 'celebration'}
                </span>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-gray-800 mb-2">{announcement.title}</h4>
                  <p className="text-gray-700 mb-3">{announcement.content}</p>
                  <p className="text-sm text-gray-500">{announcement.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Community
