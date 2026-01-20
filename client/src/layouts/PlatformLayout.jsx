import React, { useState, createContext, useContext, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Key, CreditCard, Settings,
    ShieldCheck, Bell, Search, ChevronDown, LogOut
} from 'lucide-react';

// Create Context for Global Environment State
export const PlatformContext = createContext();

export const usePlatform = () => useContext(PlatformContext);

export default function PlatformLayout() {
    const [env, setEnv] = useState('test'); // 'test' | 'live'
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);

    // Monitor scroll for header styling
    const handleScroll = (e) => {
        setScrolled(e.target.scrollTop > 20);
    };

    const navItems = [
        { path: '/user-space', label: 'Home', icon: LayoutDashboard },
        { path: '/user-space/payments', label: 'Payments', icon: CreditCard },
        { path: '/user-space/developers', label: 'Developers', icon: Key },
        { path: '/user-space/settings', label: 'Settings', icon: Settings },
    ];

    const isTest = env === 'test';

    return (
        <PlatformContext.Provider value={{ env, setEnv, isTest }}>
            <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden font-inter">

                {/* Sidebar */}
                <aside className="w-64 border-r border-white/5 bg-[#151722] flex flex-col z-20">
                    {/* Brand */}
                    <div className="h-16 flex items-center px-6 border-b border-white/5">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg mr-3 shadow-lg shadow-blue-500/20">Z</div>
                        <span className="font-bold text-lg tracking-tight">Znyck Pay</span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 espacio-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === '/user-space'} // Exact match for home root
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

                    {/* User Profile Footer */}
                    <div className="p-4 border-t border-white/5 bg-[#0f1117]/50">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 border border-white/10" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">Acme Corp</p>
                                <p className="text-xs text-gray-500 truncate">admin@acme.com</p>
                            </div>
                            <button className="text-gray-500 hover:text-white">
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative">

                    {/* Top Header */}
                    <header className={`h-16 flex items-center justify-between px-8 border-b border-white/5 transition-colors z-10 ${scrolled ? 'bg-[#0f1117]/90 backdrop-blur-md' : 'bg-transparent'
                        }`}>

                        {/* Left: Breadcrumbs or Context Title */}
                        <div className="flex items-center space-x-4">
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                                {navItems.find(i => i.path === location.pathname)?.label || 'Console'}
                            </h2>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center space-x-6">

                            {/* Search */}
                            <div className="relative group">
                                <Search size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                <Bell size={16} className="text-gray-500 hover:text-white cursor-pointer transition-colors" />
                                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#0f1117]" />
                            </div>

                            <div className="h-4 w-px bg-white/10" />

                            {/* Test Mode Toggle */}
                            <div className="flex items-center space-x-3 bg-white/5 p-1 rounded-lg border border-white/5">
                                <span className="text-[10px] font-bold text-gray-500 pl-2 uppercase tracking-wider">Mode</span>
                                <div className="flex bg-black/20 rounded-md p-0.5 relative">
                                    <button
                                        onClick={() => setEnv('test')}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${isTest ? 'bg-[#2a2d3a] text-orange-400 shadow-sm border border-orange-500/20' : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        <ShieldCheck size={12} />
                                        <span>Test</span>
                                    </button>
                                    <button
                                        onClick={() => setEnv('live')}
                                        className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center space-x-1.5 ${!isTest ? 'bg-[#2a2d3a] text-green-400 shadow-sm border border-green-500/20' : 'text-gray-500 hover:text-gray-300'
                                            }`}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        <span>Live</span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </header>

                    {/* Content Scroll Area */}
                    <main
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto p-8 relative"
                    >
                        {/* Environment Banner */}
                        {isTest && (
                            <div className="mb-6 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="p-1.5 bg-orange-500/20 rounded-md text-orange-400">
                                        <ShieldCheck size={16} />
                                    </div>
                                    <p className="text-sm text-orange-200">
                                        <span className="font-bold text-orange-400">Test Mode Active:</span> Using test data & keys. No real money will be processed.
                                    </p>
                                </div>
                            </div>
                        )}

                        <Outlet />
                    </main>
                </div>
            </div>
        </PlatformContext.Provider>
    );
}
