import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [timeLeft, setTimeLeft] = useState(250) // 4 minutes 10 seconds in seconds
  const navigate = useNavigate()

  // Timer countdown
  useEffect(() => {
    if (isSubmitted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isSubmitted, timeLeft])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Reset request sent to:', email)
    setIsSubmitted(true)
    // Add your forgot password logic here
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    console.log('Password reset with:', { newPassword, confirmPassword, verificationCode })
    // Add your password reset logic here
    // After successful reset, navigate to login
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'white' }}>
      {/* Header */}
      <header className="p-4 bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto">
          <Link to="/">
            <img src="/assets/downloadShikbo.png" alt="Shikhbo.AI Logo" className="h-10" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4" style={{ backgroundColor: 'white' }}>
        <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-lg shadow-xl">
          {!isSubmitted ? (
            <>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Reset Password
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter the email address you used when you joined and we'll send you instructions to reset your password. For security reasons, we do NOT store your password.
              </p>

              <form onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg shadow-md transition duration-150 mb-4"
                >
                  Reset Request
                </button>

                {/* Go Back to Login */}
                <div className="text-center text-sm text-gray-700">
                  Go back to{' '}
                  <Link
                    to="/login"
                    className="text-green-700 hover:text-green-800 font-bold underline"
                  >
                    Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              {/* Reset Password Form */}
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
                Reset Password
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Enter the email address you used when you joined and we'll send you instructions to reset your password. For security reasons, we do NOT store your password.
              </p>

              {/* Timer */}
              <div className="mb-6 text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">Remaining Time :</p>
                <p className="text-2xl font-bold text-green-700">00:{formatTime(timeLeft)}</p>
              </div>

              <form onSubmit={handleResetPassword}>
                {/* Verification Code */}
                <div className="mb-6">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Verifications Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    placeholder="Enter your verifications code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150"
                  />
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      id="newPassword"
                      placeholder="Enter your password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Confirm New Password */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Reset Password Button */}
                <button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg shadow-md transition duration-150"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ForgotPasswordPage
