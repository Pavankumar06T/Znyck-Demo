import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import WaitingPage from './pages/public/WaitingPage';

// Platform Pages
import Overview from './pages/platform/Overview';
import AdminAppList from './pages/platform/AdminAppList';
import ProductList from './pages/platform/ProductList';
import CategoryStore from './pages/platform/CategoryStore';

import CheckoutDemo from './pages/public/CheckoutDemo';

// Context
import { GlobalProvider } from './context/GlobalContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// New Architecture Pages
import AppDashboard from './pages/console/AppDashboard';
import AppTransactions from './pages/console/AppTransactions';
import AppWebhooks from './pages/console/AppWebhooks';
import AppDevelopers from './pages/console/AppDevelopers';
import AppSettings from './pages/console/AppSettings';
import AppsList from './pages/workspace/AppsList';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    useEffect(() => {
        document.title = "Znyck Pay | Payments Infrastructure";
    }, []);

    return (
        <GlobalProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/waiting" element={<WaitingPage />} />
                    
                    {/* Public Demo Route (no auth required) */}
                    <Route path="/apps/:appId" element={<CheckoutDemo />} />

                    {/* Protected Routes - Core Application */}
                    <Route path="/org/:orgId/app/:appId" element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<AppDashboard />} />
                        <Route path="transactions" element={<AppTransactions />} />
                        <Route path="webhooks" element={<AppWebhooks />} />
                        <Route path="developers" element={<AppDevelopers />} />
                        <Route path="settings" element={<AppSettings />} />
                    </Route>

                    {/* Protected Routes - Organization Apps List */}
                    <Route path="/org/:orgId/apps" element={
                        <ProtectedRoute>
                            <AppsList />
                        </ProtectedRoute>
                    } />

                    {/* Protected Routes - Dashboard */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={<Overview />} />
                        <Route path="apps" element={<AdminAppList />} />
                        <Route path="products" element={<ProductList />} />
                        <Route path="store/:category" element={<CategoryStore />} />
                    </Route>

                    {/* Catch all - redirect to home */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </GlobalProvider>
    );
}

export default App;
