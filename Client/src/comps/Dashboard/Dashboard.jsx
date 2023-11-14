import { Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

export default Dashboard;
