import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchTransactions } from '../../services/api';
import { Search, Filter, Download } from 'lucide-react';

export default function AppPayments() {
    const { activeApp } = useGlobal();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTransactions = async () => {
            if (!activeApp) return;
            try {
                // TODO: Update backend to support filtering by appId natively
                const allTransactions = await fetchTransactions();

                // Client-side filtering
                const appTransactions = allTransactions.filter(tx => {
                    if (!tx.application) return false;
                    const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                    return txAppId === activeApp._id || txAppId === activeApp.appId;
                });

                setTransactions(appTransactions);
            } catch (error) {
                console.error("Failed to load transactions", error);
            } finally {
                setLoading(false);
            }
        };
        loadTransactions();
    }, [activeApp]);

    if (loading) return <div className="p-8 text-gray-500">Loading payments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Payments</h1>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

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
                                        No payments found for {activeApp?.name}.
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
        </div>
    );
}
