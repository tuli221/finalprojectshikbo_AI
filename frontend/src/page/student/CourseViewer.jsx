import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'
import { getProgress, saveProgress as saveProgressToServer, calculateTotalLessons } from '../../utils/courseProgress'

const CourseViewer = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState(null)
  const [courseInfo, setCourseInfo] = useState(null)
  const [modules, setModules] = useState([])
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0)
  const [completedLessons, setCompletedLessons] = useState([])
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 })

  useEffect(() => {
    if (courseId) {
      fetchCourseData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchCourseData = async () => {
    try {
      setLoading(true)
      const [courseRes, infoRes] = await Promise.all([
        api.get(`/courses/${courseId}`),
        api.get(`/course-information/course/${courseId}`).catch(() => null)
      ])

      const courseData = courseRes.data.data || courseRes.data
      setCourse(courseData)

      if (infoRes?.data) {
        const info = infoRes.data.data || infoRes.data
        setCourseInfo(info)

        // Parse modules
        let parsedModules = info.modules
        if (typeof parsedModules === 'string') {
          try {
            parsedModules = JSON.parse(parsedModules)
          } catch (e) {
            parsedModules = []
          }
        }

        console.log('Fetched modules:', parsedModules)

        if (Array.isArray(parsedModules)) {
          setModules(parsedModules)
        }
      }

      // Load progress after course data is fetched
      await loadProgress()
    } catch (error) {
      console.error('Error fetching course data:', error)
      alert('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async () => {
    try {
      const response = await api.get(`/courses/${courseId}/progress`)
      const progress = {
        completedLessons: response.data.completed_lessons || [],
        progressPercentage: response.data.progress_percentage || 0
      }
      setCompletedLessons(progress.completedLessons || [])
    } catch (e) {
      console.error('Error loading progress:', e)
      setCompletedLessons([])
    }
  }

  const saveProgress = async (moduleIdx, lessonIdx, completed) => {
    try {
      const totalLessons = calculateTotalLessons(modules)
      await saveProgressToServer(courseId, completed, totalLessons)
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }

  const markLessonComplete = () => {
    const lessonKey = `${currentModuleIndex}-${currentLessonIndex}`
    const newCompleted = [...completedLessons]
    if (!newCompleted.includes(lessonKey)) {
      newCompleted.push(lessonKey)
    }
    setCompletedLessons(newCompleted)
    saveProgress(currentModuleIndex, currentLessonIndex, newCompleted)
  }

  const handleNext = () => {
    if (!modules[currentModuleIndex]) return

    const currentModule = modules[currentModuleIndex]
    const lessons = currentModule.lessons || []

    // Mark current lesson as complete
    markLessonComplete()

    // Check if there's a next lesson in current module
    if (currentLessonIndex < lessons.length - 1) {
      const newLessonIdx = currentLessonIndex + 1
      setCurrentLessonIndex(newLessonIdx)
      setShowQuiz(false)
    } else {
      // Last lesson in module - show quiz
      setShowQuiz(true)
    }
  }

  const handlePrevious = () => {
    if (currentLessonIndex > 0) {
      const newLessonIdx = currentLessonIndex - 1
      setCurrentLessonIndex(newLessonIdx)
      setShowQuiz(false)
    } else if (currentModuleIndex > 0) {
      // Go to previous module's last lesson
      const prevModuleIdx = currentModuleIndex - 1
      const prevModule = modules[prevModuleIdx]
      const prevLessons = prevModule.lessons || []
      const lastLessonIdx = Math.max(0, prevLessons.length - 1)
      
      setCurrentModuleIndex(prevModuleIdx)
      setCurrentLessonIndex(lastLessonIdx)
      setShowQuiz(false)
    }
  }

  const handleNextModule = () => {
    if (currentModuleIndex < modules.length - 1) {
      const newModuleIdx = currentModuleIndex + 1
      setCurrentModuleIndex(newModuleIdx)
      setCurrentLessonIndex(0)
      setShowQuiz(false)
      setQuizAnswers({})
      setQuizSubmitted(false)
      setQuizScore({ correct: 0, total: 0 })
    }
  }

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex
    })
  }

  const handleQuizSubmit = () => {
    setQuizSubmitted(true)
    // Calculate score - 1 mark per question
    const currentModule = modules[currentModuleIndex]
    const quiz = currentModule.quiz
    if (quiz && quiz.questions) {
      let correct = 0
      quiz.questions.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correct_answer) {
          correct++
        }
      })
      const total = quiz.questions.length
      setQuizScore({ correct, total })
      // Note: Score is now shown in the UI as "correct/total"
    }
  }

  const getTotalLessons = () => {
    return modules.reduce((total, module) => {
      return total + (module.lessons?.length || 0)
    }, 0)
  }

  const getCompletedCount = () => {
    return completedLessons.length
  }

  const getProgress = () => {
    const total = getTotalLessons()
    const completed = getCompletedCount()
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading course...</div>
      </div>
    )
  }

  if (!course || modules.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No course content available</p>
          <button
            onClick={() => navigate('/student/my-courses')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to My Courses
          </button>
        </div>
      </div>
    )
  }

  const currentModule = modules[currentModuleIndex]
  const currentLesson = currentModule?.lessons?.[currentLessonIndex]

  // Build file URL if lesson has a file path
  const getFileUrl = (lesson) => {
    if (!lesson) return null
    
    const filePath = lesson.file_url || lesson.file_path || lesson.file
    
    if (!filePath) {
      return null
    }
    
    // If already a full URL, return as-is
    if (filePath?.startsWith('http')) {
      return filePath
    }
    
    // Build URL from API base
    try {
      const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/i, '') : ''
      if (base && filePath) {
        const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`
        const fullUrl = `${base}${cleanPath}`
        return fullUrl
      }
    } catch (e) {
      console.error('Error building file URL:', e)
    }
    
    return filePath
  }

  const lessonFileUrl = getFileUrl(currentLesson)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header with Logo and Course Title */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  <span className="text-gray-900">shikhbo</span>
                  <span className="text-green-500">.AI</span>
                </span>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student/my-courses')}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
              >
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Module Outline with Progress Tracker */}
          <div className="lg:col-span-1">
            {/* Progress Tracker Card */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4">
              <h3 className="font-semibold text-gray-800 mb-3">Your Progress</h3>
              <div className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">{getProgress()}%</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${getProgress()}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm text-gray-600">
                  {getCompletedCount()} / {getTotalLessons()} Lessons
                </div>
              </div>
            </div>

            {/* Course Outline Card */}
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-24">
              <h2 className="font-bold text-lg mb-4">Course Outline</h2>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">{modules.map((module, moduleIdx) => (
                  <div key={moduleIdx} className="border-b pb-2">
                    <div className="font-semibold text-sm text-gray-800 mb-2">
                      Module {moduleIdx + 1}: {module.module_title}
                    </div>
                    <div className="ml-3 space-y-1">
                      {module.lessons?.map((lesson, lessonIdx) => {
                        const lessonKey = `${moduleIdx}-${lessonIdx}`
                        const isCompleted = completedLessons.includes(lessonKey)
                        const isCurrent = moduleIdx === currentModuleIndex && lessonIdx === currentLessonIndex

                        return (
                          <div
                            key={lessonIdx}
                            onClick={() => {
                              setCurrentModuleIndex(moduleIdx)
                              setCurrentLessonIndex(lessonIdx)
                              setShowQuiz(false)
                            }}
                            className={`text-xs p-2 rounded cursor-pointer flex items-center gap-2 ${
                              isCurrent ? 'bg-green-100 text-green-800 font-medium' : 'hover:bg-gray-100'
                            }`}
                          >
                            {isCompleted ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-gray-400">○</span>
                            )}
                            <span className="flex-1">{lessonIdx + 1}. {lesson.lesson_title}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              {!showQuiz ? (
                <>
                  {/* Lesson Content */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentLesson?.lesson_title}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                          Module {currentModuleIndex + 1}, Lesson {currentLessonIndex + 1}
                          {currentLesson?.duration && ` • ${currentLesson.duration} minutes`}
                        </p>
                      </div>
                    </div>

                    {/* Lesson Display */}
                    <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
                      {currentLesson?.lesson_type === 'video' && (
                        lessonFileUrl ? (
                          <video
                            controls
                            className="w-full rounded-lg max-h-[500px]"
                            src={lessonFileUrl}
                          >
                            Your browser does not support video playback.
                          </video>
                        ) : (
                          <div className="text-center text-gray-500 py-20">
                            No video file uploaded for this lesson
                          </div>
                        )
                      )}

                      {currentLesson?.lesson_type === 'file' && (
                        lessonFileUrl ? (
                          <div className="space-y-4">
                            <iframe
                              src={lessonFileUrl}
                              className="w-full h-[600px] rounded-lg border-2 border-gray-200"
                              title={currentLesson.lesson_title}
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <div className="text-center text-gray-500 py-20">
                            No file uploaded for this lesson
                          </div>
                        )
                      )}

                      {currentLesson?.lesson_type === 'text' && (
                        <div className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-gray-700">
                            {currentLesson.content || 'No content available'}
                          </div>
                        </div>
                      )}

                      {!currentLesson?.lesson_type && (
                        <div className="text-center text-gray-500 py-20">
                          No content available for this lesson
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={handlePrevious}
                      disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Previous
                    </button>

                    <button
                      onClick={handleNext}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      {currentLessonIndex === (currentModule?.lessons?.length || 0) - 1
                        ? 'Take Quiz →'
                        : 'Next Lesson →'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Quiz Section */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentModule?.quiz?.quiz_title || `Module ${currentModuleIndex + 1} Quiz`}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          {!quizSubmitted 
                            ? 'Each question is worth 1 mark. Answer all questions and submit.'
                            : `Quiz Completed!`
                          }
                        </p>
                      </div>
                      {quizSubmitted && (
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-4 rounded-lg shadow-lg">
                          <div className="text-center">
                            <div className="text-sm font-medium mb-1">Your Score</div>
                            <div className="text-3xl font-bold">
                              {quizScore.correct}/{quizScore.total}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {currentModule?.quiz?.questions?.map((question, qIdx) => {
                        const isCorrect = quizSubmitted && quizAnswers[qIdx] === question.correct_answer
                        const isWrong = quizSubmitted && quizAnswers[qIdx] !== undefined && quizAnswers[qIdx] !== question.correct_answer
                        
                        return (
                          <div key={qIdx} className={`border-2 rounded-lg p-5 ${
                            quizSubmitted 
                              ? isCorrect 
                                ? 'bg-green-50 border-green-500' 
                                : isWrong 
                                ? 'bg-red-50 border-red-500' 
                                : 'bg-gray-50 border-gray-300'
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-3">
                              <p className="font-semibold text-gray-900 flex-1">
                                {qIdx + 1}. {question.question}
                              </p>
                              {quizSubmitted && (
                                <div className="ml-4">
                                  {isCorrect ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">
                                      ✓ +1 Mark
                                    </span>
                                  ) : isWrong ? (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
                                      ✗ 0 Mark
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-gray-400 text-white">
                                      Not Answered
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              {question.options?.map((option, oIdx) => {
                                const isStudentAnswer = quizAnswers[qIdx] === oIdx
                                const isCorrectAnswer = question.correct_answer === oIdx
                                
                                return (
                                  <label
                                    key={oIdx}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition ${
                                      !quizSubmitted
                                        ? isStudentAnswer
                                          ? 'border-purple-500 bg-purple-50'
                                          : 'border-gray-200 hover:border-gray-300 bg-white'
                                        : isCorrectAnswer
                                        ? 'border-green-600 bg-green-100'
                                        : isStudentAnswer && !isCorrectAnswer
                                        ? 'border-red-500 bg-red-100'
                                        : 'border-gray-200 bg-white'
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`question-${qIdx}`}
                                      checked={quizAnswers[qIdx] === oIdx}
                                      onChange={() => handleQuizAnswer(qIdx, oIdx)}
                                      disabled={quizSubmitted}
                                      className={`${
                                        quizSubmitted 
                                          ? isCorrectAnswer 
                                            ? 'text-green-600' 
                                            : 'text-red-600' 
                                          : 'text-purple-600'
                                      }`}
                                    />
                                    <span className="flex-1">{option}</span>
                                    {quizSubmitted && (
                                      <>
                                        {isCorrectAnswer && (
                                          <span className="ml-auto text-green-600 font-semibold flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Correct Answer
                                          </span>
                                        )}
                                        {isStudentAnswer && !isCorrectAnswer && (
                                          <span className="ml-auto text-red-600 font-semibold flex items-center gap-1">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            Your Answer
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </label>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quiz Actions */}
                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      onClick={() => setShowQuiz(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      ← Back to Lessons
                    </button>

                    {!quizSubmitted ? (
                      <button
                        onClick={handleQuizSubmit}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Submit Quiz
                      </button>
                    ) : (
                      <button
                        onClick={handleNextModule}
                        disabled={currentModuleIndex === modules.length - 1}
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {currentModuleIndex === modules.length - 1
                          ? 'Course Completed! 🎉'
                          : 'Next Module →'}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseViewer
