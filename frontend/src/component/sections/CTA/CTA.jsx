import React from 'react'

const CTA = ({ openChat }) => {
  return (
    <section className="text-center py-8 px-8 bg-gradient-to-b from-[#0a1e14] to-[#061b11] shadow-md m-10">
      <h2 className="text-3xl font-extrabold mb-4 text-white">Ready to Transform Your Career?</h2>
      <p className="text-gray-300 text-1.5xl mx-auto">
        Join thousands of Bangladeshi students who are already building their tech careers with our AI-powered learning platform.
      </p>
      <br />
      <div className="space-x-4">
        <button onClick={openChat} className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition inline-block">
          <i className="fa-solid fa-robot text-white text-2xl"></i> Talk to AI Assistant
        </button>
      </div>
    </section>
  )
}

export default CTA
