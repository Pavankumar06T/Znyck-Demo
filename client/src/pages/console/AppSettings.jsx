import React from 'react';
import { useGlobal } from '../../context/GlobalContext';

export default function AppSettings() {
    const { activeApp } = useGlobal();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <div className="bg-[#1c1f2e] border border-white/10 rounded-xl p-6 max-w-2xl">
                <h3 className="text-lg font-bold text-white mb-4">General Settings</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">App Name</label>
                        <input
                            type="text"
                            disabled
                            value={activeApp?.name || ''}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-2 text-gray-300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1">App ID</label>
                        <input
                            type="text"
                            disabled
                            value={activeApp?.appId || ''}
                            className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-2 text-gray-500 font-mono text-sm"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
