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
        const paymentData = res.data.payment
        setPayment(paymentData)
        
        // Only refresh user if payment was actually completed
        if (paymentData && paymentData.status === 'completed') {
          // refresh user so dashboard/my-courses/report reflect new enrollment
          try { await refreshUser() } catch (e) { /* ignore */ }
        }
      } catch (e) {
        setError('Failed to load payment details')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchPayment()
    return () => { mounted = false }
  }, [tran, refreshUser])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="min-h-screen flex items-center justify-center">{error}</div>
  
  // If payment is not completed, show appropriate message
  if (payment && payment.status !== 'completed') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-4 text-yellow-400">Payment Status: {payment.status}</h1>
          <p className="text-gray-300 mb-4">This payment is not completed.</p>
          <div className="flex gap-3">
            <Link to="/" className="px-4 py-2 bg-gray-700 rounded">Back to Home</Link>
          </div>
        </div>
      </div>
    )
  }

  // Parse raw response to get payment details
  let paymentDetails = {}
  try {
    if (payment.raw_response) {
      paymentDetails = typeof payment.raw_response === 'string' 
        ? JSON.parse(payment.raw_response) 
        : payment.raw_response
    }
  } catch (e) {
    console.error('Failed to parse payment response', e)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-gray-800 rounded-xl p-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/10 rounded-full mb-4">
            <i className="fa-solid fa-check text-4xl text-green-500"></i>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-green-500">Payment Successful!</h1>
          <p className="text-gray-300">Your payment has been processed successfully.</p>
        </div>

        {/* Payment Summary */}
        <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-400">Payment Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400 mb-1">Transaction ID</p>
              <p className="font-mono text-white">{payment.tran_id}</p>
            </div>
            <div>
              <p className="text-gray-400 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-400">৳{parseFloat(payment.amount).toLocaleString()}</p>
            </div>
            {paymentDetails.card_type && (
              <div>
                <p className="text-gray-400 mb-1">Payment Method</p>
                <p className="text-white font-semibold">{paymentDetails.card_type}</p>
              </div>
            )}
            {paymentDetails.bank_tran_id && (
              <div>
                <p className="text-gray-400 mb-1">Bank Transaction ID</p>
                <p className="font-mono text-white text-xs">{paymentDetails.bank_tran_id}</p>
              </div>
            )}
            {paymentDetails.tran_date && (
              <div>
                <p className="text-gray-400 mb-1">Transaction Date</p>
                <p className="text-white">{new Date(paymentDetails.tran_date).toLocaleString()}</p>
              </div>
            )}
            {paymentDetails.card_issuer && (
              <div>
                <p className="text-gray-400 mb-1">Card Issuer</p>
                <p className="text-white">{paymentDetails.card_issuer}</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <i className="fa-solid fa-info-circle text-blue-400 mt-1"></i>
            <div className="text-sm">
              <p className="font-semibold text-blue-400 mb-1">You're now enrolled!</p>
              <p className="text-gray-300">You have been successfully enrolled in the course. You can start learning right away from your dashboard.</p>
            </div>
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
