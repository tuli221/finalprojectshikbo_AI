import React, { useEffect, useState } from 'react'
import api from '../../config/api'
import jsPDF from 'jspdf'

export default function Report() {
  const [loading, setLoading] = useState(true)
  const [payments, setPayments] = useState([])
  const [error, setError] = useState(null)
  const [studentInfo, setStudentInfo] = useState(null)

  const generateInvoicePDF = (courseData, studentData) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    
    // Header with Logo/Brand
    doc.setFillColor(34, 197, 94) // green-500
    doc.rect(0, 0, pageWidth, 40, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont(undefined, 'bold')
    doc.text('shikhbo.AI', pageWidth / 2, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text('Course Enrollment Invoice', pageWidth / 2, 30, { align: 'center' })
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    // Invoice Title
    doc.setFontSize(18)
    doc.setFont(undefined, 'bold')
    doc.text('INVOICE', 20, 55)
    
    // Invoice Details (Right Side)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const invoiceNumber = `INV-${courseData.course?.id || 'N/A'}-${Date.now().toString().slice(-6)}`
    const invoiceDate = formatDateTime(courseData.enrolledAt || new Date())
    doc.text(`Invoice #: ${invoiceNumber}`, pageWidth - 20, 55, { align: 'right' })
    doc.text(`Date: ${invoiceDate}`, pageWidth - 20, 62, { align: 'right' })
    
    // Student Information
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Student Information', 20, 80)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Name: ${studentData?.name || 'N/A'}`, 20, 88)
    doc.text(`Email: ${studentData?.email || 'N/A'}`, 20, 95)
    doc.text(`Phone: ${studentData?.phone || 'N/A'}`, 20, 102)
    
    // Horizontal Line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, 110, pageWidth - 20, 110)
    
    // Course Information
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Course Details', 20, 120)
    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    doc.text(`Course Name: ${courseData.course?.title || courseData.course?.name || 'N/A'}`, 20, 128)
    doc.text(`Instructor: ${courseData.course?.instructor?.name || courseData.course?.instructor || 'N/A'}`, 20, 135)
    doc.text(`Category: ${courseData.course?.category || 'N/A'}`, 20, 142)
    doc.text(`Type: ${courseData.course?.type || 'N/A'}`, 20, 149)
    
    // Horizontal Line
    doc.line(20, 157, pageWidth - 20, 157)
    
    // Payment Summary Table
    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Payment Summary', 20, 167)
    
    // Table Header
    doc.setFillColor(240, 240, 240)
    doc.rect(20, 172, pageWidth - 40, 10, 'F')
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.text('Description', 25, 179)
    doc.text('Amount (৳)', pageWidth - 25, 179, { align: 'right' })
    
    // Table Rows
    doc.setFont(undefined, 'normal')
    let yPos = 189
    
    doc.text('Course Fee', 25, yPos)
    doc.text(Number(courseData.price).toLocaleString(), pageWidth - 25, yPos, { align: 'right' })
    yPos += 7
    
    doc.text('Amount Paid', 25, yPos)
    doc.setTextColor(34, 197, 94) // green color for paid
    doc.text(Number(courseData.paid).toLocaleString(), pageWidth - 25, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0)
    yPos += 7
    
    if (courseData.due > 0) {
      doc.text('Amount Due', 25, yPos)
      doc.setTextColor(239, 68, 68) // red color for due
      doc.text(Number(courseData.due).toLocaleString(), pageWidth - 25, yPos, { align: 'right' })
      doc.setTextColor(0, 0, 0)
      yPos += 7
    }
    
    // Total Line
    doc.setDrawColor(0, 0, 0)
    doc.line(20, yPos, pageWidth - 20, yPos)
    yPos += 8
    
    doc.setFont(undefined, 'bold')
    doc.setFontSize(12)
    doc.text('Total Amount', 25, yPos)
    doc.text(`৳${Number(courseData.price).toLocaleString()}`, pageWidth - 25, yPos, { align: 'right' })
    
    // Payment Status
    yPos += 15
    doc.setFontSize(10)
    const status = courseData.due === 0 ? 'PAID' : courseData.paid > 0 ? 'PARTIALLY PAID' : 'PENDING'
    const statusColor = courseData.due === 0 ? [34, 197, 94] : courseData.paid > 0 ? [251, 146, 60] : [239, 68, 68]
    doc.setFillColor(...statusColor)
    doc.roundedRect(20, yPos - 5, 40, 10, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(status, 40, yPos + 1, { align: 'center' })
    doc.setTextColor(0, 0, 0)
    
    // Enrollment Information
    yPos += 20
    doc.setFont(undefined, 'bold')
    doc.setFontSize(11)
    doc.text('Enrollment Information', 20, yPos)
    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    yPos += 8
    doc.text(`Enrollment Date: ${formatDateTime(courseData.enrolledAt || new Date())}`, 20, yPos)
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 30
    doc.setDrawColor(200, 200, 200)
    doc.line(20, footerY, pageWidth - 20, footerY)
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('Thank you for choosing shikhbo.AI!', pageWidth / 2, footerY + 8, { align: 'center' })
    doc.text('For any queries, contact us at support@shikhbo.ai', pageWidth / 2, footerY + 14, { align: 'center' })
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, footerY + 20, { align: 'center' })
    
    // Save PDF
    const fileName = `Invoice_${courseData.course?.title?.replace(/[^a-z0-9]/gi, '_') || 'Course'}_${Date.now()}.pdf`
    doc.save(fileName)
  }

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
        setStudentInfo(user)
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
                <th className="px-4 py-2">Invoice</th>
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
                  <td className="px-4 py-3">
                    <button
                      onClick={() => generateInvoicePDF(r, studentInfo)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition"
                      title="Download Invoice PDF"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Invoice
                    </button>
                  </td>
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
