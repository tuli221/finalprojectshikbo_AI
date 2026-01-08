import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '../../config/api'

const AddCourseInformation = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [courses, setCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [infoId, setInfoId] = useState(null) // existing course-information id when editing
  const location = useLocation()
  
  const [formData, setFormData] = useState({
    course_id: '',
    about_course: '',
    what_you_learn: '',
  })

  const [modules, setModules] = useState([
    {
      module_title: '',
      module_description: ''
    }
  ])

  // Fetch available courses
  useEffect(() => {
    fetchCourses()
  }, [])

  // If URL contains ?course_id= we will load existing course-information
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const courseId = params.get('course_id') || params.get('course')
    if (courseId) {
      // set selected course if already fetched
      const intId = parseInt(courseId, 10)
      const c = courses.find(x => x.id === intId)
      if (c) setSelectedCourse(c)
      setFormData(prev => ({ ...prev, course_id: courseId }))
      fetchCourseInformationForCourse(courseId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, courses])

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true)
      const response = await api.get('/courses')
      setCourses(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
      alert('Failed to load courses')
    } finally {
      setLoadingCourses(false)
    }
  }

  const fetchCourseInformationForCourse = async (courseId) => {
    try {
      // try endpoint that returns course-information by course id
      let res
      try {
        res = await api.get(`/course-information/course/${courseId}`)
      } catch (err) {
        // fallback: try by id
        try {
          res = await api.get(`/course-information/${courseId}`)
        } catch ($err) {
          // ignore - no existing course information
          res = null
        }
      }

      const info = res.data || res.data?.data || res
      if (!info) return

      // modules may be a JSON string
      let parsedModules = info.modules
      if (typeof parsedModules === 'string') {
        try { parsedModules = JSON.parse(parsedModules) } catch (e) { /* leave as-is */ }
      }

      if (parsedModules && Array.isArray(parsedModules)) {
        setModules(parsedModules)
      }

      setFormData(prev => ({
        ...prev,
        course_id: info.course_id ?? prev.course_id,
        about_course: info.about_course || prev.about_course,
        what_you_learn: info.what_you_learn || prev.what_you_learn,
      }))

      if (info.id) setInfoId(info.id)
    } catch (error) {
      // no existing course information found - ignore
      // console.debug('No existing course-information for course', courseId, error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // When course is selected, fetch course details
    if (name === 'course_id' && value) {
      const course = courses.find(c => c.id === parseInt(value))
      setSelectedCourse(course)
    }
  }
  
  const handleModuleChange = (moduleIndex, field, value) => {
    const updatedModules = [...modules]
    updatedModules[moduleIndex][field] = value
    setModules(updatedModules)
  }

  const addModule = () => {
    setModules([...modules, { module_title: '', module_description: '' }])
  }

  const removeModule = (moduleIndex) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, index) => index !== moduleIndex))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.course_id) {
      alert('Please select a course')
      return
    }

    const hasEmptyModules = modules.some(module => !module.module_title)
    if (hasEmptyModules) {
      alert('Please fill in all module fields')
      return
    }

    try {
      setLoading(true)
      const payload = {
        ...formData,
        modules: JSON.stringify(modules)
      }

      if (infoId) {
        await api.put(`/course-information/${infoId}`, payload)
        alert('Course information updated successfully!')
      } else {
        await api.post('/course-information', payload)
        alert('Course information added successfully!')
      }

      // Redirect to the course details page so admin sees the information immediately
      navigate(`/admin/courses/${formData.course_id}`)
    } catch (error) {
      console.error('Error saving course information - full error object:', error)
      console.error('Error response data:', error.response?.data)
      console.error('Error response status:', error.response?.status)
      const serverMessage = error.response?.data?.message || error.response?.data || error.message
      alert('Failed to save course information:\n' + (typeof serverMessage === 'string' ? serverMessage : JSON.stringify(serverMessage)))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{infoId ? 'Edit Course Information' : 'Add Course Information'}</h1>
            <button
              type="button"
              onClick={() => navigate('/admin/courses')}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Selection */}
            <div className="border-b pb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course <span className="text-red-500">*</span>
                </label>
                {loadingCourses ? (
                  <div className="text-gray-500">Loading courses...</div>
                ) : (
                  formData.course_id ? (
                    <div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-lg font-medium">{selectedCourse?.title || `Course #${formData.course_id}`}</p>
                      </div>
                      <input type="hidden" name="course_id" value={formData.course_id} />
                    </div>
                  ) : (
                    <select
                      name="course_id"
                      value={formData.course_id}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  )
                )}
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

                      {/* Lessons removed — modules only contain title and description now */}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/admin/courses')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : (infoId ? 'Save Changes' : 'Save Course Information')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddCourseInformation
