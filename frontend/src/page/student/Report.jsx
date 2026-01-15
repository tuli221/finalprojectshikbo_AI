import React, { useEffect, useState } from 'react'
import api from '../../config/api'

export default function Report() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        setLoading(true)
        // fetch dashboard (contains enrollments) and payments
        const [dashRes, payRes] = await Promise.all([
          api.get('/student/dashboard').catch(() => ({ data: {} })),
          api.get('/student/payments').catch(() => ({ data: { payments: [] } })),
        ])
        if (!mounted) return
        const user = dashRes.data.user || null
        const enrollments = (user && user.enrollments) ? user.enrollments : []
        const paymentsList = payRes.data.payments || []

        // Build a payments-like array from enrollments to ensure they show up
        const fromEnrollments = enrollments.map(en => ({
          _enrollment: en,
          course_id: en.course_id,
          course: en.course || null,
          amount: 0,
          status: en.status || 'active',
          created_at: en.enrolled_at || en.created_at || null,
        }))

        // merge payments + enrollment placeholders so Report groups properly
        setPayments([...paymentsList, ...fromEnrollments])
      } catch (e) {
        console.error(e)
        setError('Failed to load payments')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()
    return () => { mounted = false }
  }, [])

  // Group by course
  const grouped = payments.reduce((acc, p) => {
    const cid = p.course_id || (p.course && p.course.id) || 'unknown'
    if (!acc[cid]) acc[cid] = { course: p.course || null, payments: [] }
    acc[cid].payments.push(p)
    return acc
  }, {})

  const rows = Object.values(grouped).map(({ course, payments }) => {
    const price = Number(course?.discount_price ?? course?.price ?? 0)
    const paid = payments.reduce((s, x) => s + Number(x.amount || 0), 0)
    const due = Math.max(0, price - paid)
    // enrollment time: use the latest completed payment created_at or payment.enrolled_at
    const completed = payments.filter(px => px.status === 'completed')
    const latest = (completed.length ? completed : payments).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0]
    const enrolledAt = latest ? (latest.created_at || latest.enrolled_at) : null
    return { course, price, paid, due, enrolledAt }
  })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Report</h1>

      {loading ? (
        <div className="text-sm text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-gray-600">No enrollments or payments found.</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                  <th className="px-4 py-2">Course</th>
                  <th className="px-4 py-2">Instructor</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Paid</th>
                <th className="px-4 py-2">Due</th>
                <th className="px-4 py-2">Enrollment Time</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t text-sm text-gray-700">
                  <td className="px-4 py-3">{r.course?.title || r.course?.name || 'Unknown Course'}</td>
                    <td className="px-4 py-3">{r.course?.instructor?.name || r.course?.instructor || '-'}</td>
                  <td className="px-4 py-3">৳{Number(r.price).toLocaleString()}</td>
                  <td className="px-4 py-3">৳{Number(r.paid).toLocaleString()}</td>
                  <td className="px-4 py-3">৳{Number(r.due).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.enrolledAt ? formatDateTime(r.enrolledAt) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDateTime(value) {
  try {
    const d = new Date(value)
    return d.toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return '-'
  }
}
