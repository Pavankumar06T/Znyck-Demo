import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobal } from '../context/GlobalContext';

// This component is purely logic-driven.
// It loads the user state and redirects to the canonical URL.
export default function UserSpace() {
    const { user, orgs, apps, loading } = useGlobal();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return;

        // 1. Check if user is logged in
        if (!user) {
            navigate('/login');
            return;
        }

        // 2. Resolve Organization
        // For now, we take the first org (single org model)
        // Future: Support multi-org via cached preference
        const activeOrg = orgs[0];

        if (!activeOrg) {
            // Edge Case: User has no organization (shouldn't happen in current flow)
            // Redirect to a create-org flow or contact support
            navigate('/dashboard'); // Fallback
            return;
        }

        // 3. Resolve App
        // Navigate to the first available app's dashboard
        if (apps.length > 0) {
            const firstApp = apps[0];
            navigate(`/org/${activeOrg._id}/app/${firstApp.appId}/dashboard`, { replace: true });
        } else {
            // No apps exists -> Redirect to Create App Flow
            // We use the Org Root for this
            navigate(`/org/${activeOrg._id}/apps`, { replace: true });
        }

    }, [user, orgs, apps, loading, navigate]);

    return (
        <div className="min-h-screen bg-[#0f1117] flex items-center justify-center text-white">
            <div className="text-center">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Initializing environment...</p>
            </div>
        </div>
    );
}
