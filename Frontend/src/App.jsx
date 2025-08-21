import { Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import DashBoard from "./pages/DashBoard";
import MyFiles from "./pages/MyFiles";
import Subscripation from "./pages/Subscripation";
import Transactions from "./pages/Transactions";
import { RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Upload from "./pages/Upload";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
       <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/dashboard"
          element={
            <>
              <SignedIn>
                <DashBoard />
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
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center h-screen">
              <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
