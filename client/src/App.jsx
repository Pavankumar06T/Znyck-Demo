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

// Mock Pages
import CheckoutDemo from './pages/mock/CheckoutDemo';

const PrivateRoute = ({ children }) => {
    return children;
};

function App() {
    useEffect(() => {
        document.title = "Znyck Pay | Payments Infrastructure";
    }, []);

    // Adding future flags to Router by passing them as props is not standard in v6.4 browser routers,
    // but for BrowserRouter v6 it's just about structure.
    // The warnings are asking to opt-in via flags if we were using `createBrowserRouter`.
    // Since we are using <BrowserRouter>, we can ignore them or silence them.
    // For now, let's just ensure the routes are correct.

    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
                {/* Public Landing */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Dynamic Mock Client App (by App ID) */}
                <Route path="/apps/:appId" element={<CheckoutDemo />} />
                <Route path="/mock-shop" element={<Navigate to={`/apps/demo`} />} />

                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="transactions" element={<TransactionList />} />
                    {/* Add a catch-all to redirect back to overview if user types /dashboard/apps manually */}
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
