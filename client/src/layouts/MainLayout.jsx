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

    const [isOrgOpen, setIsOrgOpen] = useState(false);
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

    // 2. Handle Switchers
    const handleOrgSwitch = (org) => {
        setActiveOrg(org);
        setIsOrgOpen(false);
        // Redirect to first app of new org or create
        // For now, just go to org root and let it resolve? 
        // Better: Go to /org/:id/apps (if we have such a route) or default flow
        // The user wants /org/:orgId/app/:appId... 
        // We'll navigate to org root for now, or pick first app if available (async issue though)
        // Let's simplified: Navigate to /user-space (legacy) or a hub?
        // Let's try to find an app for this org or go to Create App
        // Simple: Reload to org context
        // But we don't know apps yet. 
        // Just navigate to /org/:orgId/apps which is the "App List"
        navigate(`/org/${org._id}/apps`);
    };

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

                {/* Org & App Switchers (In Sidebar Top) */}
                <div className="p-4 space-y-3 border-b border-white/5 bg-[#0f1117]/30">
                    {/* Org Switcher */}
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Organization</label>
                        <button
                            onClick={() => setIsOrgOpen(!isOrgOpen)}
                            className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm border border-white/5 transition-colors"
                        >
                            <div className="flex items-center space-x-2 truncate">
                                <Building2 size={14} className="text-gray-400" />
                                <span className="truncate">{activeOrg?.name || 'Select Org'}</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>

                        {/* Dropdown */}
                        {isOrgOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[#1e2130] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                {orgs.map(org => (
                                    <button
                                        key={org._id}
                                        onClick={() => handleOrgSwitch(org)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 text-gray-300 hover:text-white flex items-center space-x-2"
                                    >
                                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                        <span>{org.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* App Switcher */}
                    <div className="relative">
                        <label className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mb-1 block">Active App</label>
                        <button
                            onClick={() => setIsAppOpen(!isAppOpen)}
                            className={`w-full flex items-center justify-between p-2 rounded-lg text-sm border transition-colors ${activeApp
                                ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 hover:bg-blue-600/20'
                                : 'bg-white/5 border-white/5 text-gray-400'}`}
                        >
                            <div className="flex items-center space-x-2 truncate">
                                <AppWindow size={14} className={activeApp ? "text-blue-400" : "text-gray-500"} />
                                <span className="truncate">{activeApp?.name || 'Select App'}</span>
                            </div>
                            <ChevronDown size={14} className="text-gray-500" />
                        </button>

                        {/* Dropdown */}
                        {isAppOpen && (
                            <div className="absolute top-full left-0 w-full mt-1 bg-[#1e2130] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden">
                                {apps.length > 0 ? apps.map(app => (
                                    <button
                                        key={app._id}
                                        onClick={() => handleAppSwitch(app)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 text-gray-300 hover:text-white flex items-center space-x-2"
                                    >
                                        <div className={`w-2 h-2 rounded-full ${app.status === 'active' ? 'bg-emerald-500' : 'bg-gray-500'}`}></div>
                                        <span>{app.name}</span>
                                    </button>
                                )) : (
                                    <div className="px-3 py-2 text-xs text-gray-500">No apps found</div>
                                )}
                                <div className="border-t border-white/5 p-1">
                                    <button
                                        onClick={() => navigate(`/org/${activeOrg._id}/apps`)}
                                        className="w-full flex items-center space-x-2 px-2 py-1.5 text-xs text-blue-400 hover:bg-white/5 rounded"
                                    >
                                        <Plus size={12} />
                                        <span>Create New App</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                        <Search size={16} className="text-gray-500 hover:text-white transition-colors cursor-pointer" />

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
