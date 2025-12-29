import React from 'react'

const SuccessStories = () => {
  const stories = [
    {
      name: 'Rafi Ahmed',
      role: 'Software Engineer, Dhaka',
      image: 'https://randomuser.me/api/portraits/men/75.jpg',
      story: '"Shikhbo.AI completely transformed my career. The AI assistant helped me choose the right path, and now I work at a top tech company in Dhaka."',
      rating: 5
    },
    {
      name: 'Maya Rahman',
      role: 'Data Analyst, Singapore',
      image: 'https://i.pravatar.cc/50?img=10',
      story: '"The courses are incredibly practical. I learned machine learning from scratch and landed my dream job within 6 months of completing the program."',
      rating: 5
    },
    {
      name: 'Sabbir Hasan',
      role: 'AI Researcher, Canada',
      image: 'https://i.pravatar.cc/50?img=3',
      story: '"The personalized learning experience is amazing. The AI always knew exactly what I needed to learn next. Highly recommend to anyone starting their tech journey."',
      rating: 5
    }
  ]

  return (
    <section className="text-center py-6 px-8 bg-gradient-to-b from-[#0a1e14] to-[#061b11] rounded-2xl shadow-md m-10" id="success-stories">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold mb-3 text-white">Success Stories</h2>
        <p className="text-gray-300 text-lg">Hear from students who transformed their careers with us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stories.map((story, index) => (
          <div key={index} className="bg-black/80 border border-gray-700 rounded-2xl p-6 shadow-md hover:shadow-green-500/20 transition-all duration-300 text-left">
            <div className="flex items-center text-green-400 mb-3">
              {[...Array(story.rating)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <p className="text-gray-300 italic mb-4">
              {story.story}
            </p>
            <div className="flex items-center gap-3 text-left">
              <img src={story.image} alt={story.name} className="w-10 h-10 rounded-full border border-green-400" />
              <div>
                <h4 className="font-semibold text-white">{story.name}</h4>
                <p className="text-gray-400 text-sm">{story.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default SuccessStories
