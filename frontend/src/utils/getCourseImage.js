import api from '../config/api'

export default function getCourseImage(course) {
  if (!course) return '/assets/React.jpg'

  // Prefer admin-provided thumbnail first, then other possible fields
  const src = course.thumbnail || course.image || course.imageSrc || course.thumbnail_url || course.image_url || ''

  if (!src) return '/assets/React.jpg'

  // If already absolute or root-relative, return as-is
  if (typeof src === 'string' && (src.startsWith('http') || src.startsWith('/'))) return src

  // Otherwise assume stored in /storage/<path> on API host
  try {
    const base = api.defaults?.baseURL || ''
    const host = base.replace(/\/api\/?$/i, '')
    return `${host}/storage/${src}`
  } catch (e) {
    return `/storage/${src}`
  }
}
