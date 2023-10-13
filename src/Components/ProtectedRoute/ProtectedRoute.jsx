import React from 'react';
import styles from './ProtectedRoute.module.css';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {

    const { userToken } = useSelector((store) => store.authReducer);

    if (userToken) return children;

    return <Navigate to={'/login'} />
}
