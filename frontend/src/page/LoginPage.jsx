import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear errors when user types
    if (errors[id]) {
      setErrors({ ...errors, [id]: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const response = await login(formData)
      
      // Success! Redirect to homepage
      navigate('/')
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
      } else {
        setErrors({ general: error.message || 'Login failed' })
      }
    } finally {
      setLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
        <div className="w-full max-w-md bg-antiquewhite p-8 md:p-10 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
            Login to your account
          </h2>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email or username
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter email or username"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition duration-150 pr-10"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot-password" className="text-sm font-medium text-green-700 hover:text-teal-700">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg shadow-md transition duration-150 disabled:bg-gray-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <button className="w-full flex items-center justify-center border border-gray-300 bg-green-50 text-gray-700 py-2.5 px-4 rounded-lg shadow-sm hover:bg-green-100 transition duration-150">
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" className="mr-2" />
            <span className="font-medium">Continue with Google</span>
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center text-sm text-black">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-green-700 hover:text-teal-700">
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LoginPage