import React, { useState, useEffect } from 'react'

const ChatButton = ({ isOpen, setIsOpen }) => {
  const [message, setMessage] = useState('')
  const [chatHistory, setChatHistory] = useState([])
  const [isTyping, setIsTyping] = useState(false)

  // Sample AI responses
  const aiResponses = [
    "Hello! I'm your AI learning assistant. How can I help you today?",
    "That's a great question! Let me find the best learning path for you.",
    "I recommend starting with our Web Development course if you're new to programming.",
    "Based on your interests, our AI & Machine Learning path might be perfect for you!",
    "I can help you choose courses based on your career goals and experience level.",
    "Many students find our project-based approach very effective for learning."
  ]

  const sendMessage = () => {
    if (!message.trim()) return

    // Add user message
    const userMessage = { type: 'user', text: message }
    setChatHistory(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)

    // Simulate AI thinking and response
    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)]
      const aiMessage = { type: 'ai', text: randomResponse }
      setChatHistory(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  // Auto-scroll to bottom of chat
  useEffect(() => {
    const chatContainer = document.getElementById('chat-messages')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight
    }
  }, [chatHistory, isTyping])

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-black p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-50 group"
        aria-label="Chat with AI Assistant"
      >
        <i className={`fa-solid ${isOpen ? 'fa-x' : 'fa-comments'} text-xl`}></i>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl transition-all duration-300 transform ${
        isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      } z-50`}>
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-green-700 via-green-400 to-green-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 className="font-semibold">AI Learning Assistant</h3>
              <p className="text-xs opacity-80">Online • Ready to help</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <i className="fa-solid fa-minus"></i>
          </button>
        </div>

        {/* Chat Messages */}
        <div 
          id="chat-messages"
          className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4"
        >
          {chatHistory.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              <i className="fa-solid fa-robot text-2xl mb-2 text-primary"></i>
              <p>Hello! I'm here to help you find the perfect learning path. Ask me anything!</p>
            </div>
          )}
          
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-sm rounded-2xl p-3 ${
                  msg.type === 'user'
                    ? 'bg-green-500 text-white rounded-br-none'
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-800 rounded-2xl rounded-bl-none p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about courses, careers..."
              className="flex-1 border border-green-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              disabled={!message.trim()}
              className="bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="fa-solid fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default ChatButton