import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchTransactions } from '../../services/api';
import {
    ArrowUpRight, ArrowDownLeft, Filter, Download,
    CheckCircle, XCircle, Clock, CreditCard, Calendar
} from 'lucide-react';

export default function AppTransactions() {
    const { activeApp } = useGlobal();
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const loadTransactions = async () => {
            if (!activeApp) return;
            try {
                const allTransactions = await fetchTransactions();
                // Filter transactions for this app
                const appTransactions = allTransactions.filter(tx => {
                    if (!tx.application) return false;
                    const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                    return txAppId === activeApp._id || txAppId === activeApp.appId;
                });
                setTransactions(appTransactions);
            } catch (error) {
                console.error("Failed to load transactions", error);
            }
        };
        loadTransactions();
    }, [activeApp]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-600 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm">
                        <Download size={16} />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 dark:bg-[#151722] border-b border-slate-200 dark:border-white/10">
                            <tr>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Transaction ID</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Type</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Customer</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Amount</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Status</th>
                                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 dark:text-gray-400 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500 dark:text-gray-500">
                                        No transactions found for {activeApp?.name}.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx, i) => (
                                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-mono text-sm text-slate-600 dark:text-gray-300">
                                            {tx.gateway?.transactionId?.slice(-8) || tx._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`p-1 rounded-md ${tx.type === 'subscription' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400' : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>
                                                    {tx.type === 'subscription' ? <Clock size={14} /> : <ArrowUpRight size={14} />}
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-gray-300 capitalize">
                                                    {tx.type || 'One-time'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-900 dark:text-white">{tx.customer?.name || 'Guest'}</div>
                                            <div className="text-xs text-slate-500 dark:text-gray-500">{tx.customer?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                            {tx.currency === 'USD' ? '$' : '₹'}{(tx.amount / 100).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.status === 'succeeded' ? 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400' :
                                                tx.status === 'failed' ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500 dark:text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                            <div className="text-xs text-slate-400 dark:text-gray-600">{new Date(tx.createdAt).toLocaleTimeString()}</div>
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
