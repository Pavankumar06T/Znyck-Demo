import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchApps, createApp } from '../../services/api'; // Ensure path is correct
import { Plus, AppWindow, Smartphone, Database, Globe, Search, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Icons based on app type
const TypeIcon = ({ type }) => {
    switch (type) {
        case 'mobile': return <Smartphone size={20} className="text-purple-400" />;
        case 'backend': return <Database size={20} className="text-green-400" />;
        case 'saas': return <AppWindow size={20} className="text-orange-400" />;
        default: return <Globe size={20} className="text-blue-400" />;
    }
};

const CreateAppModal = ({ isOpen, onClose, onCreated, orgId }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState('web');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createApp({ name, type, organizationId: orgId });
            onCreated();
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to create app');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1c1f2e] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Create New App</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-white">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">App Name</label>
                        <input
                            type="text"
                            className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="e.g. My Awesome Store"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Platform</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['web', 'mobile', 'backend', 'saas'].map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={`p-3 rounded-lg border flex items-center justify-center space-x-2 transition-all ${type === t
                                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <TypeIcon type={t} />
                                    <span className="capitalize text-sm">{t}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? 'Creating...' : 'Create App'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default function AppsList() {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Mock Org ID - In real app, get from context/URL
    // We need to fetch the org first or assume a default for this demo.
    // Based on seed, we can just fetch apps for the demo org if we knew the ID.
    // However, fetchApps requires an ID. 
    // TEMPORARY: I'll fetch the first org from an API call if possible, or use a hardcoded demo ID if I can find it.
    // Actually, let's just make the API fetch the user's orgs first? 
    // For this task, I'll update logic to fetch org automatically if needed or just use a placeholder if the backend supports "me". 
    // Backend doesn't support "me" context yet.
    // Strategy: I'll fetch /api/v1/orgs via a new service method or just assume the first one.

    const [orgId, setOrgId] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // HACK: Fetch orgs first to get ID
            // Ideally should be in context
            const orgsRes = await fetch('/api/v1/orgs').then(r => r.json()); // Simple fetch as it's not in api service yet? 
            // Wait, api service doesn't have fetchOrgs. Let's assume user has one.
            // I'll add fetchOrgs to api.js? No, I'll just use raw fetch or add it.
            // Let's add it to Api.js actually, safer.
            // But for now, to avoid context switching, I'll assume we pass it or get it.

            if (orgsRes && orgsRes.length > 0) {
                const oid = orgsRes[0]._id;
                setOrgId(oid);
                const data = await fetchApps(oid);
                setApps(data);
            }
        } catch (error) {
            console.error('Failed to load apps:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Since api.fetchApps is imported, but we need orgs first.
        // Let's use a quick inline fetch for orgs for now to unblock.
        // Better: Update api.js to fetch orgs.
        // I will assume I can update api.js in next step if needed, but for now allow this component to error or handle it?
        // Let's invoke a fetchOrgs helper function defined here for safety.

        async function init() {
            try {
                // Determine Org ID (Demo Mode)
                // In a real app, this is in Auth Context
                const userString = localStorage.getItem('user');
                let oid = null;
                // Try fetch
                const res = await fetch('http://localhost:5000/api/v1/orgs');
                const orgs = await res.json();
                if (orgs.length > 0) oid = orgs[0]._id;

                if (oid) {
                    setOrgId(oid);
                    const appsData = await fetchApps(oid);
                    setApps(appsData);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    const handleAppClick = (appId) => {
        navigate(`/org/${orgId}/apps/${appId}`);
    };

    return (
        <div className="min-h-screen bg-[#0f1117] text-white p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Applications</h1>
                        <p className="text-gray-500">Manage your integrated apps and services.</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                    >
                        <Plus size={18} />
                        <span>Create App</span>
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                        Loading Apps...
                    </div>
                ) : apps.length === 0 ? (
                    <div className="text-center py-20 border border-white/5 rounded-2xl bg-white/5">
                        <AppWindow size={48} className="mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-medium text-gray-300">No Apps Found</h3>
                        <p className="text-gray-500 mt-2 mb-6">Create your first app to get started with Znyck Pay.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Create New App
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {apps.map(app => (
                            <motion.div
                                key={app._id}
                                whileHover={{ y: -5 }}
                                onClick={() => handleAppClick(app.appId)}
                                className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6 cursor-pointer group hover:border-blue-500/30 transition-all relative overflow-hidden"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-white/5 rounded-lg text-gray-300 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                                        <TypeIcon type={app.type} />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${app.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-gray-500/10 border-gray-500/20 text-gray-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{app.name}</h3>
                                <p className="text-xs text-gray-500 font-mono mb-4">{app.appId}</p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                                    <span className="text-xs text-gray-500 capitalize">{app.type} Platform</span>
                                    <ArrowRight size={16} className="text-gray-600 group-hover:text-white transition-colors opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <CreateAppModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={loadData}
                orgId={orgId}
            />
        </div>
    );
}
