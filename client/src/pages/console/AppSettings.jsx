import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function AppSettings() {
    const { activeApp } = useGlobal();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
            <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none max-w-2xl">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">General Settings</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">App Name</label>
                        <input
                            type="text"
                            disabled
                            value={activeApp?.name || ''}
                            className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-500 dark:text-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-500 dark:text-gray-400 mb-1">App ID</label>
                        <input
                            type="text"
                            disabled
                            value={activeApp?.appId || ''}
                            className="w-full bg-slate-50 dark:bg-[#0f1117] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-slate-500 dark:text-gray-500 font-mono text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
