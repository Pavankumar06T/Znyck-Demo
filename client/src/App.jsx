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

// Platform Pages
import DashboardOverview from './pages/platform/DashboardOverview';
import ProductList from './pages/platform/ProductList';
import CategoryStore from './pages/platform/CategoryStore';

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
                <Route path="/znyck-pay" element={<ZnyckPay />} />
                <Route path="/user-space" element={<UserSpace />} />

                {/* Public/Mock Routes */}
                <Route path="/demo" element={<DemoStore />} />
                <Route path="/apps/:appId" element={<CheckoutDemo />} />
                <Route path="/mock-shop" element={<Navigate to={`/apps/demo`} />} />

                {/* Dashboard Routes - No Auth Guard */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="store/:category" element={<CategoryStore />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>

                {/* Catch all */}
                <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
        </Router>
    );
}

export default App;
