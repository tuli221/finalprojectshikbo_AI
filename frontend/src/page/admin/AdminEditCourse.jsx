import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'
import CourseForm from '../../component/admin/CourseForm'

const AdminEditCourse = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [instructors, setInstructors] = useState([])
  const [instructorUsers, setInstructorUsers] = useState([])
  const [saving, setSaving] = useState(false)
  const [initialValues, setInitialValues] = useState(null)

  useEffect(() => {
    let mounted = true
    // fetch instructors and course in parallel
    const fetch = async () => {
      try {
        const [instRes, usersRes, courseRes] = await Promise.all([
          api.get('/instructors'),
          api.get('/admin/instructors/users'),
          api.get(`/courses/${id}`)
        ])
        if (!mounted) return
        setInstructors(instRes.data || [])
        setInstructorUsers(usersRes.data || [])
        const c = courseRes.data || {}
        setInitialValues({
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
          language: c.language || 'English',
          status: c.status || 'Draft',
          requirements: c.requirements || '',
          what_you_learn: c.what_you_learn || '',
          course_modules: c.course_modules || '',
          video_url: c.video_url || '',
          certificate: c.certificate ?? true,
        })
      } catch (err) {
        console.error('Failed to load data', err)
        alert('Failed to load course or instructors')
      }
    }
    fetch()
    return () => { mounted = false }
  }, [id])

  const handleCancel = () => navigate('/admin/courses')

  const handleSubmit = async (values, thumbnailFile) => {
    try {
      setSaving(true)
      const data = new FormData()
      Object.keys(values).forEach(key => {
        const val = values[key]
        if (val !== undefined && val !== null) {
          if (typeof val === 'boolean') data.append(key, val ? '1' : '0')
          else data.append(key, val)
        }
      })
      if (thumbnailFile) data.append('thumbnail', thumbnailFile)

      await api.put(`/admin/courses/${id}`, data)
      alert('Course updated')
      navigate('/admin/courses')
    } catch (err) {
      console.error('Failed to update course', err)
      const msg = err.response?.data?.message || 'Failed to update course'
      alert(msg)
      throw err
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold mb-2">Edit Course</h3>
        <p className="text-gray-600">Update any field and save changes</p>
      </div>

      <CourseForm
        initialValues={initialValues || {}}
        instructors={instructors}
        instructorUsers={instructorUsers}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={saving ? 'Saving...' : 'Save Changes'}
        showInfoFields={false}
        fixedType="Offline"
      />
    </div>
  )
}

export default AdminEditCourse
