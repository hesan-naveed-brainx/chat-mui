import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';

const AuthLayout = () => {
    const isAuthenticated = true;

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="app">
            <Sidebar />
            <main className="content">
                <Topbar />
                <div className="content-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AuthLayout;