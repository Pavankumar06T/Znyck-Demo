import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, Settings, LogOut, Code, ShoppingBag } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${active
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
            : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </Link>
);

export default function DashboardLayout() {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#0f1117] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Znyck Pay
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">Platform Console</p>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Overview"
                        to="/dashboard"
                        active={location.pathname === '/dashboard'}
                    />
                    {/* <SidebarItem
                        icon={Code}
                        label="Applications"
                        to="/dashboard/apps"
                        active={location.pathname.startsWith('/dashboard/apps')}
                    /> */}
                    {/* <SidebarItem
                        icon={Wallet}
                        label="Transactions"
                        to="/dashboard/transactions"
                        active={location.pathname.startsWith('/dashboard/transactions')}
                    /> */}
                    {/* Mock Store Link - For quick access */}
                    {/* <SidebarItem
                        icon={ShoppingBag}
                        label="Mock Store"
                        to="/mock-shop"
                        active={false}
                    /> */}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:text-red-300 transition-colors w-full">
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0f1117]/50 backdrop-blur sticky top-0 z-10">
                    <div className="text-sm breadcrumbs text-gray-400">
                        Organization: <span className="text-white font-medium">Acme Corp</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
