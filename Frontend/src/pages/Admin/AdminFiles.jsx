// pages/admin/AdminFiles.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../utils/apienpoints";
import AdminLayout from "../../layouts/AdminLayout";

export default function AdminFiles() {
  const { getToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const res = await fetch(API_ENDPOINTS.ADMIN_FILES, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setFiles(json?.data || []);
    } catch {
      toast.error("Failed to fetch files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const togglePublic = async (fileId) => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_TOGGLE_FILE(fileId), {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Visibility updated");
      fetchFiles();
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm("Delete this file?")) return;
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.ADMIN_DELETE_FILE(fileId), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("File deleted");
      fetchFiles();
    } catch {
      toast.error("Failed to delete file");
    }
  };

  return (
    <AdminLayout activeTab="Files">
      <h1 className="text-2xl font-bold mb-6">Files</h1>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="bg-white border rounded-lg overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Owner</th>
                <th className="p-3 text-left">Public</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f.id} className="border-t">
                  <td className="p-3">{f.id}</td>
                  <td className="p-3">{f.fileName || f.name}</td>
                  <td className="p-3">{f.clerkId || f.ownerClerkId || "-"}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${f.public ? "bg-green-100 text-green-700" : "bg-gray-100"}`}>
                      {f.public ? "Public" : "Private"}
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button className="text-indigo-600 hover:underline" onClick={() => togglePublic(f.id)}>
                      Toggle Public
                    </button>
                    <button className="text-red-600 hover:underline" onClick={() => deleteFile(f.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {files.length === 0 && (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={5}>
                    No files found
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