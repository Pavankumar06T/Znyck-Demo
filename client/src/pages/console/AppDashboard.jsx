import React, { useEffect, useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { fetchTransactions } from '../../services/api';
import {
    CreditCard, TrendingUp, Users, Check, ShieldCheck, ChevronRight
} from 'lucide-react';
import OnboardingModal from '../../components/OnboardingModal';

export default function AppDashboard() {
    const { activeApp } = useGlobal();
    const [transactions, setTransactions] = useState([]);
    const [stats, setStats] = useState({ revenue: 0, count: 0, successRate: 0, customers: 0 });

    // Profile Completion State
    const [profileCompletion, setProfileCompletion] = useState(20);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

    // Check if profile was previously completed
    useEffect(() => {
        const isCompleted = localStorage.getItem('profile_completed');
        if (isCompleted) setProfileCompletion(100);
    }, []);

    const handleOnboardingComplete = () => {
        setProfileCompletion(100);
        localStorage.setItem('profile_completed', 'true');
    };

    useEffect(() => {
        const loadTransactions = async () => {
            if (!activeApp) return;
            try {
                const allTransactions = await fetchTransactions();

                // Filter transactions for this app (by _id or appId)
                const appTransactions = allTransactions.filter(tx => {
                    if (!tx.application) return false;
                    const txAppId = typeof tx.application === 'object' ? tx.application._id : tx.application;
                    return txAppId === activeApp._id || txAppId === activeApp.appId;
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
    }, [activeApp]);

    if (!activeApp) return <div className="p-8 text-slate-500">Loading Dashboard...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Overview</h1>

            {/* Profile Completion Widget - Only show if incomplete */}
            {profileCompletion < 100 && (
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-1 shadow-lg shadow-blue-500/20">
                    <div className="bg-white dark:bg-[#1c1f2e] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                        <div className="flex-1 relative z-10">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wide flex items-center gap-1">
                                    <ShieldCheck size={12} />
                                    Action Required
                                </span>
                                <span className="text-sm text-slate-500 dark:text-gray-400 font-medium">Step 1 of 3 Completed</span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Complete your Account Setup</h2>
                            <p className="text-slate-500 dark:text-gray-400 text-sm max-w-lg">
                                Your profile is <strong>{profileCompletion}% complete</strong>. Finish the onboarding process to activate live payments and settlements.
                            </p>
                        </div>

                        <div className="flex items-center gap-6 relative z-10 w-full md:w-auto">
                            {/* Circular Progress */}
                            <div className="hidden md:flex items-center justify-center relative w-16 h-16">
                                <svg className="transform -rotate-90 w-16 h-16">
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-200 dark:text-white/10" />
                                    <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - profileCompletion / 100)} className="text-blue-600 dark:text-blue-500 transition-all duration-1000 ease-out" />
                                </svg>
                                <span className="absolute text-xs font-bold text-slate-900 dark:text-white">{profileCompletion}%</span>
                            </div>

                            <button
                                onClick={() => setIsOnboardingOpen(true)}
                                className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2"
                            >
                                <span>Complete Profile</span>
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Banner - Show when complete */}
            {profileCompletion === 100 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white shadow-sm">
                        <Check size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">Profile Verified</h4>
                        <p className="text-xs text-slate-500 dark:text-gray-400">Your account is active and ready for live transactions.</p>
                    </div>
                </div>
            )}

            <OnboardingModal
                isOpen={isOnboardingOpen}
                onClose={() => setIsOnboardingOpen(false)}
                onComplete={handleOnboardingComplete}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Total Revenue</span>
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <TrendingUp size={18} className="text-green-600 dark:text-green-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">₹{(stats.revenue / 100).toFixed(2)}</div>
                </div>
                <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Transactions</span>
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <CreditCard size={18} className="text-blue-600 dark:text-blue-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.count}</div>
                </div>
                <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Success Rate</span>
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Check size={18} className="text-purple-600 dark:text-purple-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.successRate.toFixed(0)}%</div>
                </div>
                <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-slate-500 dark:text-gray-400">Customers</span>
                        <div className="p-2 bg-orange-500/10 rounded-lg">
                            <Users size={18} className="text-orange-600 dark:text-orange-500" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.customers}</div>
                </div>
            </div>

            {/* Integration Steps */}
            <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none max-w-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Check size={100} className="text-slate-900 dark:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Integration Progress</h3>
                <div className="space-y-6 relative z-10">
                    {[
                        { title: 'Create App', done: true },
                        { title: 'Get API Keys', done: true },
                        { title: 'Make First Payment', done: transactions.length > 0, active: transactions.length === 0 },
                        { title: 'Go Live', done: false }
                    ].map((step, i, arr) => (
                        <div key={i} className="flex items-start gap-4 relative">
                            {/* Connecting Line */}
                            {i !== arr.length - 1 && (
                                <div className={`absolute left-[11px] top-7 bottom-[-24px] w-0.5 ${step.done ? 'bg-green-500' : 'bg-slate-200 dark:bg-white/10'}`}></div>
                            )}
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${step.done ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' :
                                step.active ? 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/20' : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-gray-500'
                                }`}>
                                {step.done ? <Check size={14} /> : i + 1}
                            </div>
                            <div className="flex-1 -mt-0.5">
                                <span className={`text-base font-semibold block ${step.active || step.done ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-gray-500'}`}>
                                    {step.title}
                                </span>
                                {step.active && <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Complete this step to activate your account fully.</p>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
