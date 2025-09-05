// pages/admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { API_ENDPOINTS } from "../../utils/apienpoints";
import AdminLayout from "../../layouts/AdminLayout";


export default function AdminHome() {
  const { getToken } = useAuth();
  const [data, setData] = useState({ users: 0, files: 0, transactions: 0, loading: true });

  useEffect(() => {
    const load = async () => {
      try {
        const token = await getToken();
        const [uRes, fRes, tRes] = await Promise.all([
          fetch(API_ENDPOINTS.ADMIN_USERS, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(API_ENDPOINTS.ADMIN_FILES, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(API_ENDPOINTS.ADMIN_TRANSACTIONS, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const uJson = await uRes.json();
        const fJson = await fRes.json();
        const tJson = await tRes.json();

        setData({
          users: uJson?.data?.length || 0,
          files: fJson?.data?.length || 0,
          transactions: tJson?.data?.length || 0,
          loading: false,
        });
      } catch {
        setData((prev) => ({ ...prev, loading: false }));
      }
    };
    load();
  }, [getToken]);

  return (
    <AdminLayout activeTab="Dashboard">
      <h1 className="text-2xl font-bold mb-6">Admin Overview</h1>
      {data.loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="Total Users" value={data.users} />
          <Card title="Total Files" value={data.files} />
          <Card title="Total Transactions" value={data.transactions} />
        </div>
      )}
    </AdminLayout>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}