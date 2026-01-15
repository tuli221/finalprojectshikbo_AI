import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../config/api'
import { useAuth } from '../context/AuthContext'

const PaymentSuccess = () => {
  const { tran } = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { refreshUser } = useAuth()

  useEffect(() => {
    let mounted = true
    const fetchPayment = async () => {
      try {
        const res = await api.get(`/sslcommerz/payment/${tran}`)
        if (!mounted) return
        setPayment(res.data.payment)
        // refresh user so dashboard/my-courses/report reflect new enrollment
        try { await refreshUser() } catch (e) { /* ignore */ }
      } catch (e) {
        setError('Failed to load payment details')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPayment()
    return () => { mounted = false }
  }, [tran])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8">
        <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
        <p className="text-gray-300 mb-4">Thank you — your payment was processed successfully.</p>

        <div className="bg-black/40 p-4 rounded-lg text-sm text-gray-200 mb-4">
          <div><strong>Transaction:</strong> {payment.tran_id}</div>
          <div><strong>Amount:</strong> ৳{payment.amount}</div>
          <div><strong>Currency:</strong> {payment.currency}</div>
          <div><strong>Status:</strong> {payment.status}</div>
          <div className="mt-2"><strong>Raw response:</strong>
            <pre className="text-xs text-gray-300 mt-2 whitespace-pre-wrap bg-gray-900 p-3 rounded">{payment.raw_response}</pre>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/student/my-courses" className="px-4 py-2 bg-green-500 text-black rounded font-semibold">Go to My Courses</Link>
          <Link to="/" className="px-4 py-2 bg-gray-700 rounded">Back to Home</Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess
