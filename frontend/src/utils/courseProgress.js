import api from '../config/api'

/**
 * Get progress for a course from the server (per student per course)
 */
export async function getProgress(courseId) {
  try {
    const response = await api.get(`/courses/${courseId}/progress`)
    return {
      completedLessons: response.data.completed_lessons || [],
      progressPercentage: response.data.progress_percentage || 0
    }
  } catch (error) {
    console.error('Error fetching progress:', error)
    return {
      completedLessons: [],
      progressPercentage: 0
    }
  }
}

/**
 * Save progress for a course to the server
 */
export async function saveProgress(courseId, completedLessons, totalLessons) {
  try {
    const progressPercentage = totalLessons > 0 
      ? Math.round((completedLessons.length / totalLessons) * 100) 
      : 0

    await api.post(`/courses/${courseId}/progress`, {
      completed_lessons: completedLessons,
      progress_percentage: progressPercentage
    })
    
    return true
  } catch (error) {
    console.error('Error saving progress:', error)
    return false
  }
}

/**
 * Calculate total lessons from modules
 */
export function calculateTotalLessons(modules) {
  if (!Array.isArray(modules)) return 0
  return modules.reduce((total, module) => {
    return total + (module.lessons?.length || 0)
  }, 0)
}

/**
 * Calculate progress percentage from completed lessons and modules
 */
export function calculateProgress(completedLessons, modules) {
  const totalLessons = calculateTotalLessons(modules)
  if (totalLessons === 0) return 0
  
  const completedCount = Array.isArray(completedLessons) ? completedLessons.length : 0
  return Math.round((completedCount / totalLessons) * 100)
}
