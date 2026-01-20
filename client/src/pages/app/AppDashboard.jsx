import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAppById } from '../../services/api';
import {
    LayoutDashboard, Key, CreditCard, Receipt, Database,
    Settings, Copy, Eye, EyeOff, Check, ArrowLeft, ShieldCheck
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
                        { name: 'Dashboard', icon: LayoutDashboard, active: true },
                        { name: 'Transactions', icon: CreditCard },
                        { name: 'API Keys', icon: Key },
                        { name: 'Webhooks', icon: Database },
                        { name: 'Taxes', icon: Receipt },
                        { name: 'Settings', icon: Settings },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.active
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
                    <h1 className="text-xl font-bold text-white">Dashboard</h1>
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

                <div className="p-8 max-w-5xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* API Keys Section (Visible for Verified concept) */}
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
                                <p className="text-xs text-blue-300 flex items-start gap-2">
                                    <div className="bg-blue-500 rounded-full w-1.5 h-1.5 mt-1 shrink-0" />
                                    <span>Requests using <strong>Test</strong> keys will not process real charges.</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Recent Activity / Integration Status */}
                        <div className="space-y-6">
                            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">Integration Steps</h3>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Create App', done: true },
                                        { title: 'Get API Keys', done: true },
                                        { title: 'Make First Payment', done: false, active: true },
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
                    </div>
                </div>
            </main>
        </div>
    );
}
