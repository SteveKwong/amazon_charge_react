import React from "react";
import {Navigate, useLocation} from "react-router-dom";

type AuthGuardProps = {
    children: React.ReactElement;
};

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
    const location = useLocation();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
        return <Navigate to="/degraded" state={{ from: location.pathname }} replace />;
    }
    return children;
};

export default AuthGuard;









