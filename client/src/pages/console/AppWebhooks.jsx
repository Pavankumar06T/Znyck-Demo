import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { Webhook, Plus, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const MockWebhooks = [
    { id: 'wh_123', url: 'https://api.myshop.com/webhooks/payment', events: ['payment.succeeded', 'payment.failed'], status: 'active', lastDelivery: '2 mins ago' },
    { id: 'wh_456', url: 'https://api.myshop.com/webhooks/refund', events: ['refund.created'], status: 'failed', lastDelivery: '1 hour ago' },
];

export default function AppWebhooks() {
    const { activeApp } = useGlobal();
    const [webhooks, setWebhooks] = useState(MockWebhooks);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Create
    const handleCreate = (e) => {
        e.preventDefault();
        const url = e.target.url.value;
        const newWebhook = {
            id: `wh_${Math.floor(Math.random() * 1000)}`,
            url,
            events: ['payment.succeeded'],
            status: 'active',
            lastDelivery: 'Never'
        };
        setWebhooks([...webhooks, newWebhook]);
        setIsModalOpen(false);
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Webhooks</h1>
                    <p className="text-gray-500 text-sm">Listen for events on your server.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-blue-500/20"
                >
                    <Plus size={18} />
                    <span>Add Endpoint</span>
                </button>
            </div>

            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#151722] border-b border-white/10">
                        <tr>
                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Endpoint URL</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Events</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                            <th className="text-left px-6 py-4 text-xs font-bold text-gray-400 uppercase">Last Delivery</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {webhooks.map((wh) => (
                            <tr key={wh.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-3">
                                        <Webhook size={16} className="text-gray-500" />
                                        <span className="font-mono text-sm text-gray-300">{wh.url}</span>
                                    </div>
                                    <div className="text-xs text-gray-600 ml-7 mt-1">{wh.id}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {wh.events.map(ev => (
                                            <span key={ev} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-mono">
                                                {ev}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className={`flex items-center space-x-1.5 text-xs font-medium uppercase ${wh.status === 'active' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        {wh.status === 'active' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                        <span>{wh.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400 flex items-center gap-2">
                                    <Clock size={14} />
                                    {wh.lastDelivery}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#1c1f2e] border border-white/10 rounded-xl w-full max-w-lg p-6 shadow-2xl"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Add Webhook Endpoint</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Endpoint URL</label>
                                <input
                                    name="url"
                                    type="url"
                                    className="w-full bg-[#0f1117] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                    placeholder="https://api.yoursite.com/webhooks"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Events to listen for</label>
                                <div className="p-3 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-gray-500">
                                    All events (payment.*, refund.*)
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors">Add Endpoint</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
