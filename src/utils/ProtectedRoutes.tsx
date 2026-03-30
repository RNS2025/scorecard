import type {FC, ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from "../hooks/useAuth.ts";


interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({children}) => {
    const {user, loading} = useAuth();

    if (loading) {
        return <p className="text-center animate-pulse">Indlæser...</p>;
    }

    if (!user) {
        return <Navigate to="/" replace/>;
    }

    return <>{children}</>;
};

export default ProtectedRoute;