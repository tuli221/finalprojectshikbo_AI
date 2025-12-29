import React from 'react'

const WhyChoose = () => {
  const features = [
    {
      icon: 'fa-robot',
      title: 'AI-Powered Learning',
      description: 'Get personalized course recommendations and instant help from our AI assistant',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: 'fa-tools',
      title: 'Practical Projects',
      description: 'Build real-world projects that showcase your skills to potential employersBuild real-world projects that showcase your skills to potential employers',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      icon: 'fa-chalkboard-teacher',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of practical experience',
      gradient: 'from-orange-500 to-red-400'
    },
    {
      icon: 'fa-certificate',
      title: 'Industry Certificates',
      description: 'Earn recognized certificates that boost your career prospects',
      gradient: 'from-green-500 to-emerald-400'
    }
  ]

  return (
    <section className="text-center py-8 px-8 bg-gradient-to-b from-[#0a1e14] to-[#061b11] rounded-2xl shadow-md m-10" id="why-choose">
      <h2 className="text-4xl font-extrabold mb-4 text-white">Why Choose Shikhbo.AI?</h2>
      <p className="text-gray-300 max-w-3xl text-1xl font-semibold mx-auto">
        We combine cutting-edge AI technology with expert instruction to deliver a personalized learning experience that adapts to your pace and goals.
      </p>
      
      <section className="py-6 px-8 md:px-16 bg-gradient-to-b from-[#0a1e14] to-[#061b11]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-black/80 border border-gray-700 hover:border-green-500 transition-all duration-300 rounded-2xl p-6 shadow-md hover:shadow-green-500/20 text-left">
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-tr ${feature.gradient} rounded-xl mb-4`}>
                <i className={`fa-solid ${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-200 text-sm mb-4">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default WhyChoose
