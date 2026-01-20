import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../../config/api'
import CourseForm from '../../component/admin/CourseForm'

const AddCoursePage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const [instructors, setInstructors] = useState([])
  const [instructorUsers, setInstructorUsers] = useState([])
  const [loading, setLoading] = useState(isEditMode)
  const [courseData, setCourseData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return

    let mounted = true
    const fetch = async () => {
      try {
        const promises = [
          api.get('/instructors'),
          api.get('/admin/instructors/users')
        ]
        
        // If edit mode, also fetch the course data
        if (isEditMode) {
          promises.push(api.get(`/courses/${id}`))
        }
        
        const results = await Promise.all(promises)
        const [instRes, usersRes, courseRes] = results
        
        if (!mounted) return

        // approved instructor profiles (public)
        const approved = (instRes.data || []).filter(i => i.status === 'Approved')
        setInstructors(approved)

        // merge admin users and approved instructor profiles into one deduped list
        const adminUsers = usersRes.data || []
        const map = new Map()
        const push = (u) => {
          if (!u) return
          const key = (u.email || u.id || '').toString().toLowerCase()
          if (!map.has(key)) map.set(key, u)
        }
        adminUsers.forEach(u => push({ id: u.id, name: u.name || '', email: u.email || '' }))
        approved.forEach(p => push({ id: p.user_id || p.id, name: p.name || '', email: p.email || '' }))
        setInstructorUsers(Array.from(map.values()))
        
        // If in edit mode, populate form with course data
        if (isEditMode && courseRes) {
          const c = courseRes.data || {}
          setCourseData({
            title: c.title || '',
            category: c.category || '',
            price: c.price ?? '',
            discount_price: c.discount_price ?? '',
            duration: c.duration ?? '',
            lessons: c.lessons ?? '',
            description: c.description || '',
            instructor_id: c.instructor_id ?? '',
            instructor_profile_id: c.instructor_profile_id ?? c.instructor_profile?.id ?? '',
            level: c.level || 'Beginner',
            type: c.type || 'Offline',
            language: c.language || 'English',
            status: c.status || 'Draft',
            certificate: c.certificate ?? true,
          })
        }
        
        setLoading(false)
      } catch (err) {
        console.error(err)
        if (isEditMode) {
          alert('Failed to load course data')
        }
        setLoading(false)
      }
    }
    fetch()
    return () => { mounted = false }
  }, [id, isEditMode])

  const handleSubmit = async (formData, thumbnailFile) => {
    const token = localStorage.getItem('auth_token')
    if (!token) {
      alert('Please login as admin')
      navigate('/login')
      return
    }
    
    const data = new FormData()
    
    // If editing, add method spoofing for Laravel
    if (isEditMode) {
      data.append('_method', 'PUT')
    }
    
    data.append('title', formData.title)
    data.append('category', formData.category)
    data.append('price', formData.price)
    data.append('duration', formData.duration)
    data.append('lessons', formData.lessons)
    data.append('description', formData.description)
    data.append('level', formData.level)
    data.append('language', formData.language)
    data.append('status', formData.status)
    if (formData.instructor_id) data.append('instructor_id', formData.instructor_id)
    data.append('certificate', formData.certificate ? '1' : '0')
    
    if (formData.discount_price) data.append('discount_price', formData.discount_price)
    if (formData.instructor_profile_id) data.append('instructor_profile_id', formData.instructor_profile_id)
    
    if (thumbnailFile) {
      console.log('Adding thumbnail to FormData:', thumbnailFile)
      data.append('thumbnail', thumbnailFile)
    }

    if (formData.type) data.append('type', formData.type)

    console.log('Submitting form with instructor_id:', formData.instructor_id)

    try {
      if (isEditMode) {
        // Use POST with _method=PUT for Laravel to properly parse FormData
        await api.post(`/admin/courses/${id}`, data)
        alert('Course updated successfully!')
      } else {
        await api.post('/admin/courses', data)
        alert('Course created successfully!')
      }
      navigate('/admin/courses')
    } catch (error) {
      console.error('Full error:', error.response?.data)
      const errors = error.response?.data?.errors
      if (errors) {
        const errorMessages = Object.entries(errors).map(([field, msgs]) => `${field}: ${msgs.join(', ')}`).join('\n')
        alert('Validation errors:\n' + errorMessages)
      } else {
        alert(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course`)
      }
    }
  }

  const handleCancel = () => {
    navigate('/admin/courses')
  }

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="text-center py-8 text-gray-500">Loading course data...</div>
      </div>
    )
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow relative">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold mb-2">{isEditMode ? 'Edit Course' : 'Add New Course'}</h3>
          <p className="text-gray-600">{isEditMode ? 'Update the course details and save changes' : 'Fill in the details to create a new course'}</p>
        </div>
      </div>

      <CourseForm
        initialValues={courseData || {
          title: '',
          category: '',
          price: '',
          discount_price: '',
          duration: '',
          lessons: '',
          description: '',
          instructor_id: '',
          instructor_profile_id: '',
          level: 'Beginner',
          type: 'Offline',
          language: 'English',
          status: 'Published',
          certificate: true,
        }}
        instructors={instructors}
        instructorUsers={instructorUsers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isEditMode ? 'Update Course' : 'Create Course'}
        showInfoFields={true}
      />
    </div>
  )
}

export default AddCoursePage
