import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../config/api'

const AdminProgramsPage = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState([])
  const [loadingBookings, setLoadingBookings] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await api.get('/programs').catch(() => null)
        if (!mounted) return
        if (res && res.data && Array.isArray(res.data) && res.data.length) {
          setPrograms(res.data)
        } else {
          const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
          setPrograms(stored)
        }
      } catch (e) {
        const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
        setPrograms(stored)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    // load bookings separately
    const loadBookings = async () => {
      try {
        const res = await api.get('/bookings').catch(() => null)
        if (!mounted) return
        if (res && res.data && Array.isArray(res.data)) {
          setBookings(res.data)
        } else {
          const stored = JSON.parse(localStorage.getItem('bookings') || '[]')
          setBookings(stored)
        }
      } catch (e) {
        const stored = JSON.parse(localStorage.getItem('bookings') || '[]')
        setBookings(stored)
      } finally {
        if (mounted) setLoadingBookings(false)
      }
    }
    loadBookings()
    return () => { mounted = false }
  }, [])

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Programs</h2>
          <Link to="/admin/programs/add" className="bg-green-600 text-white px-4 py-2 rounded">+ Add Program</Link>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : programs.length === 0 ? (
          <div className="text-gray-500">No programs found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-black border-b bg-gray-50">
                  <th className="p-3">ID</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Badge</th>
                  <th className="p-3">Features</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {programs.map((p) => (
                  <AdminProgramRow key={p.id} program={p} onDeleted={(id) => setPrograms(prev => prev.filter(x => x.id !== id))} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow">
        <h3 className="text-xl font-bold mb-4">Bookings</h3>
        {loadingBookings ? (
          <div>Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-gray-500">No bookings found.</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded p-4 shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-black border-b bg-gray-50">
                  <th className="p-3">ID</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Slot</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Booked At</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3">#{b.id}</td>
                    <td className="p-3 font-medium">{b.program ? b.program.title : (b.program_id || '—')}</td>
                    <td className="p-3">{b.slot_label || b.slot_id || '—'}</td>
                    <td className="p-3">{b.name}</td>
                    <td className="p-3">{b.phone}</td>
                    <td className="p-3">{b.email}</td>
                    <td className="p-3">{new Date(b.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function AdminProgramRow({ program, onDeleted }) {
  const navigate = useNavigate()
  const [deleting, setDeleting] = useState(false)

  const handleEdit = () => navigate(`/admin/programs/edit/${program.id}`)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this program?')) return
    try {
      setDeleting(true)
      await api.delete(`/admin/programs/${program.id}`)
      onDeleted(program.id)
    } catch (err) {
      // fallback to localStorage removal
      try {
        const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
        const filtered = stored.filter(x => String(x.id) !== String(program.id))
        localStorage.setItem('learningPrograms', JSON.stringify(filtered))
        onDeleted(program.id)
      } catch (e) {
        console.error('Failed to delete program', e)
        alert('Failed to delete program')
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="p-3">#{program.id}</td>
      <td className="p-3 font-medium">
        <div>
          <div className="font-semibold">{program.title}</div>
        </div>
      </td>
      <td className="p-3"><span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">{program.badge}</span></td>
      <td className="p-3">{(program.features || []).slice(0,3).join(', ')}</td>
      <td className="p-3">{program.price_current || (program.price && program.price.current) || 'Free'}</td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <button title="Edit" onClick={handleEdit} className="p-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-xs flex items-center justify-center">
            <i className="fa-solid fa-pen-to-square text-xs" />
          </button>
          <button title="Delete" onClick={handleDelete} disabled={deleting} className="p-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs flex items-center justify-center">
            <i className="fa-solid fa-trash-can text-xs" />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default AdminProgramsPage
