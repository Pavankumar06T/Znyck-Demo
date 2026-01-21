import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ZnyckPay from './pages/ZnyckPay';
import UserSpace from './pages/UserSpace';
import Settings from './pages/platform/Settings';
import PaymentsAppsList from './pages/platform/PaymentsAppsList';

// Platform Pages
import DashboardOverview from './pages/platform/DashboardOverview';
import AppList from './pages/platform/AppList';
import ProductList from './pages/platform/ProductList';
import CategoryStore from './pages/platform/CategoryStore';

// Mock Pages
import CheckoutDemo from './pages/mock/CheckoutDemo';
import DemoStore from './pages/DemoStore';

const PrivateRoute = ({ children }) => {
    return children;
};

// Context
import { GlobalProvider } from './context/GlobalContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import PlatformLayout from './layouts/PlatformLayout';
import DashboardLayout from './layouts/DashboardLayout';

// New Architecture Pages
import AppDashboard from './pages/app/AppDashboard';
import AppTransactions from './pages/app/AppTransactions';
import AppWebhooks from './pages/app/AppWebhooks';
import AppDevelopers from './pages/app/AppDevelopers';
import AppSettings from './pages/app/AppSettings';
import AppsList from './pages/app/AppsList';

function App() {
    useEffect(() => {
        document.title = "Znyck Pay | Payments Infrastructure";
    }, []);

    return (
        <GlobalProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Routes>
                    {/* Landing Page */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/znyck-pay" element={<ZnyckPay />} />

                    {/* NEW: Core Application Routes */}
                    <Route path="/org/:orgId/app/:appId" element={<MainLayout />}>
                        <Route index element={<Navigate to="dashboard" />} />
                        <Route path="dashboard" element={<AppDashboard />} />
                        <Route path="transactions" element={<AppTransactions />} />
                        <Route path="webhooks" element={<AppWebhooks />} />
                        <Route path="developers" element={<AppDevelopers />} />
                        <Route path="settings" element={<AppSettings />} />
                    </Route>

                    {/* Bootstrap Route (Redirects Only) */}
                    <Route path="/user-space" element={<UserSpace />} />

                    {/* Organization Root (Apps List) */}
                    <Route path="/org/:orgId/apps" element={<AppsList />} />

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

                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
            </Router>
        </GlobalProvider>
    );
}

export default App;
