import React, { useState } from 'react'

const Payments = () => {
  const [transactions] = useState([
    {
      id: 1,
      date: '2024-12-01',
      course: 'Web Development Bootcamp',
      student: 'Rahul Ahmed',
      amount: 5000,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-11-28',
      course: 'Python for Data Science',
      student: 'Sadia Rahman',
      amount: 4500,
      status: 'Completed'
    },
    {
      id: 3,
      date: '2024-11-25',
      course: 'Machine Learning Basics',
      student: 'Tahmid Khan',
      amount: 6000,
      status: 'Pending'
    },
    {
      id: 4,
      date: '2024-11-20',
      course: 'Web Development Bootcamp',
      student: 'Nusrat Jahan',
      amount: 5000,
      status: 'Completed'
    },
    {
      id: 5,
      date: '2024-11-15',
      course: 'React Advanced Patterns',
      student: 'Fahim Islam',
      amount: 5500,
      status: 'Completed'
    }
  ])

  const totalEarnings = transactions
    .filter(t => t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = transactions
    .filter(t => t.status === 'Pending')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div>
      <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Payments & Earnings</h3>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Earnings</p>
          <h4 className="text-3xl font-bold">৳{totalEarnings.toLocaleString()}</h4>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90 mb-1">Pending</p>
          <h4 className="text-3xl font-bold">৳{pendingAmount.toLocaleString()}</h4>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <p className="text-sm opacity-90 mb-1">Total Transactions</p>
          <h4 className="text-3xl font-bold">{transactions.length}</h4>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h4 className="text-lg font-bold">Recent Transactions</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{transaction.course}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{transaction.student}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">
                    ৳{transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'Completed'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-yellow-100 text-yellow-600'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Payments
