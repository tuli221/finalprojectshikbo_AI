import React, { useState, useEffect } from 'react'
import api from '../../config/api'

const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get('/admin/payments')
        const payments = response.data.payments || []
        // Transform API data to match frontend format
        const formatted = payments.map(p => ({
          id: p.transaction_id || p.id,
          user: p.user?.name || 'N/A',
          course: p.course?.title || 'N/A',
          amount: Number(p.amount) || 0,
          method: p.payment_method || 'N/A',
          status: p.status || 'pending',
          date: new Date(p.created_at).toLocaleDateString('en-CA')
        }))
        setTransactions(formatted)
      } catch (error) {
        console.error('Failed to fetch payments:', error)
        setTransactions([])
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.course.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = transactions
    .filter((t) => t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success')
    .reduce((sum, t) => sum + t.amount, 0)
  const pendingAmount = transactions
    .filter((t) => t.status?.toLowerCase() === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading payments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Revenue Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Revenue</p>
            <h3 className="text-3xl font-bold">৳{totalRevenue.toLocaleString()}</h3>
          </div>
          <div className="text-4xl opacity-80">💰</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Pending Payments</p>
            <h3 className="text-3xl font-bold">৳{pendingAmount.toLocaleString()}</h3>
          </div>
          <div className="text-4xl opacity-80">⏳</div>
        </div>

        <div className="bg-gradient-to-r from-green-700 to-green-300 text-white p-5 rounded-2xl shadow-lg flex justify-between items-center">
          <div>
            <p className="text-bold opacity-80">Total Transactions</p>
            <h3 className="text-3xl font-bold">{transactions.length}</h3>
          </div>
          <div className="text-4xl opacity-80">💳</div>
        </div>
      </section>

      {/* Transactions Table */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">Payment Transactions</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm"
            />
            
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-sm text-black border-b bg-gray-50">
                <th className="p-3">Transaction ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Course</th>
                <th className="p-3">Amount (৳)</th>
                <th className="p-3">Method</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="p-3 font-medium">{txn.id}</td>
                  <td className="p-3">{txn.user}</td>
                  <td className="p-3">{txn.course}</td>
                  <td className="p-3 font-bold">৳{txn.amount.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-semibold">
                      {txn.method}
                    </span>
                  </td>
                  <td className="p-3">{txn.date}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        txn.status?.toLowerCase() === 'completed' || txn.status?.toLowerCase() === 'success'
                          ? 'bg-green-100 text-green-600'
                          : txn.status?.toLowerCase() === 'pending'
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="p-3 space-x-2">
                    <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm">
                      View
                    </button>
                    {(txn.status?.toLowerCase() === 'pending') && (
                      <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm">
                        Approve
                      </button>
                    )}
                    {(txn.status?.toLowerCase() === 'failed') && (
                      <button className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded text-sm">
                        Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-gray-500">No transactions found</div>
        )}
      </div>

      {/* Payment Methods Breakdown */}
      <div className="bg-white p-8 rounded-2xl shadow">
        <h3 className="text-xl font-semibold mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {['bKash', 'Nagad', 'Rocket', 'Card'].map((method) => {
            const methodTotal = transactions
              .filter((t) => t.method?.toLowerCase().includes(method.toLowerCase()) && (t.status?.toLowerCase() === 'completed' || t.status?.toLowerCase() === 'success'))
              .reduce((sum, t) => sum + t.amount, 0)
            return (
              <div key={method} className="border rounded-lg p-4 text-center">
                <h4 className="font-semibold text-green-600">{method}</h4>
                <p className="text-2xl font-bold mt-2">৳{methodTotal.toLocaleString()}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PaymentsPage
