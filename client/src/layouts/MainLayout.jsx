import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, CreditCard, Settings, Terminal,
    ShieldCheck, Bell, Search, ChevronDown, Plus, LogOut,
    Building2, AppWindow
} from 'lucide-react';
import { useGlobal } from '../context/GlobalContext';

export default function MainLayout() {
    const { orgId, appId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Global State
    const {
        user,
        orgs, activeOrg, setActiveOrg,
        apps, activeApp, setActiveApp,
        env, setEnv
    } = useGlobal();



    const [isAppOpen, setIsAppOpen] = useState(false);

    // 1. Sync URL -> State
    useEffect(() => {
        if (orgs.length > 0 && orgId) {
            const org = orgs.find(o => o._id === orgId || o.id === orgId); // Handle potential ID mismatch
            if (org && (!activeOrg || activeOrg._id !== org._id)) {
                setActiveOrg(org);
            }
        }
    }, [orgId, orgs, activeOrg, setActiveOrg]);

    useEffect(() => {
        if (apps.length > 0 && appId) {
            const app = apps.find(a => a.appId === appId);
            if (app && (!activeApp || activeApp.appId !== app.appId)) {
                setActiveApp(app);
            }
        }
    }, [appId, apps, activeApp, setActiveApp]);

    const handleAppSwitch = (app) => {
        setActiveApp(app);
        setIsAppOpen(false);
        navigate(`/org/${activeOrg._id}/app/${app.appId}/dashboard`);
    };

    const navItems = [
        { path: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: 'transactions', label: 'Transactions', icon: CreditCard },
        { path: 'webhooks', label: 'Webhooks', icon: Terminal },
        { path: 'developers', label: 'Developers', icon: Terminal },
        { path: 'settings', label: 'Settings', icon: Settings },
    ];

    const isTest = env === 'test';

    return (
        <div className="flex h-screen bg-[#0f1117] text-white font-inter overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-[#151722] flex flex-col z-30">
                {/* Header / Brand */}
                <div className="h-16 flex items-center px-4 border-b border-white/5 space-x-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg shadow-blue-500/20">Z</div>
                    <span className="font-bold tracking-tight">Znyck Pay</span>
                </div>


                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                                ${isActive
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-sm'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                                }
                            `}
                        >
                            <item.icon size={18} />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-white/5 bg-[#0f1117]/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border border-white/10 flex items-center justify-center text-xs font-bold">
                            {user?.email?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <button className="text-gray-500 hover:text-white"><LogOut size={16} /></button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col relative w-full">
                {/* Top Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#0f1117]/90 backdrop-blur-md sticky top-0 z-20">

                    {/* Breadcrumbs */}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="hover:text-gray-300 cursor-pointer text-xs uppercase tracking-wider font-semibold">{activeOrg?.name}</span>
                        <span>/</span>
                        <span className="hover:text-gray-300 cursor-pointer text-xs uppercase tracking-wider font-semibold">{activeApp?.name}</span>
                        <span>/</span>
                        <span className="text-white font-medium">{navItems.find(i => location.pathname.includes(i.path))?.label || 'Dashboard'}</span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center space-x-6">
                        {/* Search */}
                        {/* App Switcher (Moved from Sidebar) */}
                        <div className="relative">
                            <button
                                onClick={() => setIsAppOpen(!isAppOpen)}
                                className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                            >
                                <div className="w-5 h-5 rounded bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                    {activeApp?.name?.charAt(0) || 'A'}
                                </div>
                                <span className="font-medium">{activeApp?.name || 'Select App'}</span>
                                <ChevronDown size={14} className="text-gray-500" />
                            </button>

                            {/* Dropdown */}
                            {isAppOpen && (
                                <div className="absolute top-full right-0 w-64 mt-2 bg-[#1e2130] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="p-2 border-b border-white/5 bg-white/5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-2">Switch App</p>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto py-1">
                                        {apps.length > 0 ? apps.map(app => (
                                            <button
                                                key={app._id}
                                                onClick={() => handleAppSwitch(app)}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 flex items-center space-x-3 transition-colors ${activeApp?.appId === app.appId ? 'bg-blue-600/10 text-blue-400' : 'text-gray-300'}`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                                                <span className="truncate flex-1">{app.name}</span>
                                                {activeApp?.appId === app.appId && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                                            </button>
                                        )) : (
                                            <div className="px-3 py-2 text-xs text-gray-500">No apps found</div>
                                        )}
                                    </div>
                                    <div className="border-t border-white/5 p-2 bg-white/[0.02]">
                                        <button
                                            onClick={() => navigate(`/org/${activeOrg._id}/apps`)}
                                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
                                        >
                                            <Plus size={14} />
                                            <span>Create New App</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="h-4 w-px bg-white/10" />

                        {/* Env Switcher */}
                        <div className="flex items-center space-x-3 bg-white/5 p-1 rounded-lg border border-white/5">
                            <div className="flex bg-black/20 rounded-md p-0.5 relative">
                                <button
                                    onClick={() => setEnv('test')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${isTest ? 'bg-[#2a2d3a] text-orange-400 shadow-sm border border-orange-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <ShieldCheck size={12} />
                                    <span>Test</span>
                                </button>
                                <button
                                    onClick={() => setEnv('live')}
                                    className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${!isTest ? 'bg-[#2a2d3a] text-green-400 shadow-sm border border-green-500/20' : 'text-gray-500 hover:text-gray-300'}`}
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    <span>Live</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    {/* Environment Banner */}
                    {isTest && (
                        <div className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                            <div className="flex items-center space-x-3">
                                <div className="p-1.5 bg-orange-500/20 rounded-md text-orange-400">
                                    <ShieldCheck size={16} />
                                </div>
                                <p className="text-sm text-orange-200">
                                    <span className="font-bold text-orange-400">Test Mode Active:</span> Using test data & keys. No real money.
                                </p>
                            </div>
                        </div>
                    )}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
