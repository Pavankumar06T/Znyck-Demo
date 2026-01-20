import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchTransactions } from '../services/api';
import {
    RefreshCw, Filter, TrendingUp, TrendingDown,
    DollarSign, CreditCard, Users, Activity,
    Download, Calendar
} from 'lucide-react';

const MetricCard = ({ title, value, change, trend, icon: Icon }) => (
    <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all">
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400">
                <Icon size={24} />
            </div>
            {trend && (
                <div className={`flex items-center space-x-1 text-sm font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{change}</span>
                </div>
            )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>

        {/* Background Decoration */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />
    </div>
);

export default function UserSpace() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadTransactions = async () => {
        console.log('UserSpace: loadTransactions called');
        setLoading(true);
        try {
            const data = await fetchTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    // Calculate Metrics (Mock/Derived)
    const totalVolume = transactions.reduce((acc, tx) => acc + (tx.amount / 100), 0);
    const successCount = transactions.filter(tx => tx.status === 'succeeded').length;

    return (
        <div className="max-w-[1600px] mx-auto space-y-8">

            {/* Content Area */}

            {/* Header Section */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Today</h1>
                    <p className="text-gray-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Live Platform Data
                    </p>
                </div>
                <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">
                        <Calendar size={16} />
                        <span>Last 7 Days</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20">
                        <Download size={16} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Gross Volume"
                    value={`₹${totalVolume.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    change="+12.5%"
                    trend="up"
                    icon={DollarSign}
                />
                <MetricCard
                    title="Net Revenue"
                    value={`₹${(totalVolume * 0.95).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                    change="+8.2%"
                    trend="up"
                    icon={Activity}
                />
                <MetricCard
                    title="New Customers"
                    value={transactions.length}
                    change="+2"
                    trend="up"
                    icon={Users}
                />
                <MetricCard
                    title="Successful Payments"
                    value={successCount}
                    change="-2.1%"
                    trend="down"
                    icon={CreditCard}
                />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Transactions Section (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1c1f2e] border border-white/10 rounded-xl overflow-hidden min-h-[500px]">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <h3 className="font-bold text-lg">Recent Transactions</h3>
                            <div className="flex space-x-2">
                                <button onClick={loadTransactions} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                    <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                                    <Filter size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="text-gray-500 text-xs uppercase font-semibold">
                                    <tr className="border-b border-white/5">
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loading ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">Loading live data...</td></tr>
                                    ) : transactions.length === 0 ? (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No transactions recorded yet.</td></tr>
                                    ) : (
                                        transactions.slice(0, 8).map((tx) => (
                                            <tr key={tx._id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-2 h-2 rounded-full ${tx.status === 'succeeded' ? 'bg-green-500' :
                                                            tx.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`} />
                                                        <span className="text-sm font-medium text-white capitalize">{tx.status}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 ml-5 font-mono mt-1">{tx._id.slice(-8)}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-white">
                                                        {tx.currency} {(tx.amount / 100).toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 capitalize">{tx.gateway?.provider}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-300">{tx.customer?.email || 'guest@user.com'}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(tx.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {transactions.length > 8 && (
                            <div className="p-4 border-t border-white/5 text-center">
                                <button className="text-sm text-blue-400 hover:text-blue-300 font-medium pb-1 border-b border-dashed border-blue-400/50">
                                    View All Transactions
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Activity Feed (1/3 width) */}
                <div className="space-y-6">
                    <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6 h-full">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                            <Users size={20} className="text-blue-500" />
                            Your Profile
                        </h3>

                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3 ring-4 ring-[#0f1117] shadow-xl">
                                SM
                            </div>
                            <h4 className="text-xl font-bold text-white">Smith Doe</h4>
                            <p className="text-sm text-gray-500">smith@example.com</p>
                            <div className="mt-2 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full font-medium border border-blue-500/20">
                                Global Admin
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-white/5 pt-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Organization</label>
                                <div className="text-gray-300 font-medium mt-1">Acme Corp (Demo)</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Location</label>
                                <div className="text-gray-300 font-medium mt-1">California, USA</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Member Since</label>
                                <div className="text-gray-300 font-medium mt-1">Jan 2026</div>
                            </div>
                        </div>

                        <button className="w-full mt-8 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors text-sm font-medium">
                            Edit Profile
                        </button>
                    </div>

                    {/* Promo / Upsell / Status */}
                    <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                        <h4 className="font-bold text-white mb-2">Setup Guide</h4>
                        <p className="text-sm text-gray-400 mb-4">Complete your account setup to enable international payments.</p>
                        <div className="w-full bg-white/5 rounded-full h-2 mb-4">
                            <div className="bg-blue-500 h-2 rounded-full w-3/4" />
                        </div>
                        <span className="text-xs text-blue-400 font-medium">75% Complete</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Temporary Mock Data Generation for the Activity Feed (Or keep it static as shown)
