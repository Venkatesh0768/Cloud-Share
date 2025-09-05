// components/Admin/AdminSideMenu.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Files, Receipt } from "lucide-react";
import { SIDE_ADMIN_DATA } from "../assets/data";



export default function AdminSideMenu({ activeTab }) {
  return (
    <div className="w-64 bg-white border-r h-full p-4">
      <h2 className="text-lg font-bold mb-4">Admin</h2>
      <nav className="space-y-2">
        {SIDE_ADMIN_DATA.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 ${
                  isActive || activeTab === item.label ? "bg-gray-100 font-semibold" : ""
                }`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}