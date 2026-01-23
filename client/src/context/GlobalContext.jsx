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
                // Optionally clear token if 401
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token');
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


    // 6. Login Action
    const login = async (token, userData, redirectPath = null) => {
        localStorage.setItem('token', token);
        // Persist minimal user data for rehydration before fetch
        localStorage.setItem('user', JSON.stringify({
            tenantId: userData.tenantId,
            role: userData.role,
            plan: userData.plan
        }));

        // Trigger a re-fetch or internal state update
        // Use the existing init logic or manual set
        // For speed, let's manually set what we have and let the effect fetch the rest
        // Actually, easiest is to just reload the page or trigger the init effect?
        // But we want SPA feel.
        // Let's call the init implementation manually or Extract init.

        // Better: Set loading true, and re-run init logic?
        // Or just implementing a hard reset helper.

        // Let's implement a clean init flow.
        setLoading(true);
        try {
            const res = await api.get('/auth/me'); // This will use the new token
            const data = res.data;
            if (data.user) {
                setUser(data.user);
                if (data.organization) {
                    setOrgs([data.organization]);
                    setActiveOrg(data.organization);

                    // Fetch apps
                    const appsRes = await api.get(`/apps?organizationId=${data.organization._id}`);
                    const appsData = appsRes.data;
                    const fetchedApps = appsData.apps || appsData;
                    setApps(Array.isArray(fetchedApps) ? fetchedApps : []);
                }
            }
        } catch (err) {
            console.error("Login Init Failed", err);
        } finally {
            setLoading(false);
        }
    };

    // 7. Logout Action
    const logout = () => {
        // Clear Storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('znyck_active_app_id');
        localStorage.removeItem('znyck_active_org_id');
        // We keep 'znyck_env', 'theme' as they are device preferences

        // Reset State
        setUser(null);
        setOrgs([]);
        setActiveOrg(null);
        setApps([]);
        setActiveApp(null);

        // Optional: Reset api header if needed, but api.js usually reads from localStorage on request
    };

    return (
        <GlobalContext.Provider value={{
            user, setUser,
            orgs, setOrgs,
            activeOrg, setActiveOrg,
            apps, setApps,
            activeApp, setActiveApp,
            env, setEnv,
            loading,
            login, logout
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
