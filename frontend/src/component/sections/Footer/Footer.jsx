import React from 'react'

const Footer = () => {
  return (
    <section className="py-10 px-8 md:px-16 bg-gradient-to-b from-[#0a1e14] to-[#061b11]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Left Section */}
        <div>
          <div className="max-w-9xl mx-auto">
            <img src="/assets/Shikbowhite.png" alt="Shikhbo.AI Logo" className="h-10" />
          </div>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Empowering students with AI-powered personalized tech education. Learn programming, AI, and cutting-edge technologies with expert guidance from Shikhbo.AI.
          </p>

          <div className="flex space-x-5 text-gray-400 text-lg">
            <a href="#" className="hover:text-green-400"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="#" className="hover:text-green-400"><i className="fa-brands fa-twitter"></i></a>
            <a href="#" className="hover:text-green-400"><i className="fa-brands fa-linkedin-in"></i></a>
            <a href="#" className="hover:text-green-400"><i className="fa-brands fa-instagram"></i></a>
          </div>
        </div>

        {/* Middle Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="text-green-100 hover:text-green-400">About Us</a></li>
            <li><a href="#" className="text-green-100 hover:text-green-400">Courses</a></li>
            <li><a href="#" className="text-green-100 hover:text-green-400">Instructor</a></li>
            <li><a href="#" className="text-green-100 hover:text-green-400">Success Story</a></li>
            <li><a href="#" className="text-green-100 hover:text-green-400">Career Support</a></li>
          </ul>
        </div>

        {/* Right Section */}
        <div>
          <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-gray-400">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-envelope text-green-400"></i>
              info@shikhboai.xyz
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-phone text-green-400"></i>
              +880 13 3950 6981
            </li>
            <li className="flex items-start gap-2">
              <i className="fa-solid fa-location-dot text-green-400 mt-1"></i>
              Flat-3A, House 73/F, Road 12/B, Sector 10,<br />
              Uttara Model Town, Dhaka-1230, Bangladesh.
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-gray-500 text-sm">
        © 2025 <span className="text-green-400 font-semibold">Shikhbo.AI</span>. All rights reserved. Made for learners worldwide.
      </div>
    </section>
  )
}

export default Footer
