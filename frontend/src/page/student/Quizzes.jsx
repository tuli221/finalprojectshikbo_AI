import React, { useState } from 'react'

const Quizzes = () => {
  const [activeTab, setActiveTab] = useState('available')
  const [quizzes] = useState([
    {
      id: 1,
      title: 'React Fundamentals Quiz',
      course: 'Complete Web Development with React',
      questions: 20,
      duration: '30 mins',
      status: 'available',
      deadline: '2024-12-10'
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      course: 'Machine Learning Fundamentals',
      questions: 15,
      duration: '25 mins',
      status: 'available',
      deadline: '2024-12-08'
    },
    {
      id: 3,
      title: 'Python Data Structures',
      course: 'Data Science with Python',
      questions: 18,
      duration: '35 mins',
      status: 'completed',
      score: 85,
      completedDate: '2024-11-25'
    },
    {
      id: 4,
      title: 'JavaScript ES6 Features',
      course: 'Complete Web Development with React',
      questions: 12,
      duration: '20 mins',
      status: 'completed',
      score: 92,
      completedDate: '2024-11-20'
    }
  ])

  const filteredQuizzes = quizzes.filter(quiz => 
    activeTab === 'all' || quiz.status === activeTab
  )

  return (
    <div className="w-full">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Quizzes</h3>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'available'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Available
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-semibold transition ${
            activeTab === 'completed'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          Completed
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
        {filteredQuizzes.map((quiz) => (
          <div key={quiz.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg text-gray-800">{quiz.title}</h4>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                quiz.status === 'available' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                {quiz.status === 'available' ? 'Available' : 'Completed'}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{quiz.course}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Questions:</span>
                <span className="font-semibold text-gray-800">{quiz.questions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold text-gray-800">{quiz.duration}</span>
              </div>
              {quiz.status === 'available' && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-semibold text-red-600">{quiz.deadline}</span>
                </div>
              )}
              {quiz.status === 'completed' && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Score:</span>
                    <span className="font-semibold text-green-600">{quiz.score}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Completed:</span>
                    <span className="font-semibold text-gray-800">{quiz.completedDate}</span>
                  </div>
                </>
              )}
            </div>

            {quiz.status === 'available' ? (
              <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
                Start Quiz
              </button>
            ) : (
              <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition">
                View Results
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="text-center py-8 text-gray-500">No quizzes found</div>
      )}
    </div>
  )
}

export default Quizzes
