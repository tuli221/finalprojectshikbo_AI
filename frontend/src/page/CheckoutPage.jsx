import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../component/sections/Header/Navbar'
import Footer from '../component/sections/Footer/Footer'
import api from '../config/api'

const CheckoutPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const courseId = location.state?.courseId
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [paymentType, setPaymentType] = useState('full') // kept for compatibility but partial removed
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })

  useEffect(() => {
    // Redirect if no course ID
    if (!courseId) {
      navigate('/')
      return
    }

    // Fetch course details
    let mounted = true
    const fetchCourse = async () => {
      try {
        const res = await api.get(`/courses/${courseId}`)
        if (mounted) {
          setCourse(res.data)
          
          // Pre-fill user info from auth if available
          const token = localStorage.getItem('auth_token')
          if (token) {
            try {
              const userRes = await api.get('/user')
              if (mounted && userRes.data) {
                setFormData(prev => ({
                  ...prev,
                  name: userRes.data.name || '',
                  email: userRes.data.email || '',
                  phone: userRes.data.phone || ''
                }))
              }
            } catch (e) {
              console.error('Failed to fetch user info', e)
            }
          }
        }
      } catch (e) {
        console.error('Failed to load course', e)
        alert('Course not found')
        navigate('/')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchCourse()
    return () => { mounted = false }
  }, [courseId, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProceedToPayment = async () => {
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields')
      return
    }

    // Email validation
    if (!formData.email.includes('@')) {
      alert('Please enter a valid email address')
      return
    }

    // Phone validation
    if (formData.phone.trim().length < 10) {
      alert('Please enter a valid phone number')
      return
    }

    try {
      setProcessing(true)
      
      // Calculate payment amount (full payment only)
      const fullPrice = (course.discount_price !== undefined && course.discount_price !== null && course.discount_price !== '')
        ? course.discount_price
        : (course.price ?? 0)
      const paymentAmount = fullPrice

      // Initiate payment with SSLCommerz (always full)
      const res = await api.post('/sslcommerz/initiate', { 
        course_id: course.id,
        payment_type: 'full',
        amount: paymentAmount,
        student_name: formData.name,
        student_email: formData.email,
        student_phone: formData.phone,
        student_address: formData.address
      })
      
      const redirectUrl = res?.data?.redirect_url || res?.data?.url || res?.data?.GatewayPageURL || res?.data?.data?.redirect_url

      if (redirectUrl) {
        // Redirect to payment gateway
        window.location.href = redirectUrl
        return
      }

      if (typeof res?.data === 'string' && res.data.includes('<form')) {
        const w = window.open('', '_blank')
        if (w) {
          w.document.write(res.data)
          w.document.close()
        }
        return
      }

      alert('Unable to initiate payment. Please try again later.')
    } catch (e) {
      console.error('Payment initiation failed', e)
      alert('Payment initiation failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = () => {
    navigate(`/course/${courseId}`)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">Loading checkout...</div>
        </div>
      </>
    )
  }

  if (!course) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
          <div className="text-center">Course not found</div>
        </div>
      </>
    )
  }

  // Calculate price
  const price = (course.discount_price !== undefined && course.discount_price !== null && course.discount_price !== '')
    ? course.discount_price
    : (course.price ?? 0)
  const originalPrice = (course.discount_price !== undefined && course.discount_price !== null && course.discount_price !== '')
    ? (course.price ?? '')
    : ''

  // Get thumbnail
  let imageSrc = course?.imageSrc || ''
  if (!imageSrc && course?.thumbnail) {
    const base = api.defaults.baseURL ? api.defaults.baseURL.replace(/\/api\/?$/, '') : 'http://localhost:8000'
    imageSrc = course.thumbnail.startsWith('http') ? course.thumbnail : `${base}/storage/${course.thumbnail}`
  }

  return (
    <>
      <Navbar />
      <div className="bg-gray-900 text-white min-h-screen py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={handleCancel}
            className="flex items-center gap-2 text-gray-300 hover:text-green-400 mb-6 transition-colors"
          >
            <i className="fa-solid fa-arrow-left"></i> Back to Course Details
          </button>

          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Student Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address (Optional)
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your address"
                    rows="3"
                  />
                </div>
                
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleProceedToPayment}
                  disabled={processing}
                  className={`flex-1 font-semibold py-3 rounded-lg transition ${
                    processing 
                      ? 'bg-green-300 text-gray-900 cursor-not-allowed' 
                      : 'bg-green-500 hover:bg-green-600 text-gray-900'
                  }`}
                >
                  {processing ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800 rounded-xl p-6 sticky top-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="mb-4">
                  {imageSrc && (
                    <img 
                      src={imageSrc || '/assets/React.jpg'}
                      alt={course.title}
                      className="rounded-lg w-full h-32 object-cover mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-lg mb-2">{course.title || course.fullTitle}</h3>
                  <p className="text-gray-400 text-sm mb-2">{course.category}</p>
                </div>

                <div className="border-t border-gray-700 pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Course Price</span>
                    <span className="font-semibold">৳{(course.price ?? 0).toLocaleString()}</span>
                  </div>

                  {originalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-green-400 font-semibold">-৳{(course.price - price).toLocaleString()}</span>
                    </div>
                  )}

                  {originalPrice && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="font-semibold">৳{price.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Partial payment option removed */}

                  <div className="border-t border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold mb-1">
                      <span>Total Amount</span>
                      <span className="text-green-400">৳{price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-sm text-gray-300">
                    <i className="fa-solid fa-info-circle mt-1"></i>
                    <div>
                      <p className="font-semibold mb-1">Secure Payment</p>
                      <p className="text-xs text-gray-400">
                        Your payment information is encrypted and secure. Cancel anytime before completing payment - no charges will be applied.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default CheckoutPage
