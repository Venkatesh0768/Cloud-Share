// pages/admin/AdminUserDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import { API_ENDPOINTS } from "../../utils/apienpoints";

export default function AdminUserDetail() {
  const { clerkId } = useParams();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState("");

  const fetchUser = async () => {
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN_USER(clerkId), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setProfile(json?.data);
      setRole(json?.data?.role || "");
    } catch {
      toast.error("Failed to fetch user");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [clerkId]);

  const saveRole = async () => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_USER_ROLE(clerkId), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  if (!profile) {
    return (
      <AdminLayout activeTab="Users">
        <div>Loading…</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeTab="Users">
      <h1 className="text-2xl font-bold mb-6">User Detail</h1>
      <div className="bg-white border rounded-lg p-6 space-y-3">
        <div><span className="text-gray-500">Clerk ID:</span> {profile.clerkId}</div>
        <div><span className="text-gray-500">Name:</span> {profile.name || `${profile.firstName || ""} ${profile.lastName || ""}`}</div>
        <div><span className="text-gray-500">Email:</span> {profile.email}</div>
        <div className="flex items-center gap-3">
          <span className="text-gray-500">Role:</span>
          <select
            className="border rounded px-2 py-1"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={saveRole}>
            Save
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}