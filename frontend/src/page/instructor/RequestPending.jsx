import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const RequestPending = () => {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if there's actually a pending request
    const requestSent = localStorage.getItem('instructor_request_sent')
    if (!requestSent) {
      // If no request was sent, redirect to dashboard
      navigate('/instructor/dashboard')
    }
  }, [navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center">
        {/* Animated Clock Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 rounded-full opacity-25 animate-ping"></div>
            <div className="relative bg-yellow-100 rounded-full p-6">
              <svg className="w-16 h-16 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Your Request is Pending
        </h1>
        
        <div className="mb-8">
          <p className="text-lg text-gray-600 mb-4">
            Thank you for applying to become an instructor!
          </p>
          <p className="text-base text-gray-500">
            Your application is currently under review. Please wait for admin approval.
          </p>
        </div>

        {/* Status Steps */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className="font-semibold text-gray-800">Application Submitted</h3>
                <p className="text-sm text-gray-600">Your request has been successfully received</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 opacity-60">
              <svg className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              <div>
                <h3 className="font-semibold text-gray-800">Under Review</h3>
                <p className="text-sm text-gray-600">Admin is reviewing your application</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 opacity-40">
              <svg className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <div>
                <h3 className="font-semibold text-gray-800">Approval</h3>
                <p className="text-sm text-gray-600">You'll be notified once approved</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-800">
            <strong>What's next?</strong><br />
            We'll review your application within 24-48 hours. You'll receive an email notification once a decision is made.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/instructor/dashboard')}
          className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

export default RequestPending
