import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'

const EditCourseInformation = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [fetchingData, setFetchingData] = useState(true)
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  
  const [formData, setFormData] = useState({
    course_id: '',
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
          lesson_duration: ''
        }
      ]
    }
  ])

  // Fetch course information to edit
  useEffect(() => {
    fetchCourseInformation()
  }, [id])

  const fetchCourseInformation = async () => {
    try {
      setFetchingData(true)
      const [infoRes, coursesRes] = await Promise.all([
        api.get(`/course-information/${id}`),
        api.get('/courses')
      ])
      
      const info = infoRes.data
      setCourses(coursesRes.data.data || coursesRes.data)
      
      setFormData({
        course_id: info.course_id,
        about_course: info.about_course || '',
        what_you_learn: info.what_you_learn || '',
      })

      // Set selected course
      const course = (coursesRes.data.data || coursesRes.data).find(c => c.id === info.course_id)
      // force course type to Offline (no dropdown needed)
      setSelectedCourse({ ...course, type: 'Offline' })
      
      // Parse modules (may be JSON string)
      let parsedModules = info.modules
      if (typeof parsedModules === 'string') {
        try { parsedModules = JSON.parse(parsedModules) } catch (e) { parsedModules = [] }
      }
      if (Array.isArray(parsedModules) && parsedModules.length > 0) {
        setModules(parsedModules)
      }
    } catch (error) {
      console.error('Error fetching course information:', error)
      alert('Failed to load course information')
    } finally {
      setFetchingData(false)
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

  const handleLessonChange = (moduleIndex, lessonIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex].lessons[lessonIndex][field] = value
    setModules(updatedModules)
  }

  const addModule = () => {
    setModules([...modules, {
      module_title: '',
      module_description: '',
      lessons: [
        {
          lesson_title: '',
          lesson_duration: ''
        }
      ]
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
      lesson_duration: ''
    })
    setModules(updatedModules)
  }

  const removeLesson = (moduleIndex, lessonIndex) => {
    const updatedModules = [...modules]
    if (updatedModules[moduleIndex].lessons.length > 1) {
      updatedModules[moduleIndex].lessons = updatedModules[moduleIndex].lessons.filter((_, index) => index !== lessonIndex)
      setModules(updatedModules)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const hasEmptyModules = modules.some(module => 
      !module.module_title || 
      module.lessons.some(lesson => !lesson.lesson_title || !lesson.lesson_duration)
    )

    if (hasEmptyModules) {
      alert('Please fill in all module and lesson fields')
      return
    }

    try {
      setLoading(true)
      
      const payload = {
        about_course: formData.about_course,
        what_you_learn: formData.what_you_learn,
        // remove any pdf_file fields (offline only) before sending
        modules: JSON.stringify(modules.map(m => ({
          module_title: m.module_title,
          module_description: m.module_description,
          lessons: (m.lessons || []).map(l => ({
            lesson_title: l.lesson_title,
            lesson_duration: l.lesson_duration
          }))
        })))
      }

      await api.put(`/course-information/${id}`, payload)
      
      alert('Course information updated successfully!')
      navigate(`/admin/courses/${formData.course_id}`)
    } catch (error) {
      console.error('Error updating course information:', error)
      alert(error.response?.data?.message || 'Failed to update course information')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center">
        <div className="text-xl">Loading course information...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Edit Course Information</h1>
            <button
              type="button"
              onClick={() => navigate(`/admin/courses/${formData.course_id}`)}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Display (read-only) */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Course</h2>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-lg font-medium">{selectedCourse?.title}</p>
                <input type="hidden" name="course_id" value={formData.course_id} />
              </div>
            </div>

            {/* About Course */}
            <div className="border-b pb-6">
              {/* Course Details heading removed */}
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
                      <button
                        type="button"
                        onClick={() => removeModule(moduleIndex)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                      >
                         Remove
                      </button>
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

                      {/* Lessons */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-md font-semibold text-gray-700">Lessons</h4>
                          <button
                            type="button"
                            onClick={() => addLesson(moduleIndex)}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            + Add Lesson
                          </button>
                        </div>

                        <div className="space-y-3">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="bg-white p-4 rounded-lg border border-gray-200">
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

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Lesson Title <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    value={lesson.lesson_title}
                                    onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'lesson_title', e.target.value)}
                                    required
                                    placeholder="e.g., HTML Basics"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-1">
                                    Duration (min) <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={lesson.lesson_duration}
                                    onChange={(e) => handleLessonChange(moduleIndex, lessonIndex, 'lesson_duration', e.target.value)}
                                    required
                                    min="1"
                                    placeholder="30"
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* PDF uploads removed - lessons only contain title and duration */}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate(`/admin/courses/${formData.course_id}`)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Updating...' : 'Update Course Information'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCourseInformation
