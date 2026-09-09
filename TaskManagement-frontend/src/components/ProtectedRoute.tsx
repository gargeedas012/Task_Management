import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

export interface ProtectedRouteProps {
    children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
    console.log("authenticated", isAuthenticated)
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }
    return <>{children}</>;
}

export function PublicRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAppSelector(
        (state) => state.auth
    );
    if (loading) {
        return <div>Loading...</div>;
    }
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
}
