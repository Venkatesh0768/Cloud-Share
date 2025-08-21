import { useUser } from "@clerk/clerk-react";
import React from "react";
import NavBar from "../components/NavBar";
import SideMenu from "../components/SideMenu";

function DashboardLayout({ children , activeTab }) {
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* NavBar */}
      <NavBar activeTab={activeTab}/>

      {user && (
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="max-[1080px]:hidden">
            <SideMenu activeTab={activeTab} />
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-gray-50">{children}</div>
        </div>
      )}
    </div>
  );
}

export default DashboardLayout;
