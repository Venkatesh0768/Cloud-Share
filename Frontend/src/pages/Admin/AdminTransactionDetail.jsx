// pages/admin/AdminTransactionDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../utils/apienpoints";
import AdminLayout from "../../layouts/AdminLayout";


export default function AdminTransactionDetail() {
  const { id } = useParams();
  const { getToken } = useAuth();
  const [t, setT] = useState(null);
  const [status, setStatus] = useState("");

  const fetchTx = async () => {
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN_TRANSACTION(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setT(json?.data);
      setStatus(json?.data?.status || "");
    } catch {
      toast.error("Failed to fetch transaction");
    }
  };

  useEffect(() => {
    fetchTx();
  }, [id]);

  const saveStatus = async () => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_TRANSACTION_STATUS(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  if (!t) {
    return (
      <AdminLayout activeTab="Transactions">
        <div>Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="Transactions">
      <h1 className="text-2xl font-bold mb-6">Transaction Detail</h1>
      <div className="bg-white border rounded-lg p-6 space-y-2">
        <Row k="ID" v={t.id} />
        <Row k="Order ID" v={t.orderId} />
        <Row k="Payment ID" v={t.paymentId} />
        <Row k="User" v={t.userName || t.userEmail || t.clerkId} />
        <Row k="Amount" v={`${t.amount} ${t.currency}`} />
        <Row k="Credits Added" v={t.creditsAdded} />
        <Row k="Date" v={new Date(t.transactionDate).toLocaleString()} />
        <div className="flex items-center gap-3 pt-2">
          <span className="text-gray-500">Status:</span>
          <select
            className="border rounded px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={saveStatus}>
            Save
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}

function Row({ k, v }) {
  return (
    <div>
      <span className="text-gray-500">{k}:</span> {v}
    </div>
  );
}