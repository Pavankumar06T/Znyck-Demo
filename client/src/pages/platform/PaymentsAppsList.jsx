import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Server, Globe, Smartphone, ArrowRight, MoreVertical } from 'lucide-react';
import { fetchApps, fetchTransactions } from '../../services/api';

const AppCard = ({ app, metrics, onClick }) => {
    const Icon = app.type === 'mobile' ? Smartphone : app.type === 'saas' ? Server : Globe;

    return (
        <div
            onClick={onClick}
            className="group bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-lg">{app.name}</h3>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span className="capitalize">{app.type}</span>
                            <span>•</span>
                            <span className="font-mono">{app.appId}</span>
                        </div>
                    </div>
                </div>
                <div className="p-2 hover:bg-white/5 rounded-lg text-gray-500 transition-colors z-10" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical size={16} />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-4">
                <div>
                    <p className="text-xs text-gray-500 mb-1">Total Revenue</p>
                    <p className="font-bold text-white">
                        {metrics ? `₹${(metrics.revenue / 100).toFixed(2)}` : '₹0.00'}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 mb-1">Transactions</p>
                    <p className="font-bold text-white">{metrics ? metrics.count : 0}</p>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-gray-400">Live</span>
                </div>
                <span className="text-blue-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-medium">
                    Manage <ArrowRight size={14} />
                </span>
            </div>

            {/* Hover Solution */}
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
    );
};

export default function PaymentsAppsList() {
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [orgId, setOrgId] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch orgs to get ID (Mock)
                const orgs = await fetch('http://localhost:5000/api/v1/orgs').then(r => r.json());
                if (orgs.length > 0) {
                    const fetchedOrgId = orgs[0]._id;
                    setOrgId(fetchedOrgId);
                    const appsData = await fetchApps(fetchedOrgId);
                    setApps(appsData);

                    // Fetch Transactions to calculate stats
                    const transactionsData = await fetchTransactions();

                    // Aggregate stats per App
                    const computedStats = {};

                    // Create a lookup for App ID by Name to handle re-seeded apps (where old transactions have old IDs but same Name)
                    const appIdByName = {};
                    appsData.forEach(app => {
                        appIdByName[app.name] = app._id;
                    });

                    transactionsData.forEach(tx => {
                        if (!tx.application) return;

                        let targetAppId = null;

                        // 1. Try to match by Name (Robust for Demo Re-seeding)
                        if (typeof tx.application === 'object' && tx.application.name) {
                            targetAppId = appIdByName[tx.application.name];
                        }

                        // 2. Fallback to direct ID match if name match failed or not populated
                        if (!targetAppId) {
                            const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                            // Only use if this ID actually exists in our current apps list
                            if (appsData.find(a => a._id === txAppId)) {
                                targetAppId = txAppId;
                            }
                        }

                        if (targetAppId) {
                            if (!computedStats[targetAppId]) {
                                computedStats[targetAppId] = { revenue: 0, count: 0 };
                            }
                            computedStats[targetAppId].revenue += tx.amount || 0;
                            computedStats[targetAppId].count += 1;
                        }
                    });
                    setStats(computedStats);
                }
            } catch (e) {
                console.error("Failed to load apps", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Payments & Apps</h1>
                    <p className="text-gray-400">Manage your applications and their payment configurations.</p>
                </div>
                <button
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    <span>Create New App</span>
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading your apps...</div>
            ) : apps.length === 0 ? (
                <div className="text-center py-20 bg-[#1c1f2e] border border-white/5 rounded-xl border-dashed">
                    <Server size={48} className="mx-auto text-gray-600 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No Apps Found</h3>
                    <p className="text-gray-500 mb-6">Create your first application to start accepting payments.</p>
                    <button className="text-blue-400 hover:text-blue-300 font-medium">Create App Now</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apps.map(app => (
                        <AppCard
                            key={app._id}
                            app={app}
                            metrics={stats[app._id]}
                            onClick={() => navigate(`/org/${orgId}/apps/${app.appId}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
