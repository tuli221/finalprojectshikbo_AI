import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../config/api'

const OtpVerifyPage = () => {
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState(300) // 5 minutes default
  const intervalRef = useRef(null)

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0')
    const s = (secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const startTimer = (secs = 300) => {
    // clear existing
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setRemaining(secs)
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          return 0
        }
        return r - 1
      })
    }, 1000)
  }

  useEffect(() => {
    // start timer on mount
    startTimer(300)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
        try {
          const res = await api.post('/otp/verify', { token })
          // update stored user if returned
          if (res.data.user) {
            localStorage.setItem('user', JSON.stringify(res.data.user))
          }
          alert(res.data.message || 'OTP verified')
          // clear token and redirect to login
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/otp/resend')
      alert(res.data.message || 'OTP resent')
      // restart timer after successful resend
      startTimer(300)
    } catch (err) {
      setError(err.response?.data?.message || 'Resend failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Verify your email</h2>
        <p className="text-sm text-gray-600 mb-4">Enter the 6-digit code sent to your email.</p>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border rounded mb-4"
          />
          <button disabled={loading} className="w-full bg-green-600 text-white py-2 rounded">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div className="mt-4 text-center">
            <div className="mb-2 text-sm">Time remaining: <span className="font-medium text-red-600">{formatTime(remaining)}</span></div>
          <button onClick={handleResend} disabled={loading || remaining > 0} className="text-sm text-green-600 disabled:opacity-40">{remaining > 0 ? 'Resend available after timer' : 'Resend code'}</button>
        </div>
      </div>
    </div>
  )
}

export default OtpVerifyPage
