'use client';

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from '../../store/slices/authSlice';
import LoadingScreen from '../common/LoadingScreen';
import { useNotification } from '@/components/ui/Notification';

const ProtectedRoute = ({ children, requiredRole }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectCurrentUser);
    const location = useLocation();
    const notification = useNotification();

    if (!isAuthenticated) {
        notification.showNotification('Please log in to access this page', 'warning');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole && user?.role !== requiredRole) {
        notification.showNotification('You do not have permission to access this page', 'error');
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute; 