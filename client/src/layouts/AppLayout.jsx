import React, { useState, useEffect, createContext, useContext } from 'react';
import { NavLink, Outlet, useParams, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Key, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchAppById } from '../services/api';

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export default function AppLayout() {
    const { appId } = useParams();
    const navigate = useNavigate();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch by appId (which accepts the public 'app_...' id from our Controller update)
                const data = await fetchAppById(appId);
                setApp(data);
            } catch (e) {
                console.error("Failed to load app", e);
            } finally {
                setLoading(false);
            }
        };
        if (appId) load();
    }, [appId]);

    const navItems = [
        { path: '', label: 'Overview', icon: LayoutDashboard, end: true },
        { path: 'transactions', label: 'Transactions', icon: CreditCard },
        { path: 'keys', label: 'API Keys', icon: Key },
        { path: 'settings', label: 'Settings', icon: Settings },
    ];

    if (loading) return (
        <div className="flex items-center justify-center h-96 text-blue-500">
            <Loader2 className="animate-spin" size={32} />
        </div>
    );

    if (!app) return (
        <div className="text-center py-20 text-gray-500">
            <h2 className="text-xl font-bold text-white">App Not Found</h2>
            <button onClick={() => navigate('/user-space/payments')} className="mt-4 text-blue-400">Back to Apps</button>
        </div>
    );

    return (
        <AppContext.Provider value={{ app }}>
            <div className="max-w-7xl mx-auto h-full flex flex-col">
                {/* App Header */}
                <div className="mb-8 select-none">
                    <button
                        onClick={() => navigate('/user-space/payments')}
                        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Apps</span>
                    </button>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-lg">
                            {app.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{app.name}</h1>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <span className="font-mono bg-white/5 px-2 py-0.5 rounded">{app.appId}</span>
                                <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                <span className="capitalize">{app.type}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sub Navigation */}
                <div className="flex border-b border-white/5 mb-8">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.end}
                            className={({ isActive }) => `
                                flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-all
                                ${isActive
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-gray-400 hover:text-white hover:border-white/10'
                                }
                            `}
                        >
                            <item.icon size={16} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </AppContext.Provider>
    );
}
