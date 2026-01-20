import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ZnyckPay from './pages/ZnyckPay';
import UserSpace from './pages/UserSpace';
import PlatformLayout from './layouts/PlatformLayout';
import Settings from './pages/platform/Settings';
import PaymentsAppsList from './pages/platform/PaymentsAppsList';
import AppLayout from './layouts/AppLayout';
import AppOverview from './pages/platform/AppOverview';
import AppKeys from './pages/platform/AppKeys';

// Platform Pages
import DashboardOverview from './pages/platform/DashboardOverview';
import AppList from './pages/platform/AppList';
import ProductList from './pages/platform/ProductList';
import CategoryStore from './pages/platform/CategoryStore';

// New App Pages
import AppsList from './pages/app/AppsList';
import AppDashboard from './pages/app/AppDashboard';

// Mock Pages
import CheckoutDemo from './pages/mock/CheckoutDemo';
import DemoStore from './pages/DemoStore';

const PrivateRoute = ({ children }) => {
    return children;
};

function App() {
    useEffect(() => {
        document.title = "Znyck Pay | Payments Infrastructure";
    }, []);

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Landing Page */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/znyck-pay" element={<ZnyckPay />} />
                {/* User Space (Console) Routes */}
                <Route path="/user-space" element={<PlatformLayout />}>
                    <Route index element={<UserSpace />} />
                    <Route path="settings" element={<Settings />} />

                    {/* Payments -> Apps List */}
                    <Route path="payments" element={<PaymentsAppsList />} />

                    {/* Individual App Details */}
                    <Route path="apps/:appId" element={<AppLayout />}>
                        <Route index element={<AppOverview />} />
                        {/* Re-use placeholder/specific components */}
                        <Route path="transactions" element={<div className="p-10 text-center text-gray-500">Transactions List Integration Pending</div>} />
                        <Route path="keys" element={<AppKeys />} />
                        <Route path="settings" element={<div className="p-10 text-center text-gray-500">App Settings Pending</div>} />
                    </Route>
                </Route>

                {/* Public/Mock Routes */}
                <Route path="/demo" element={<DemoStore />} />
                <Route path="/apps/:appId" element={<CheckoutDemo />} />
                <Route path="/mock-shop" element={<Navigate to={`/apps/demo`} />} />

                {/* Dashboard Routes - No Auth Guard */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="apps" element={<AppList />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="store/:category" element={<CategoryStore />} />
                </Route>

                {/* Organization & App Context Routes */}
                <Route path="/org/:orgId/apps" element={<AppsList />} />
                <Route path="/org/:orgId/apps/:appId" element={<AppDashboard />} />

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
