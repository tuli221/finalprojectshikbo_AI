import React from 'react'

const LearningPaths = () => {
  const paths = [
    {
      icon: 'fa-code',
      title: 'Web Development',
      description: 'HTML, CSS, JavaScript, React, Node.js',
      gradient: 'from-blue-500 to-cyan-400'
    },
    {
      icon: 'fa-brain',
      title: 'AI & Machine Learning',
      description: 'Python, TensorFlow, Data Science',
      gradient: 'from-pink-500 to-purple-500'
    },
    {
      icon: 'fa-database',
      title: 'Data Science',
      description: 'Analytics, Visualization, Big Data',
      gradient: 'from-orange-500 to-red-400'
    },
    {
      icon: 'fa-mobile-screen-button',
      title: 'Mobile Development',
      description: 'React Native, Flutter, iOS, Android',
      gradient: 'from-green-500 to-emerald-400'
    }
  ]

  return (
    <section className="text-center py-6 px-8 bg-gradient-to-b from-[#0a1e14] to-[#061b11] rounded-2xl shadow-md m-10" id="learning-paths">
      <h2 className="text-4xl font-extrabold mb-4 text-white">Explore Learning Paths</h2>
      <p className="text-gray-300 text-2xl mx-auto">
        Choose from our comprehensive range of tech domains
      </p>
      
      <section className="py-6 px-8 md:px-16 bg-gradient-to-b from-[#0a1e14] to-[#061b11]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {paths.map((path, index) => (
            <div key={index} className="bg-black/80 border border-gray-700 hover:border-green-500 transition-all duration-300 rounded-2xl p-6 shadow-md hover:shadow-green-500/20 text-left">
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-tr ${path.gradient} rounded-xl mb-4`}>
                <i className={`fa-solid ${path.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-1xl font-extrabold mb-4 text-white">{path.title}</h3>
              <p className="text-gray-200 text-sm mb-4">{path.description}</p>
              <a href="#" className="text-green-400 font-semibold hover:underline flex items-center gap-2">
                Explore Path <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default LearningPaths
