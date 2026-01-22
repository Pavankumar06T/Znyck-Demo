import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Copy, Check, Eye, EyeOff, Loader2, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';

const AppCard = ({ app }) => {
    const navigate = useNavigate();
    const [showSecret, setShowSecret] = useState(false);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${app.environment === 'production' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {app.environment}
                    </span>
                </div>
                <div className="text-xs text-gray-500 font-mono">{app._id}</div>
            </div>

            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Public Key</label>
                    <div className="flex items-center space-x-2 bg-black/30 p-2 rounded border border-white/5 group hover:border-white/10">
                        <code className="text-xs text-blue-300 font-mono truncate flex-1">{app.publicKey}</code>
                        <button onClick={() => copyToClipboard(app.publicKey)} className="text-gray-500 hover:text-white">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-xs text-gray-500">Secret Key</label>
                    <div className="flex items-center space-x-2 bg-black/30 p-2 rounded border border-white/5 group hover:border-white/10">
                        <code className="text-xs text-purple-300 font-mono truncate flex-1 block">
                            {showSecret ? app.secretKey : 'sk_••••••••••••••••••••••••'}
                        </code>
                        <button onClick={() => setShowSecret(!showSecret)} className="text-gray-500 hover:text-white mr-1">
                            {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                        <button onClick={() => copyToClipboard(app.secretKey)} className="text-gray-500 hover:text-white">
                            <Copy size={14} />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function AppList() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newAppName, setNewAppName] = useState('');
    const [newAppType, setNewAppType] = useState('web');
    const [newAppDesc, setNewAppDesc] = useState('');
    const [orgId, setOrgId] = useState(null);

    const navigate = useNavigate();

    const fetchApps = async () => {
        try {
            // 1. Get Org ID (auto-select first for demo)
            const orgRes = await fetch('http://localhost:5000/api/v1/orgs');
            const orgs = await orgRes.json();

            if (orgs.length > 0) {
                const oid = orgs[0]._id;
                setOrgId(oid);

                // 2. Get Apps
                const appRes = await fetch(`http://localhost:5000/api/v1/apps?organizationId=${oid}`);
                const appData = await appRes.json();
                setApps(appData);
            }
        } catch (err) {
            console.error("Failed to fetch apps", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!orgId) return;

        try {
            const res = await fetch('http://localhost:5000/api/v1/apps', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newAppName,
                    organizationId: orgId,
                    environment: 'test',
                    type: newAppType,
                    description: newAppDesc
                })
            });
            const newApp = await res.json();
            setApps([newApp, ...apps]);
            setIsModalOpen(false);
            setNewAppName('');
            setNewAppDesc('');
            setNewAppType('web');
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-center p-10 text-gray-500"><Loader2 className="animate-spin inline mr-2" /> Loading Apps...</div>;

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white">Applications</h2>
                    <p className="text-gray-400">Manage your API keys and integration settings.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all"
                >
                    <Plus size={18} />
                    <span>New Application</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apps.length === 0 ? (
                    <div className="col-span-3 text-center py-10 text-gray-500">No applications found. Create one to get started.</div>
                ) : (
                    apps.map(app => (
                        <div
                            key={app._id}
                            onClick={() => navigate(`/org/${orgId}/apps/${app._id}`)}
                            className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-lg text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                    <ListOrdered size={20} />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full uppercase font-bold tracking-wider ${app.environment === 'production' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                                    }`}>
                                    {app.environment}
                                </span>
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{app.name}</h3>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">
                                {app.description || 'No description provided.'}
                            </p>

                            <div className="flex items-center space-x-3 text-xs text-gray-500 font-mono pt-4 border-t border-white/5">
                                <span className="bg-white/5 px-2 py-1 rounded text-gray-400">{app.type}</span>
                                <span>{new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-[#1c1f2e] p-6 rounded-xl border border-white/10 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Application</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">App Name</label>
                                <input
                                    type="text"
                                    value={newAppName}
                                    onChange={e => setNewAppName(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                    placeholder="e.g. My SaaS Product"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">App Type</label>
                                <select
                                    value={newAppType}
                                    onChange={e => setNewAppType(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500"
                                >
                                    <option value="web">Web Application</option>
                                    <option value="mobile">Mobile App (iOS/Android)</option>
                                    <option value="backend">Backend Service</option>
                                    <option value="saas">SaaS Platform</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={newAppDesc}
                                    onChange={e => setNewAppDesc(e.target.value)}
                                    className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-blue-500 h-20 resize-none"
                                    placeholder="Short description of your app..."
                                />
                            </div>
                            <div className="flex space-x-3 justify-end pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-400 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newAppName}
                                    className="bg-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-blue-500"
                                >
                                    Create App
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
