import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'

const ManageCourseModules = () => {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [loading, setLoading] = useState(false)
  const [course, setCourse] = useState(null)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [infoId, setInfoId] = useState(null)
  
  const [formData, setFormData] = useState({
    course_id: courseId || '',
    about_course: '',
    what_you_learn: '',
  })

  const [modules, setModules] = useState([
    {
      module_title: '',
      module_description: '',
      lessons: [
        {
          lesson_title: '',
          lesson_type: 'text', // text, video, file
          content: '',
          file: null,
          duration: ''
        }
      ],
      quiz: {
        quiz_title: '',
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0
          }
        ]
      }
    }
  ])

  // Fetch course details
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails()
      fetchCourseInformation()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchCourseDetails = async () => {
    try {
      setLoadingCourse(true)
      const response = await api.get(`/courses/${courseId}`)
      setCourse(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching course:', error)
      alert('Failed to load course details')
    } finally {
      setLoadingCourse(false)
    }
  }

  const fetchCourseInformation = async () => {
    try {
      let res
      try {
        res = await api.get(`/course-information/course/${courseId}`)
      } catch (err) {
        try {
          res = await api.get(`/course-information/${courseId}`)
        } catch ($err) {
          res = null
        }
      }

      const info = res?.data || res?.data?.data || res
      if (!info) return

      let parsedModules = info.modules
      if (typeof parsedModules === 'string') {
        try { parsedModules = JSON.parse(parsedModules) } catch (e) { /* leave as-is */ }
      }

      if (parsedModules && Array.isArray(parsedModules)) {
        const validatedModules = parsedModules.map(module => ({
          ...module,
          lessons: Array.isArray(module.lessons) ? module.lessons : [
            {
              lesson_title: '',
              lesson_type: 'text',
              content: '',
              file: null,
              duration: ''
            }
          ],
          quiz: module.quiz || {
            quiz_title: '',
            questions: [
              {
                question: '',
                options: ['', '', '', ''],
                correct_answer: 0
              }
            ]
          }
        }))
        setModules(validatedModules)
      }

      setFormData(prev => ({
        ...prev,
        course_id: info.course_id ?? prev.course_id,
        about_course: info.about_course || prev.about_course,
        what_you_learn: info.what_you_learn || prev.what_you_learn,
      }))

      if (info.id) setInfoId(info.id)
    } catch (error) {
      // No existing course information found
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleModuleChange = (moduleIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex][field] = value
    setModules(updatedModules)
  }

  const addModule = () => {
    setModules([...modules, { 
      module_title: '', 
      module_description: '',
      lessons: [
        {
          lesson_title: '',
          lesson_type: 'text',
          content: '',
          file: null,
          duration: ''
        }
      ],
      quiz: {
        quiz_title: '',
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correct_answer: 0
          }
        ]
      }
    }])
  }

  const removeModule = (moduleIndex) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, index) => index !== moduleIndex))
    }
  }

  const addLesson = (moduleIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons.push({
      lesson_title: '',
      lesson_type: 'text',
      content: '',
      file: null,
      duration: ''
    })
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules]
    if (updatedModules[moduleIndex].lessons.length > 1) {
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, idx) => idx !== lessonIndex)
      setModules(updatedModules)
    }
  }

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value
    setModules(updatedModules)
  }

  const handleLessonFileChange = (moduleIndex, lessonIndex, file) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex].file = file
    setModules(updatedModules)
  }

  const addQuizQuestion = (moduleIndex) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].quiz.questions.push({
      question: '',
      options: ['', '', '', ''],
      correct_answer: 0
    })
    setModules(updatedModules)
  }

  const removeQuizQuestion = (moduleIndex, questionIndex) => {
    const updatedModules = [...modules]
    if (updatedModules[moduleIndex].quiz.questions.length > 1) {
      updatedModules[moduleIndex].quiz.questions = updatedModules[moduleIndex].quiz.questions.filter((_, idx) => idx !== questionIndex)
      setModules(updatedModules)
    }
  }

  const handleQuizChange = (moduleIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].quiz[field] = value
    setModules(updatedModules)
  }

  const handleQuizQuestionChange = (moduleIndex, questionIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].quiz.questions[questionIndex][field] = value
    setModules(updatedModules)
  }

  const handleQuizOptionChange = (moduleIndex, questionIndex, optionIndex, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].quiz.questions[questionIndex].options[optionIndex] = value
    setModules(updatedModules)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.course_id) {
      alert('Course ID is missing')
      return
    }

    const hasEmptyModules = modules.some(module => !module.module_title)
    if (hasEmptyModules) {
      alert('Please fill in all module titles')
      return
    }

    // Validate lessons
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i]
      const hasEmptyLessons = module.lessons.some(lesson => !lesson.lesson_title)
      if (hasEmptyLessons) {
        alert(`Please fill in all lesson titles in Module ${i + 1}`)
        return
      }
    }

    try {
      setLoading(true)
      
      // Create FormData for file uploads
      const formDataToSend = new FormData()
      formDataToSend.append('course_id', formData.course_id)
      formDataToSend.append('about_course', formData.about_course)
      formDataToSend.append('what_you_learn', formData.what_you_learn)

      // Process modules and handle file uploads
      const modulesData = modules.map((module, moduleIndex) => {
        const lessonsData = module.lessons.map((lesson, lessonIndex) => {
          const lessonData = {
            lesson_title: lesson.lesson_title,
            lesson_type: lesson.lesson_type,
            content: lesson.content,
            duration: lesson.duration
          }
          
          // If there's a file, append it to FormData with unique key
          if (lesson.file) {
            const fileKey = `module_${moduleIndex}_lesson_${lessonIndex}_file`
            formDataToSend.append(fileKey, lesson.file)
            lessonData.file_key = fileKey
          }
          
          return lessonData
        })

        return {
          module_title: module.module_title,
          module_description: module.module_description,
          lessons: lessonsData,
          quiz: module.quiz
        }
      })

      formDataToSend.append('modules', JSON.stringify(modulesData))

      if (infoId) {
        formDataToSend.append('_method', 'PUT')
        await api.post(`/course-information/${infoId}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Course modules updated successfully!')
      } else {
        await api.post('/course-information', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        alert('Course modules added successfully!')
      }

      navigate('/instructor/my-courses')
    } catch (error) {
      console.error('Error saving course modules:', error)
      const serverMessage = error.response?.data?.message || error.response?.data || error.message
      alert('Failed to save course modules:\n' + (typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage)))
    } finally {
      setLoading(false)
    }
  }

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading course...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {infoId ? 'Edit' : 'Manage'} Modules - {course?.title || 'Course'}
            </h1>
            <button
              type="button"
              onClick={() => navigate('/instructor/my-courses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back to My Courses
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* About Course */}
            <div className="border-b pb-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Course
                  </label>
                  <textarea
                    name="about_course"
                    value={formData.about_course}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="Provide a detailed description about this course..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What You'll Learn
                  </label>
                  <textarea
                    name="what_you_learn"
                    value={formData.what_you_learn}
                    onChange={handleInputChange}
                    rows="6"
                    placeholder="List the key learning outcomes (use bullet points or line breaks)..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Modules Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Course Modules</h2>
                <button
                  type="button"
                  onClick={addModule}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  + Add Module
                </button>
              </div>

              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <div key={moduleIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-700">
                        Module {moduleIndex + 1}
                      </h3>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeModule(moduleIndex)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Module Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={module.module_title}
                          onChange={(e) => handleModuleChange(moduleIndex, 'module_title', e.target.value)}
                          required
                          placeholder="e.g., Introduction to Web Development"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {course?.type !== 'Online' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Module Description
                          </label>
                          <textarea
                            value={module.module_description}
                            onChange={(e) => handleModuleChange(moduleIndex, 'module_description', e.target.value)}
                            rows="3"
                            placeholder="Brief description of what this module covers..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      )}

                      {/* Lessons Section - Only for Online Courses */}
                      {course?.type === 'Online' && (
                      <div className="mt-6 border-t pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-md font-semibold text-gray-700">Lessons</h4>
                          <button
                            type="button"
                            onClick={() => addLesson(moduleIndex)}
                            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                          >
                            + Add Lesson
                          </button>
                        </div>

                        <div className="space-y-4">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-600">
                                  Lesson {lessonIndex + 1}
                                </span>
                                {module.lessons.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                    className="text-red-500 text-sm hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Lesson Title <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={lesson.lesson_title}
                                    onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'lesson_title', e.target.value)}
                                    required
                                    placeholder="e.g., Introduction to the Topic"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Lesson Type
                                    </label>
                                    <select
                                      value={lesson.lesson_type}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'lesson_type', e.target.value)}
                                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                      <option value="text">Text/Article</option>
                                      {course?.type === 'Online' && (
                                        <>
                                          <option value="video">Video</option>
                                          <option value="file">File/Document</option>
                                        </>
                                      )}
                                    </select>
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Duration (minutes)
                                    </label>
                                    <input
                                      type="number"
                                      value={lesson.duration}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'duration', e.target.value)}
                                      placeholder="e.g., 15"
                                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                </div>

                                {lesson.lesson_type === 'text' && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Content
                                    </label>
                                    <textarea
                                      value={lesson.content}
                                      onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'content', e.target.value)}
                                      rows="4"
                                      placeholder="Enter lesson content..."
                                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                  </div>
                                )}

                                {course?.type === 'Online' && (lesson.lesson_type === 'video' || lesson.lesson_type === 'file') && (
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      Upload {lesson.lesson_type === 'video' ? 'Video' : 'File'}
                                    </label>
                                    <input
                                      type="file"
                                      accept={lesson.lesson_type === 'video' ? 'video/*' : '*'}
                                      onChange={(e) => handleLessonFileChange(moduleIndex, lessonIndex, e.target.files[0])}
                                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    {lesson.file && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Selected: {lesson.file.name}
                                      </p>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}

                      {/* Quiz Section - Only for Online Courses */}
                      {course?.type === 'Online' && (
                      <div className="mt-6 border-t pt-4">
                        <div className="mb-4">
                          <h4 className="text-md font-semibold text-gray-700 mb-3">Module Quiz</h4>
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Quiz Title
                            </label>
                            <input
                              type="text"
                              value={module.quiz.quiz_title}
                              onChange={(e) => handleQuizChange(moduleIndex, 'quiz_title', e.target.value)}
                              placeholder="e.g., Module 1 Assessment"
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium text-gray-600">Questions</span>
                          <button
                            type="button"
                            onClick={() => addQuizQuestion(moduleIndex)}
                            className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                          >
                            + Add Question
                          </button>
                        </div>

                        <div className="space-y-4">
                          {module.quiz.questions.map((question, questionIndex) => (
                            <div key={questionIndex} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-medium text-gray-700">
                                  Question {questionIndex + 1}
                                </span>
                                {module.quiz.questions.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => removeQuizQuestion(moduleIndex, questionIndex)}
                                    className="text-red-500 text-sm hover:text-red-700"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>

                              <div className="space-y-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Question
                                  </label>
                                  <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => handleQuizQuestionChange(moduleIndex, questionIndex, 'question', e.target.value)}
                                    placeholder="Enter your question..."
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-2">
                                    Answer Options
                                  </label>
                                  <div className="space-y-2">
                                    {question.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="flex items-center gap-2">
                                        <input
                                          type="radio"
                                          name={`correct_answer_${moduleIndex}_${questionIndex}`}
                                          checked={question.correct_answer === optionIndex}
                                          onChange={() => handleQuizQuestionChange(moduleIndex, questionIndex, 'correct_answer', optionIndex)}
                                          className="text-purple-600"
                                        />
                                        <input
                                          type="text"
                                          value={option}
                                          onChange={(e) => handleQuizOptionChange(moduleIndex, questionIndex, optionIndex, e.target.value)}
                                          placeholder={`Option ${optionIndex + 1}`}
                                          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Select the radio button next to the correct answer
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/instructor/my-courses')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : (infoId ? 'Save Changes' : 'Save Modules')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ManageCourseModules
