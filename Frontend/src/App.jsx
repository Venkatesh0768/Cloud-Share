// App.jsx
import React, { lazy, Suspense } from "react";
import { Route, Routes, Outlet } from "react-router-dom";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import AdminRoute from "./utils/AdminRoute";
import { UserCreditsProvider } from "./context/UserCreditContext";

// Lazy-loaded pages (code-splitting)
const Landing = lazy(() => import("./pages/Landing"));
const Dashboard = lazy(() => import("./pages/DashBoard"));
const Upload = lazy(() => import("./pages/Upload"));
const MyFiles = lazy(() => import("./pages/MyFiles"));
const Subscripation = lazy(() => import("./pages/Subscripation"));
const Transactions = lazy(() => import("./pages/Transactions"));
const PublicFileView = lazy(() => import("./pages/PublicFileView"));
const AdminHome = lazy(() => import("./pages/Admin/AdminHome"));
const AdminUsers = lazy(() => import("./pages/Admin/AdminUsers"));
const AdminUserDetail = lazy(() => import("./pages/Admin/AdminUserDetail"));
const AdminFiles = lazy(() => import("./pages/Admin/AdminFiles"));
const AdminTransactions = lazy(() => import("./pages/Admin/AdminTransactions"));
const AdminTransactionDetail = lazy(() =>
  import("./pages/Admin/AdminTransactionDetail")
);

// Accessible, minimal fallback while routes load
function RouteFallback() {
  return (
    <div
      className="flex items-center justify-center h-screen"
      role="status"
      aria-live="polite"
    >
      <span className="text-sm text-gray-500">Loading…</span>
    </div>
  );
}

// Basic error boundary to avoid white screens
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-xl font-semibold">Something went wrong.</h1>
        </div>
      );
    }
    return this.props.children;
  }
}

// Auth-protected wrapper (only mounts UserCreditsProvider when signed in)
function ProtectedRoute() {
  return (
    <>
      <SignedIn>
        <UserCreditsProvider>
          <Outlet />
        </UserCreditsProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

// Admin gate wrapper using your existing AdminRoute
function AdminGate() {
  return (
    <AdminRoute>
      <Outlet />
    </AdminRoute>
  );
}

// 404 Page
function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 3000,
          style: { fontSize: "14px" },
        }}
      />
      <ErrorBoundary>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />
            <Route path="/files/:id" element={<PublicFileView />} />

            {/* Protected user area */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/myfiles" element={<MyFiles />} />
              <Route path="/subscription" element={<Subscripation />} />
              <Route path="/transactions" element={<Transactions />} />

              {/* Admin area */}
              <Route element={<AdminGate />}>
                <Route path="/admin" element={<AdminHome />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route
                  path="/admin/users/:clerkId"
                  element={<AdminUserDetail />}
                />
                <Route path="/admin/files" element={<AdminFiles />} />
                <Route
                  path="/admin/transactions"
                  element={<AdminTransactions />}
                />
                <Route
                  path="/admin/transactions/:id"
                  element={<AdminTransactionDetail />}
                />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default App;
