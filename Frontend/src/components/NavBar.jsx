import { SignedIn, UserButton } from "@clerk/clerk-react";
import { Menu, Share2, Wallet, X } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SideMenu from "./SideMenu";
import CreditDisplay from "./CreditDisplay";
import { UserCreditContext } from "../context/UserCreditContext";

function NavBar({activeTab}) {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { fetchUserCredits , credits } = useContext(UserCreditContext);
  useEffect(() => {
    fetchUserCredits();
  }, [fetchUserCredits]);

  return (
    <>
      <div className="flex justify-between items-center bg-white border-b border-gray-200/50 px-4 py-2">
        <div className="flex items-center gap-5">
          {/* Hamburger for Mobile */}
          <button
            onClick={() => setOpenSideMenu(!openSideMenu)}
            className="block lg:hidden text-black hover:text-gray-500 p-1 rounded transition-colors"
          >
            {openSideMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <Share2 className="text-blue-600" />
            <span className="text-lg font-medium text-black truncate">
              Cloud Share
            </span>
          </div>
        </div>

        {/* Right Side */}
        <SignedIn>
          <div className="flex items-center gap-4">
            <Link to="/subscription">
              <CreditDisplay credits={credits}/>
            </Link>
            <UserButton />
          </div>
        </SignedIn>
      </div>

      {openSideMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setOpenSideMenu(false)}
          ></div>
          <div className="fixed left-0 top-0 w-64 bg-white border-r min-h-screen p-5 z-50">
            <SideMenu activeTab={activeTab} />
          </div>
        </div>
      )}
    </>
  );
}

export default NavBar;
