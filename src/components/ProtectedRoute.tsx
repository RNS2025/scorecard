import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.ts";
import type { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <p className="text-center mt-20 animate-pulse">Indlæser...</p>;
    }

    if (!user) {
        return <Navigate to="/admin" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

