import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Platform Pages
import DashboardOverview from './pages/platform/DashboardOverview';
import TransactionList from './pages/platform/TransactionList';
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
                {/* Redirect root to dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Public/Mock Routes */}
                <Route path="/demo" element={<DemoStore />} />
                <Route path="/apps/:appId" element={<CheckoutDemo />} />
                <Route path="/mock-shop" element={<Navigate to={`/apps/demo`} />} />

                {/* Dashboard Routes - No Auth Guard */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="products" element={<ProductList />} />
                    <Route path="transactions" element={<TransactionList />} />
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
