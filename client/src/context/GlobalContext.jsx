import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api'; // Changed import to default

export const GlobalContext = createContext();

export const useGlobal = () => useContext(GlobalContext);

export const GlobalProvider = ({ children }) => {
    // 1. Core State
    const [user, setUser] = useState(null);
    const [orgs, setOrgs] = useState([]);
    const [activeOrg, setActiveOrg] = useState(null);
    const [apps, setApps] = useState([]);
    const [activeApp, setActiveApp] = useState(null);
    const [env, setEnv] = useState(() => localStorage.getItem('znyck_env') || 'test');
    const [loading, setLoading] = useState(true);

    // 2. Initial Load (Auth + Orgs)
    useEffect(() => {
        const init = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                // Fetch User & Orgs
                // adjusting to use the existing api calls or fetch directly if api.js not ready
                // Using raw fetch for auth check to avoid circular deps if api.js changes
                const res = await api.get('/auth/me'); // Replaced fetch with api.get
                const data = res.data; // Adjusted data access

                if (data.user) {
                    setUser(data.user);

                    // If the backend returns a single org (current design), wrap in array or fetch list
                    if (data.organization) {
                        setOrgs([data.organization]);
                        setActiveOrg(data.organization);

                        // Pre-fetch apps to prevent bootstrap race conditions
                        try {
                            const appsRes = await api.get(`/apps?organizationId=${data.organization._id}`);
                            const appsData = appsRes.data;
                            if (appsData.apps) {
                                setApps(appsData.apps);
                            } else if (Array.isArray(appsData)) {
                                setApps(appsData);
                            }
                        } catch (appErr) {
                            console.error("Failed to pre-load apps:", appErr);
                        }
                    }
                }
            } catch (err) {
                console.error("Global Context Init Failed:", err);
                // Optionally clear token if 401 (Unauthorized) or 404 (User Not Found - e.g. deleted user/switched DB)
                if (err.response && (err.response.status === 401 || err.response.status === 404)) {
                    localStorage.removeItem('token');
                    // Optionally redirect to login, but since this is init, state change to user=null is enough
                }
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    // 3. Fetch Apps when Active Org Changes (Subsequent changes)
    useEffect(() => {
        // Skip if loading (initial load handled above) or no activeOrg
        if (!activeOrg || loading) {
            // Logic: If we are not loading, but activeOrg became null, we clear apps.
            if (!loading && !activeOrg) setApps([]);
            return;
        }

        // Check if we already have apps for this org (optimization) usually done by ID check but
        // for simplicity, we can let it refetch or check if apps[0]?.orgId === activeOrg._id
        // But to be safe and simple: just refetch if we switched orgs AFTER init.

        // We need a way to distinguish "init" vs "switch". 
        // Actually, the above init sets `apps` state. This effect depends on `activeOrg`.
        // React might run this effect even after init sets it? 
        // Let's just allow it to re-fetch or use a ref to skip first run if needed. 
        // But simpler: just let it be. If init fetched it, this might fetch again? 
        // A simple check: if apps are already populated and match org, skip?
        // Let's implement that check.
        if (apps.length > 0 && (apps[0].organization === activeOrg._id || apps[0].organization?._id === activeOrg._id)) {
            return;
        }

        const loadApps = async () => {
            try {
                const res = await api.get(`/apps?organizationId=${activeOrg._id}`); // Replaced fetch with api.get
                const data = res.data; // Adjusted data access
                if (data.apps) {
                    setApps(data.apps);
                } else if (Array.isArray(data)) {
                    // Handle if endpoint returns array directly
                    setApps(data);
                }
            } catch (err) {
                console.error("Failed to load apps:", err);
            }
        };
        loadApps();
    }, [activeOrg]);

    // 4. Invariant: Active App MUST belong to Active Org
    useEffect(() => {
        if (activeApp && activeOrg) {
            if (activeApp.organization !== activeOrg._id && activeApp.organization._id !== activeOrg._id) {
                console.warn("Invariant Violation: Active App does not belong to Active Org. Resetting App.");
                setActiveApp(null);
            }
        }
    }, [activeApp, activeOrg]);

    // 5. Persistence & Headers Side-Effects
    useEffect(() => {
        localStorage.setItem('znyck_env', env);
        // We also rely on these for the API interceptor
        if (activeApp) localStorage.setItem('znyck_active_app_id', activeApp.appId);
        else localStorage.removeItem('znyck_active_app_id');

        if (activeOrg) localStorage.setItem('znyck_active_org_id', activeOrg._id);
    }, [env, activeApp, activeOrg]);


    return (
        <GlobalContext.Provider value={{
            user, setUser,
            orgs, setOrgs,
            activeOrg, setActiveOrg,
            apps, setApps,
            activeApp, setActiveApp,
            env, setEnv,
            loading
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
