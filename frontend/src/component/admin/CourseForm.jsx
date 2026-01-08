import React, { useEffect, useState } from 'react'

const CourseForm = ({ initialValues = {}, instructors = [], instructorUsers = [], onSubmit, onCancel, submitLabel = 'Save', showInfoFields = true, fixedType = null }) => {
  const [formData, setFormData] = useState({
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
    type: '',
    language: 'English',
    status: 'Draft',
    requirements: '',
    what_you_learn: '',
    course_modules: '',
    video_url: '',
    certificate: true,
  })
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialValues) {
      setFormData(prev => ({ ...prev, ...initialValues }))
    }
  }, [initialValues])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleFileChange = (e) => setThumbnailFile(e.target.files[0])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!onSubmit) return
    try {
      setSaving(true)
      await onSubmit(formData, thumbnailFile)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Title and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title <span className="text-red-500">*</span></label>
          <input name="title" value={formData.title} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
          <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2">
            <option value="">Select category</option>
            <option value="Web Development">Web Development</option>
            <option value="Mobile Development">Mobile Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Artificial Intelligence">Artificial Intelligence</option>
            <option value="Machine Learning">Machine Learning</option>
            <option value="Cloud Computing">Cloud Computing</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>

      {/* Price and Discount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (৳) <span className="text-red-500">*</span></label>
          <input name="price" type="number" value={formData.price} onChange={handleInputChange} required min="0" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Discount Price (৳)</label>
          <input name="discount_price" type="number" value={formData.discount_price} onChange={handleInputChange} min="0" className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      {/* Duration and Lessons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Months) <span className="text-red-500">*</span></label>
          <input name="duration" type="number" value={formData.duration} onChange={handleInputChange} required min="1" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Number of Lessons <span className="text-red-500">*</span></label>
          <input name="lessons" type="number" value={formData.lessons} onChange={handleInputChange} required min="1" className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      {/* Instructor Assignment and Instructor Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assign Instructor <span className="text-red-500">*</span></label>
          <select name="instructor_id" value={formData.instructor_id} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2">
            <option value="">Select instructor</option>
            {(instructorUsers || []).map(user => <option key={user.id} value={user.id}>{user.name} ({user.email})</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">Assign this course to an instructor (required)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructor Profile (Display)</label>
          <select name="instructor_profile_id" value={formData.instructor_profile_id} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Select instructor profile (optional)</option>
            {instructors.map(i => <option key={i.id} value={i.id}>{i.name}{i.title ? ` - ${i.title}` : ''}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">Optional: Link to instructor profile for public display</p>
        </div>
      </div>

      {/* Level and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level <span className="text-red-500">*</span></label>
          <select name="level" value={formData.level} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2">
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language <span className="text-red-500">*</span></label>
          <select name="language" value={formData.language} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2">
            <option value="English">English</option>
            <option value="Bengali">Bengali</option>
            <option value="Both">Both (English & Bengali)</option>
          </select>
        </div>
      </div>

      {/* Type (Online / Offline) */}
      <div className="mt-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        {fixedType ? (
          <>
            <div className="w-full border rounded-lg px-3 py-2 text-gray-700">{fixedType}</div>
            <input type="hidden" name="type" value={fixedType} />
          </>
        ) : (
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2">
            <option value="">Select type</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
          </select>
        )}
      </div>

      {/* Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status <span className="text-red-500">*</span></label>
          <select name="status" value={formData.status} onChange={handleInputChange} required className="w-full border rounded-lg px-3 py-2">
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Thumbnail and Video URL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
          <input type="file" onChange={handleFileChange} accept="image/*" className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (Optional)</label>
          <input name="video_url" value={formData.video_url} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
      </div>

      {/* Certificate Checkbox */}
      <div className="flex items-center gap-2">
        <input type="checkbox" name="certificate" checked={!!formData.certificate} onChange={handleInputChange} className="w-4 h-4" />
        <label className="text-sm text-gray-700">Course includes certificate upon completion</label>
      </div>

      {showInfoFields && (
        <>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Description <span className="text-red-500">*</span></label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full border rounded-lg px-3 py-2" />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (Optional)</label>
            <textarea name="requirements" value={formData.requirements} onChange={handleInputChange} rows="3" className="w-full border rounded-lg px-3 py-2" />
          </div>

          {/* What You'll Learn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">What You'll Learn (Optional)</label>
            <textarea name="what_you_learn" value={formData.what_you_learn} onChange={handleInputChange} rows="3" className="w-full border rounded-lg px-3 py-2" />
          </div>

          {/* Course Modules */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Modules (Optional)</label>
            <textarea name="course_modules" value={formData.course_modules} onChange={handleInputChange} rows="3" className="w-full border rounded-lg px-3 py-2" />
          </div>
        </>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-100">Cancel</button>
        <button type="submit" disabled={saving} className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg">{saving ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  )
}

export default CourseForm
