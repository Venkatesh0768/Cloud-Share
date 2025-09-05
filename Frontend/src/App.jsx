// App.jsx
import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import MyFiles from "./pages/MyFiles";
import Subscripation from "./pages/Subscripation";
import Transactions from "./pages/Transactions";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Upload from "./pages/Upload";
import { Toaster } from "react-hot-toast";
import PublicFileView from "./pages/PublicFileView";
import { UserCreditsProvider } from "./context/UserCreditContext";
import AdminRoute from "./utils/AdminRoute";
import AdminHome from "./pages/Admin/AdminHome";
import AdminUserDetail from "./pages/Admin/AdminUserDetail";
import AdminUsers from "./pages/Admin/AdminUsers";
import AdminFiles from "./pages/Admin/AdminFiles";
import AdminTransactionDetail from "./pages/Admin/AdminTransactionDetail";
import AdminTransactions from "./pages/Admin/AdminTransactions";
import Dashboard from "./pages/DashBoard";


function App() {
  return (
    <div>
      <Toaster />
      <UserCreditsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />

          {/* User area */}
          <Route
            path="/dashboard"
            element={
              <>
                <SignedIn>
                  <Dashboard />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/upload"
            element={
              <>
                <SignedIn>
                  <Upload />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/myfiles"
            element={
              <>
                <SignedIn>
                  <MyFiles />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/subscription"
            element={
              <>
                <SignedIn>
                  <Subscripation />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/transactions"
            element={
              <>
                <SignedIn>
                  <Transactions />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* Public */}
          <Route path="/files/:id" element={<PublicFileView />} />

          {/* Admin area (protected by AdminRoute) */}
          <Route
            path="/admin"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminHome />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin/users"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminUsers />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin/users/:clerkId"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminUserDetail />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin/files"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminFiles />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminTransactions />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route
            path="/admin/transactions/:id"
            element={
              <>
                <SignedIn>
                  <AdminRoute>
                    <AdminTransactionDetail />
                  </AdminRoute>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-screen">
                <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </UserCreditsProvider>
    </div>
  );
}

export default App;