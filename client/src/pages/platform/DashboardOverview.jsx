import React, { useState, useEffect } from 'react';
import { Plus, ExternalLink, Activity, Wallet, ArrowRight, Loader2, Copy, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const AppCard = ({ app }) => {
    const navigate = useNavigate();
    const [showSecret, setShowSecret] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Optional: Add toast notification Logic here
    };

    return (
        <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${app.settings?.theme === 'digital' ? 'bg-purple-500/10 text-purple-400' :
                        app.settings?.theme === 'service' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-emerald-500/10 text-emerald-400'
                    }`}>
                    <Activity size={24} />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${app.environment === 'production' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
                    {app.environment}
                </span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1">{app.name}</h3>
            <p className="text-sm text-gray-500 mb-4 font-mono text-xs opacity-60">
                ID: {app._id}
            </p>

            {/* Keys Section */}
            <div className="space-y-3 mb-6 bg-black/20 p-3 rounded-lg border border-white/5">
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Public Key</label>
                    <div className="flex items-center space-x-2">
                        <code className="text-xs text-blue-300 font-mono truncate flex-1">{app.publicKey}</code>
                        <button onClick={() => copyToClipboard(app.publicKey)} className="text-gray-500 hover:text-white transition-colors" title="Copy Public Key"><Copy size={12} /></button>
                    </div>
                </div>
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Secret Key</label>
                    <div className="flex items-center space-x-2">
                        <code className="text-xs text-purple-300 font-mono truncate flex-1 block">
                            {showSecret ? app.secretKey : 'sk_••••••••••••••••••••••••'}
                        </code>
                        <button onClick={() => setShowSecret(!showSecret)} className="text-gray-500 hover:text-white transition-colors" title="Toggle Visibility">
                            {showSecret ? <EyeOff size={12} /> : <Eye size={12} />}
                        </button>
                        <button onClick={() => copyToClipboard(app.secretKey)} className="text-gray-500 hover:text-white transition-colors" title="Copy Secret Key"><Copy size={12} /></button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-auto">
                <button
                    onClick={() => window.open(`/apps/${app._id}`, '_blank')}
                    className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-lg transition-colors border border-white/5"
                >
                    <ExternalLink size={16} />
                    <span className="text-sm font-medium">Open App</span>
                </button>
                <Link
                    to={`/dashboard/transactions?appId=${app._id}`}
                    className="flex items-center justify-center space-x-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 py-2.5 rounded-lg transition-colors border border-blue-500/20"
                >
                    <Wallet size={16} />
                    <span className="text-sm font-medium">Transactions</span>
                </Link>
            </div>
        </div>
    );
};

export default function DashboardOverview() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const orgRes = await fetch('http://localhost:5000/api/v1/orgs');
                const orgs = await orgRes.json();
                if (orgs.length > 0) {
                    const appRes = await fetch(`http://localhost:5000/api/v1/apps?organizationId=${orgs[0]._id}`);
                    const appData = await appRes.json();
                    setApps(appData);
                }
            } catch (err) {
                console.error("Failed to fetch apps", err);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Admin</h1>
                <p className="text-gray-400">Here's what's happening with your applications today.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map(app => (
                        <AppCard key={app._id} app={app} />
                    ))}

                    {/* New App Placeholder */}
                    <button className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:border-white/30 transition-all min-h-[200px]">
                        <Plus size={32} className="mb-4 opacity-50" />
                        <span className="font-medium">Create New App</span>
                    </button>
                </div>
            )}
        </div>
    );
}
