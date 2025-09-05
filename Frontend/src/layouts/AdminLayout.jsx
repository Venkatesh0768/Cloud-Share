// layouts/AdminLayout.jsx
import React from "react";
import NavBar from "../components/NavBar";
import AdminSideMenu from "../components/AdminSideMenu";


export default function AdminLayout({ children, activeTab }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar activeTab={activeTab || "Admin"} />
      <div className="flex flex-1">
        <div className="max-[1080px]:hidden">
          <AdminSideMenu activeTab={activeTab} />
        </div>
        <div className="flex-1 p-6 bg-gray-50">{children}</div>
      </div>
    </div>
  );
}