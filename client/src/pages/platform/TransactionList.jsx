import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RefreshCcw, XCircle, CheckCircle, Clock, Loader2 } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        succeeded: 'bg-green-500/20 text-green-400 border-green-500/30',
        paid: 'bg-green-500/20 text-green-400 border-green-500/30',
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        failed: 'bg-red-500/20 text-red-400 border-red-500/30',
        refunded: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    };

    const icons = {
        succeeded: CheckCircle,
        paid: CheckCircle,
        pending: Clock,
        failed: XCircle,
        refunded: RefreshCcw
    };

    const Icon = icons[status] || Clock;

    return (
        <span className={`flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.pending}`}>
            <Icon size={12} />
            <span>{status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}</span>
        </span>
    );
};

export default function TransactionList() {
    const [searchParams] = useSearchParams();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    const appIdFilter = searchParams.get('appId');

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            let url = 'http://localhost:5000/api/v1/transactions';
            if (appIdFilter) {
                url += `?appId=${appIdFilter}`;
            }

            const res = await fetch(url);
            const data = await res.json();
            setTransactions(data);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        const interval = setInterval(fetchTransactions, 5000);
        return () => clearInterval(interval);
    }, [appIdFilter]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Transactions</h2>
                    {appIdFilter && <p className="text-sm text-blue-400">Filtered by App: {appIdFilter.slice(-6)}</p>}
                </div>

                <div className="flex space-x-2">
                    <button onClick={fetchTransactions} className="bg-[#1c1f2e] text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-white/10 transition-all hover:bg-white/5 active:scale-95">
                        <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button className="bg-[#1c1f2e] text-gray-400 hover:text-white px-3 py-2 rounded-lg border border-white/10 flex items-center space-x-2">
                        <Filter size={18} />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            <div className="bg-[#1c1f2e] rounded-xl border border-white/5 overflow-hidden min-h-[400px]">
                {loading && transactions.length === 0 ? (
                    <div className="flex items-center justify-center h-40 text-gray-500">
                        <Loader2 className="animate-spin mr-2" /> Loading Transactions...
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-xs text-gray-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">App</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Gateway</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-500">No transactions found.</td></tr>
                            ) : (
                                transactions.map(txn => (
                                    <tr key={txn._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-sm text-blue-300">{txn._id.slice(-8)}...</div>
                                            <div className="text-xs text-gray-500">{txn.customer.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {txn.application?.name || 'Unknown App'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-white font-medium">
                                                {(txn.amount / 100).toFixed(2)} <span className="text-xs text-gray-500">{txn.currency}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={txn.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm text-gray-300 capitalize">{txn.gateway.provider}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(txn.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
