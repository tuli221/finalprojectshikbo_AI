import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../config/api'

const StudentViewPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrollments, setEnrollments] = useState([])
  const [payments, setPayments] = useState([])

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch student details
        const studentRes = await api.get(`/admin/students/${id}`)
        setStudent(studentRes.data)
        
        // Fetch enrollments
        try {
          const enrollmentsRes = await api.get(`/admin/students/${id}/enrollments`)
          setEnrollments(enrollmentsRes.data)
        } catch (err) {
          console.log('No enrollments found')
        }
        
        // Fetch payments
        try {
          const paymentsRes = await api.get(`/admin/students/${id}/payments`)
          setPayments(paymentsRes.data)
        } catch (err) {
          console.log('No payments found')
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentDetails()
  }, [id])

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="text-center py-8 text-gray-600">Loading student details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="mb-4 text-red-600">{error}</div>
        <button
          onClick={() => navigate('/admin/users')}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
        >
          Back to Students
        </button>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="text-center py-8 text-gray-500">Student not found</div>
        <div className="text-center mt-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Back to Students
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Student Details</h2>
          <button
            onClick={() => navigate('/admin/users')}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
          >
            Back to Students
          </button>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
            <p className="text-lg font-semibold">{student.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
            <p className="text-lg">{student.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
            <p className="text-lg">{student.phone || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Role</label>
            <p className="text-lg capitalize">{student.role}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                student.status === 'Active'
                  ? 'bg-green-100 text-green-600'
                  : student.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {student.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Current Course</label>
            <p className="text-lg">{student.course?.title || 'Not enrolled'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Enrollment Date</label>
            <p className="text-lg">{student.enrollment_date || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
            <p className="text-lg">{student.address || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Enrollments */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-4">Enrollments</h3>
        {enrollments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-black border-b bg-gray-50">
                  <th className="p-3">Course</th>
                  <th className="p-3">Enrolled Date</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {enrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium">{enrollment.course?.title || 'N/A'}</td>
                    <td className="p-3">{enrollment.enrolled_at || 'N/A'}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                        Enrolled
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No enrollments found</p>
        )}
      </div>

      {/* Payments */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h3 className="text-2xl font-semibold mb-4">Payment History</h3>
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-black border-b bg-gray-50">
                  <th className="p-3">Transaction ID</th>
                  <th className="p-3">Course</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="p-3 font-mono text-sm">{payment.tran_id}</td>
                    <td className="p-3">{payment.course?.title || 'N/A'}</td>
                    <td className="p-3 font-semibold">৳{payment.amount}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          payment.status === 'Success'
                            ? 'bg-green-100 text-green-600'
                            : payment.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="p-3">{new Date(payment.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No payment history found</p>
        )}
      </div>
    </div>
  )
}

export default StudentViewPage
