import { useUser } from "@clerk/clerk-react";
import { User } from "lucide-react";
import { SIDE_MENU_DATA } from "../assets/data";
import { useNavigate } from "react-router-dom";

function SideMenu({ activeTab }) {
  const { user } = useUser();
  const navigate = useNavigate();
  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      {/* User profile section - No changes needed here */}
      <div className="flex flex-col items-center justify-center gap-3 mt-3 mb-7">
        {user?.imageUrl ? (
          <img
            src={user.imageUrl}
            alt="User Avatar"
            className="w-20 h-20 bg-slate-200/50 rounded-full"
          />
        ) : (
          <User className="w-20 h-20 bg-slate-200/50 rounded-full p-4 text-gray-500" />
        )}
        <h5 className="text-gray-950 font-medium leading-6 truncate w-full text-center">
          {user?.fullName || ""}
        </h5>
      </div>

      {/* Navigation section - FIXES APPLIED HERE */}
      {SIDE_MENU_DATA.map((item) => {
        const isActive = activeTab === item.label;
        return (
          <div
            key={item.id}
            onClick={() => navigate(item.path)}
            // UX IMPROVEMENT: Added cursor-pointer
            // FIX: Removed text-white from here as it's now handled by children
            className={`w-full flex items-center gap-4 text-[15px] py-3 px-6 rounded-lg mb-3 transition-all duration-200 cursor-pointer ${
              isActive
                ? "bg-purple-500 text-white font-medium shadow-md hover:bg-purple-600"
                : "hover:bg-gray-100"
            }`}
          >
            {/* FIX: Conditionally set icon color */}
            <item.icon
              className={`w-5 h-5 transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-600"
              }`}
            />
            {/* FIX: Conditionally set label color */}
            <span
              className={`font-medium transition-colors duration-200 ${
                isActive ? "text-white" : "text-gray-800"
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SideMenu;