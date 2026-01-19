import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../config/api'

const PaymentCancelled = () => {
  const { tran } = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    const fetchPayment = async () => {
      try {
        const res = await api.get(`/sslcommerz/payment/${tran}`)
        if (!mounted) return
        setPayment(res.data.payment)
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
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-600/30 rounded-full mb-4">
            <i className="fa-solid fa-ban text-4xl text-gray-400"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
          <p className="text-gray-300">You cancelled the payment process.</p>
        </div>

        {payment && (
          <div className="bg-black/40 p-4 rounded-lg text-sm text-gray-200 mb-6">
            <div><strong>Transaction:</strong> {payment.tran_id}</div>
            <div><strong>Amount:</strong> ৳{payment.amount}</div>
            <div><strong>Status:</strong> <span className="text-gray-400">{payment.status}</span></div>
          </div>
        )}

        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <i className="fa-solid fa-info-circle text-blue-400 mt-1"></i>
            <div className="text-sm text-gray-300">
              <p className="font-semibold text-blue-400 mb-1">No charges applied</p>
              <p>Your payment was cancelled and no money has been deducted from your account. You have not been enrolled in the course.</p>
              <p className="mt-2">You can try again whenever you're ready!</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/" className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-center rounded-lg font-semibold transition">
            Back to Home
          </Link>
          <Link to={`/course/${payment?.course_id || ''}`} className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-gray-900 text-center rounded-lg font-semibold transition">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PaymentCancelled
