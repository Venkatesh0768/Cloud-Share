// pages/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import AdminLayout from "../../layouts/AdminLayout";
import { API_ENDPOINTS } from "../../utils/apienpoints";


export default function AdminUsers() {
  const { getToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setUsers(json?.data || []);
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (clerkId, currentRole) => {
    try {
      const token = await getToken();
      const nextRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
      await fetch(API_ENDPOINTS.ADMIN_USER_ROLE(clerkId), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nextRole }),
      });
      toast.success("Role updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update role");
    }
  };

  const deleteUser = async (clerkId) => {
    if (!confirm("Delete this user?")) return;
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_DELETE_USER(clerkId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <AdminLayout activeTab="Users">
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="bg-white border rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">Clerk ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.clerkId} className="border-t">
                  <td className="p-3">{u.clerkId}</td>
                  <td className="p-3">{u.name || `${u.firstName || ""} ${u.lastName || ""}`}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-gray-100">{u.role}</span>
                  </td>
                  <td className="p-3 space-x-3">
                    <Link className="text-blue-600 hover:underline" to={`/admin/users/${u.clerkId}`}>
                      View
                    </Link>
                    <button
                      className="text-indigo-600 hover:underline"
                      onClick={() => toggleRole(u.clerkId, u.role)}
                    >
                      Set {u.role === "ADMIN" ? "USER" : "ADMIN"}
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteUser(u.clerkId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={5}>
                    No users found
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