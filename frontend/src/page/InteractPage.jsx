import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const InteractPage = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I\'m your AI learning assistant. How can I help you today?' }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (inputMessage.trim() === '') return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage
    }
    setMessages([...messages, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: 'Thank you for your message! This is a demo response. In a real application, this would connect to an AI API.'
      }
      setMessages(prev => [...prev, botMessage])
    }, 1000)

    setInputMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <i className="fas fa-arrow-left text-primary"></i>
            <span className="text-lg font-semibold text-gray-800">Back to Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary">AI Interact</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-4">
            <h2 className="text-xl font-bold">Chat with AI Assistant</h2>
            <p className="text-sm opacity-90 mt-1">Ask me anything about courses, learning, or AI!</p>
          </div>

          {/* Messages Container */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-none'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center mb-2">
                      <i className="fas fa-robot text-primary mr-2"></i>
                      <span className="text-xs font-semibold text-gray-600">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
            <div className="flex space-x-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2 font-semibold"
              >
                <span>Send</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </form>
        </div>

        {/* Features Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-brain text-primary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Smart Learning</h3>
            <p className="text-gray-600 text-sm">Get personalized course recommendations based on your interests</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-comments text-secondary text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">24/7 Support</h3>
            <p className="text-gray-600 text-sm">AI assistant available anytime to answer your questions</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractPage
