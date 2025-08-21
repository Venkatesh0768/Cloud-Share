import { useAuth, UserButton } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getToken();
        console.log(token);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [getToken]);

  return (
    <DashboardLayout activeTab="Dashboard">
      <div>Dashboard Content</div>
    </DashboardLayout>
  );
}

export default Dashboard;
