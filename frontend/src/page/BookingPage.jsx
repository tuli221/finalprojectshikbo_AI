import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../config/api'

const BookingPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [program, setProgram] = useState(null)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [step, setStep] = useState(1) // 1: choose slot, 2: enter info
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const res = await api.get(`/programs/${id}`).catch(() => null)
        if (res && res.data && mounted) {
          setProgram(res.data)
        } else {
          const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
          const found = stored.find(x => String(x.id) === String(id))
          if (found && mounted) setProgram(found)
        }
      } catch (e) {
        const stored = JSON.parse(localStorage.getItem('learningPrograms') || '[]')
        const found = stored.find(x => String(x.id) === String(id))
        if (found && mounted) setProgram(found)
      }

      // generate two demo slots: one tomorrow evening and one in February
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(now.getDate() + 1)
      tomorrow.setHours(18, 0, 0, 0)

      // a February slot (choose Feb 21, 2026 at 18:00)
      const febSlot = new Date(2026, 1, 21, 12, 0, 0)

      const sample = [
        { id: 'slot-1', label: febSlot.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), seats: 25, duration: '02:00:00' }
      ]
      if (mounted) setSlots(sample)
    }

    load()
    return () => { mounted = false }
  }, [id])

  const validateInfo = () => {
    const emailValid = email.trim().length > 3 && email.includes('@')
    const phoneValid = phone.trim().length >= 6
    const nameValid = name.trim().length > 0
    return nameValid && phoneValid && emailValid
  }

  const confirmBooking = async () => {
    if (!selectedSlot) return alert('Please select a slot')
    setSaving(true)
    try {
      const slotLabel = slots.find(s => s.id === selectedSlot)?.label || null
      const payload = { program_id: id, slot_id: selectedSlot, slot_label: slotLabel, name, phone, email }
      try {
        await api.post('/bookings', payload)
        alert('Booking confirmed!')
        navigate('/learning-center')
        return
      } catch (e) {
        // fallback to localStorage
      }

      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      bookings.push({ id: `local-${Date.now()}`, program_id: id, slot_id: selectedSlot, slot_label: slotLabel, name, phone, email, created_at: new Date().toISOString() })
      localStorage.setItem('bookings', JSON.stringify(bookings))
      alert('Booking confirmed (saved locally)')
      navigate('/learning-center')
    } catch (err) {
      console.error(err)
      alert('Failed to confirm booking')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-semibold mb-1">Book Your Class</h2>
        <p className="text-sm text-gray-500 mb-6">In-person classes</p>

        <h3 className="text-xl font-bold mb-4">{program?.title || 'Loading...'}</h3>

        {step === 1 && (
          <>
            <div className="mb-6">
              <div className="text-lg font-medium mb-2">Available slots</div>
              <div className="space-y-3">
                {slots.map(s => (
                  <label key={s.id} className={`block border rounded-lg p-4 ${selectedSlot === s.id ? 'border-green-500 bg-green-50' : 'bg-white'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="slot" value={s.id} checked={selectedSlot === s.id} onChange={() => { setSelectedSlot(s.id); setStep(2); }} />
                      <div>
                        <div className="font-semibold">{s.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{s.duration} • {s.seats} seats</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div />
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6 border rounded-lg p-4 bg-white">
              <div className="text-lg font-medium mb-4">Provide your information</div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter your phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Enter your email" />
                </div>
              </div>
            </div>
          </>
        )}

        {(() => {
          const infoValid = validateInfo()
          return (
            <div className="flex justify-end mt-4">
              <div className="text-right">
                <button
                  onClick={confirmBooking}
                  disabled={saving || step !== 2 || !infoValid}
                  className={`px-6 py-3 rounded-lg font-semibold ${(saving || step !== 2 || !infoValid) ? 'bg-gray-200 text-gray-500' : 'bg-green-600 text-white'}`}
                >
                  {saving ? 'Confirming...' : 'Confirm your booking'}
                </button>
                {step === 2 && !infoValid && (
                  <div className="text-sm text-gray-500 mt-2">Please complete name, phone and email to enable Confirm.</div>
                )}
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default BookingPage
