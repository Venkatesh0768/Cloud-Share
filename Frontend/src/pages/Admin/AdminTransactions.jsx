// pages/admin/AdminTransactions.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../utils/apienpoints";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminTransactions() {
  const { getToken } = useAuth();
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN_TRANSACTIONS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setTxs(json?.data || []);
    } catch {
      toast.error("Failed to fetch transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_TRANSACTION_STATUS(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      toast.success("Status updated");
      fetchTxs();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <AdminLayout activeTab="Transactions">
      <h1 className="text-2xl font-bold mb-6">Transactions</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="bg-white border rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {txs.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="p-3">
                    <Link to={`/admin/transactions/${t.id}`} className="text-blue-600 hover:underline">
                      {t.id}
                    </Link>
                  </td>
                  <td className="p-3">{t.userName || t.userEmail || t.clerkId}</td>
                  <td className="p-3">
                    {t.amount} {t.currency}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-gray-100">{t.status}</span>
                  </td>
                  <td className="p-3">{new Date(t.transactionDate).toLocaleString()}</td>
                  <td className="p-3 space-x-2">
                    <button className="text-indigo-600 hover:underline" onClick={() => updateStatus(t.id, "SUCCESS")}>
                      Set SUCCESS
                    </button>
                    <button className="text-yellow-600 hover:underline" onClick={() => updateStatus(t.id, "PENDING")}>
                      Set PENDING
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => updateStatus(t.id, "FAILED")}>
                      Set FAILED
                    </button>
                  </td>
                </tr>
              ))}
              {txs.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}