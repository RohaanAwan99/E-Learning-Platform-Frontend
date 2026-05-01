import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user, loading } = useSelector((state) => state.auth);

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }}>Loading...</div>; // simple spinner fallback
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/" replace />; // User logged in but unauthorized role
    }

    return <Outlet />;
};

export default ProtectedRoute;