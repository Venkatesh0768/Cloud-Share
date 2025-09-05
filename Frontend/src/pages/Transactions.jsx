import React, { useEffect, useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '@clerk/clerk-react';
import { API_ENDPOINTS } from '../utils/apienpoints';
import axios from 'axios';
import { AlertCircle, Check, Loader2 } from 'lucide-react';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const { getToken } = useAuth();

  // Fetch transactions on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setMessage('');
      try {
        const token = await getToken();
        if (!token) {
          throw new Error('Authentication token not available');
        }

        const response = await axios.get(API_ENDPOINTS.FETCH_TRANSACTIONS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10-second timeout
        });

        if (response.data.success) {
          setTransactions(response.data.data || []);
          if (!response.data.data.length) {
            setMessage('No transactions found.');
            setMessageType('info');
          }
        } else {
          throw new Error(response.data.message || 'Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        let errorMessage = '❌ Failed to load transactions. ';
        if (error.name === 'AbortError') {
          errorMessage += 'Request timed out. Please try again.';
        } else if (error.response?.data?.message) {
          errorMessage += error.response.data.message;
        } else {
          errorMessage += 'Please try again later.';
        }
        setMessage(errorMessage);
        setMessageType('error');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [getToken]);

  return (
    <DashboardLayout activeTab="Transactions">
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Transaction History</h1>
        <p className="text-gray-600 mb-6">View your payment history and credit purchases</p>

        {/* Status Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              messageType === 'error'
                ? 'bg-red-50 text-red-700 border border-red-200'
                : messageType === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-blue-50 text-blue-700 border border-blue-200'
            }`}
          >
            {messageType === 'error' && <AlertCircle size={20} />}
            {messageType === 'success' && <Check size={20} />}
            <span>{message}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-500">
            <Loader2 className="animate-spin inline-block mr-2" size={20} />
            Loading transactions...
          </div>
        )}

        {/* Transactions Table */}
        {!loading && transactions.length > 0 && (
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Order ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Credits Added
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{(transaction.amount / 100).toLocaleString()} {transaction.currency}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.creditsAdded}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === 'SUCCESS'
                            ? 'bg-green-100 text-green-800'
                            : transaction.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.transactionDate).toLocaleString('en-IN', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Transactions */}
        {!loading && transactions.length === 0 && !message && (
          <div className="text-center text-gray-500 bg-white p-6 rounded-lg border border-gray-200">
            No transactions found. Start by purchasing credits to see your history here.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Transactions;