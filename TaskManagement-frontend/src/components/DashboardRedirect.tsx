import { useAppSelector } from "../app/hooks";
import { AdminDashBoard } from "../pages/Dashboard/AdminDashBoard";
import { Dashboard } from "../pages/Dashboard/Dashboard";

export function DashboardRedirect() {
    const user = useAppSelector((state) => state.auth.user);
    if (user?.role === "Admin") {
        return <AdminDashBoard />;
    }
    return <Dashboard />;
}