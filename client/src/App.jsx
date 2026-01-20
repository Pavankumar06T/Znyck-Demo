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
import Developers from './pages/platform/Developers';
import Settings from './pages/platform/Settings';

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
                    <Route path="developers" element={<Developers />} />
                    <Route path="settings" element={<Settings />} />
                    {/* Placeholder for payments if we don't build a dedicated page yet */}
                    <Route path="payments" element={<Navigate to="/user-space" />} />
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
