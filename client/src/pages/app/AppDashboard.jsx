import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAppById, fetchTransactions } from '../../services/api';
import {
    LayoutDashboard, Key, CreditCard, Receipt, Database,
    Settings, Copy, Eye, EyeOff, Check, ArrowLeft, ShieldCheck, TrendingUp, Users
} from 'lucide-react';
import { motion } from 'framer-motion';

const ApiKeyDisplay = ({ label, value }) => {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#0f1117] p-4 rounded-lg border border-white/5 mb-3">
            <div className="text-xs text-gray-500 uppercase font-bold mb-2 flex justify-between">
                <span>{label}</span>
                {copied && <span className="text-green-400">Copied!</span>}
            </div>
            <div className="flex items-center space-x-3">
                <code className="flex-1 font-mono text-sm text-gray-300 truncate">
                    {show ? value : value.replace(/./g, '•').slice(0, 24) + '...'}
                </code>
                <button onClick={() => setShow(!show)} className="text-gray-500 hover:text-white transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};

export default function AppDashboard() {
    const { orgId, appId } = useParams();
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [env, setEnv] = useState('test'); // 'test' or 'live'
    const [activeTab, setActiveTab] = useState('overview');
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0, successRate: 0, customers: 0 });

    useEffect(() => {
        const loadApp = async () => {
            try {
                const data = await fetchAppById(appId);
                setApp(data);
            } catch (error) {
                console.error("Failed to load app", error);
            } finally {
                setLoading(false);
            }
        };
        loadApp();
    }, [appId]);

    useEffect(() => {
        const loadTransactions = async () => {
            if (!app) return;
            try {
                const allTransactions = await fetchTransactions();

                // Filter transactions for this app (by _id or appId)
                const appTransactions = allTransactions.filter(tx => {
                    if (!tx.application) return false;
                    const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                    return txAppId === app._id || txAppId === app.appId;
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
    }, [app]);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading App Context...</div>;
    if (!app) return <div className="p-10 text-center text-red-500">App not found</div>;

    const keys = app.apiKeys?.[env] || {};

    return (
        <div className="min-h-screen bg-[#0f1117] flex">

            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-white/10 bg-[#151722] flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <Link to={`/org/${orgId}/apps`} className="flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
                        <ArrowLeft size={16} className="mr-1" /> Back to Apps
                    </Link>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                            {app.name.charAt(0)}
                        </div>
                        <h2 className="font-bold text-white truncate">{app.name}</h2>
                    </div>
                    <p className="text-xs text-gray-500 font-mono ml-11">{app.appId}</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {[
                        { name: 'Overview', icon: LayoutDashboard, id: 'overview' },
                        { name: 'Transactions', icon: CreditCard, id: 'transactions' },
                        { name: 'API Keys', icon: Key, id: 'api-keys' },
                        { name: 'Webhooks', icon: Database, id: 'webhooks' },
                        { name: 'Taxes', icon: Receipt, id: 'taxes' },
                        { name: 'Settings', icon: Settings, id: 'settings' },
                    ].map((item) => (
                        <button
                            key={item.name}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <item.icon size={18} />
                            <span>{item.name}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center space-x-2 bg-[#0f1117] p-1 rounded-lg border border-white/10">
                        <button
                            onClick={() => setEnv('test')}
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${env === 'test' ? 'bg-orange-500/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            TES T
                        </button>
                        <button
                            onClick={() => setEnv('live')}
                            className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${env === 'live' ? 'bg-green-500/20 text-green-400' : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            LIVE
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10">
                    <h1 className="text-xl font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
                    <div className="flex items-center space-x-2">
                        {env === 'test' ? (
                            <div className="flex items-center space-x-2 text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-500/20">
                                <ShieldCheck size={14} />
                                <span>Test Data</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-500/20">
                                <ShieldCheck size={14} />
                                <span>Live Data</span>
                            </div>
                        )}
                    </div>
                </header>

                <div className="p-8">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
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
                            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
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
                    )}

                    {/* Transactions Tab */}
                    {activeTab === 'transactions' && (
                        <div className="bg-[#1c1f2e] border border-white/10 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#151722] border-b border-white/10">
                                        <tr>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Transaction ID</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Customer</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                                    No transactions yet. Make your first payment to see it here.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx, i) => (
                                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                                    <td className="px-6 py-4 font-mono text-sm text-gray-300">
                                                        {tx.gateway?.transactionId?.slice(-8) || tx._id.slice(-8)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-white">{tx.customer?.name || 'Guest'}</div>
                                                        <div className="text-xs text-gray-500">{tx.customer?.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-semibold text-white">
                                                        {tx.currency === 'USD' ? '$' : '₹'}{(tx.amount / 100).toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'succeeded' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                                            }`}>
                                                            {tx.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-400">
                                                        {new Date(tx.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* API Keys Tab */}
                    {activeTab === 'api-keys' && (
                        <div className="max-w-2xl">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6"
                            >
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Key size={20} className="text-blue-500" />
                                    <span>API Credentials</span>
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Use these keys to authenticate requests for the <strong className="uppercase text-white">{env}</strong> environment.
                                </p>

                                <ApiKeyDisplay label="Public Key" value={keys.publicKey || '...'} />
                                <ApiKeyDisplay label="Secret Key" value={keys.secretKey || '...'} />

                                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <div className="text-xs text-blue-300 flex items-start gap-2">
                                        <div className="bg-blue-500 rounded-full w-1.5 h-1.5 mt-1 shrink-0" />
                                        <span>Requests using <strong>Test</strong> keys will not process real charges.</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Placeholder for other tabs */}
                    {!['overview', 'transactions', 'api-keys'].includes(activeTab) && (
                        <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-12 text-center">
                            <h3 className="text-lg font-bold text-white mb-2 capitalize">{activeTab.replace('-', ' ')}</h3>
                            <p className="text-gray-500">This feature is coming soon.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
