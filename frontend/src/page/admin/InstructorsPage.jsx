import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { instructorApi } from '../../config/instructorApi'

const InstructorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [instructors, setInstructors] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    title: '',
    role: '',
    company: '',
    specialization: '',
    expertise_tags: '',
    bio: '',
    status: 'Approved',
    image: null
  })
  const [showPendingOnly, setShowPendingOnly] = useState(false)

  useEffect(() => { fetchInstructors() }, [])

  const fetchInstructors = async () => {
    try {
      setLoading(true)
      const data = await instructorApi.getAll()
      setInstructors(data || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) setFormData(prev => ({ ...prev, image: file }))
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', age: '', title: '', role: '', company: '', specialization: '', expertise_tags: '', bio: '', status: 'Approved', image: null })
    setImagePreview(null)
    setIsEditMode(false)
    setSelectedInstructor(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEditMode && selectedInstructor) {
        await instructorApi.update(selectedInstructor.id, formData)
      } else {
        await instructorApi.create(formData)
      }
      setShowAddModal(false)
      resetForm()
      fetchInstructors()
    } catch (err) {
      console.error(err)
      alert('Failed to save instructor')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = (instructor) => {
    setSelectedInstructor(instructor)
    setShowViewModal(true)
  }

  const handleEditClick = (instructorParam) => {
    const instr = instructorParam
    if (!instr) return
    setFormData({
      name: instr.name || '',
      email: instr.email || '',
      phone: instr.phone || '',
      age: instr.age || '',
      title: instr.title || '',
      role: instr.role || '',
      company: instr.company || '',
      specialization: instr.specialization || '',
      expertise_tags: instr.expertise_tags || '',
      bio: instr.bio || '',
      status: instr.status || 'Approved',
      image: null
    })
    if (instr.image) setImagePreview(`http://localhost:8000/storage/${instr.image}`)
    setSelectedInstructor(instr)
    setIsEditMode(true)
    setShowViewModal(false)
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this instructor?')) return
    try {
      await instructorApi.delete(id)
      fetchInstructors()
    } catch (err) { console.error(err); alert('Failed to delete') }
  }

  const filteredInstructors = instructors.filter(i => {
    const q = searchQuery.toLowerCase()
    return i.name?.toLowerCase().includes(q) || (i.specialization || '').toLowerCase().includes(q) || (i.expertise_tags || '').toLowerCase().includes(q)
  })

  const displayedInstructors = showPendingOnly ? instructors.filter(i => i.status === 'Pending') : filteredInstructors

  return (
    <div className="bg-white p-8 rounded-2xl shadow">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">Instructors</h3>
        <div className="flex items-center gap-2">
          <input type="text" placeholder="Search instructor..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="px-3 py-2 border rounded-lg text-sm" />
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm">+ Add</button>
          <button onClick={() => setShowPendingOnly(p => !p)} className="px-4 py-2 bg-gray-200 rounded-lg text-sm">{showPendingOnly ? 'Showing: Pending' : 'Pending'}</button>
        </div>
      </div>

      {loading && <div className="text-center py-8">Loading...</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedInstructors.map(instructor => (
          <div key={instructor.id} className="border rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {instructor.image && <img src={`http://localhost:8000/storage/${instructor.image}`} alt={instructor.name} className="w-12 h-12 rounded-full object-cover" />}
                <div>
                  <h4 className="font-semibold text-lg">{instructor.name}</h4>
                  <p className="text-sm text-gray-600">{instructor.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${instructor.status === 'Approved' ? 'bg-green-100 text-green-600' : instructor.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{instructor.status}</span>
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleViewDetails(instructor)} className="flex-1 px-3 py-2 bg-gray-200 rounded-lg text-sm">View</button>
              <button onClick={() => handleDelete(instructor.id)} className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm">Delete</button>
              {instructor.status === 'Pending' && (
                <button onClick={async () => { if (!window.confirm('Approve?')) return; try { await instructorApi.update(instructor.id, { status: 'Approved' }); fetchInstructors(); } catch (err) { console.error(err); alert('Failed') } }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">Approve</button>
              )}
            </div>
          </div>
        ))}
      </div>

      {displayedInstructors.length === 0 && !loading && <div className="text-center py-8 text-gray-500">No instructors found</div>}

      {/* View Modal */}
      {showViewModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Instructor Details</h3>
              <button onClick={() => { setShowViewModal(false); setSelectedInstructor(null) }} className="text-2xl">✖</button>
            </div>
            <div>
              <h4 className="text-2xl font-bold">{selectedInstructor.name}</h4>
              <p className="text-gray-600">{selectedInstructor.email}</p>
              <div className="mt-4 flex gap-2">
                <button onClick={() => { handleEditClick(selectedInstructor) }} className="px-4 py-2 bg-green-500 text-white rounded">Edit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">{isEditMode ? 'Edit Instructor' : 'Add Instructor'}</h3>
              <button onClick={() => { setShowAddModal(false); resetForm() }} className="text-2xl">✖</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm">Full Name</label>
                <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <input name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded px-3 py-2" required />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowAddModal(false); resetForm() }} className="px-4 py-2 border rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">{loading ? 'Saving...' : (isEditMode ? 'Update' : 'Add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorsPage
