import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchTransactions } from '../../services/api';
import {
    CreditCard, TrendingUp, Users, Check
} from 'lucide-react';

export default function AppDashboard() {
    const { activeApp } = useGlobal();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0, successRate: 0, customers: 0 });

    useEffect(() => {
        const loadTransactions = async () => {
            if (!activeApp) return;
            try {
                const allTransactions = await fetchTransactions();

                // Filter transactions for this app (by _id or appId)
                const appTransactions = allTransactions.filter(tx => {
                    if (!tx.application) return false;
                    const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                    return txAppId === activeApp._id || txAppId === activeApp.appId;
                });

                setTransactions(appTransactions);

                // Calculate stats
                const revenue = appTransactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);
                const count = appTransactions.length;
                const successCount = appTransactions.filter(tx => tx.status === 'succeeded').length;
                const successRate = count > 0 ? (successCount / count) * 100 : 0;
                const uniqueCustomers = new Set(appTransactions.map(tx => tx.customer?.email).filter(Boolean)).size;

                setStats({ revenue, count, successRate, customers: uniqueCustomers });
            } catch (error) {
                console.error("Failed to load transactions", error);
            }
        };
        loadTransactions();
    }, [activeApp]);

    if (!activeApp) return <div className="p-8 text-gray-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Overview</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Total Revenue</span>
                        <TrendingUp size={18} className="text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">₹{(stats.revenue / 100).toFixed(2)}</div>
                </div>
                <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Transactions</span>
                        <CreditCard size={18} className="text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.count}</div>
                </div>
                <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Success Rate</span>
                        <Check size={18} className="text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.successRate.toFixed(0)}%</div>
                </div>
                <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">Customers</span>
                        <Users size={18} className="text-orange-500" />
                    </div>
                    <div className="text-2xl font-bold text-white">{stats.customers}</div>
                </div>
            </div>

            {/* Integration Steps */}
            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Integration Steps</h3>
                <div className="space-y-4">
                    {[
                        { title: 'Create App', done: true },
                        { title: 'Get API Keys', done: true },
                        { title: 'Make First Payment', done: transactions.length > 0, active: transactions.length === 0 },
                        { title: 'Go Live', done: false }
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step.done ? 'bg-green-500 text-white' :
                                step.active ? 'bg-blue-500 text-white animate-pulse' : 'bg-white/10 text-gray-500'
                                }`}>
                                {step.done ? <Check size={14} /> : i + 1}
                            </div>
                            <span className={step.active ? 'text-white font-medium' : 'text-gray-500'}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
