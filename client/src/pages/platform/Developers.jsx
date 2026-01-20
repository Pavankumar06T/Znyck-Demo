import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../layouts/PlatformLayout';
import { fetchApps } from '../../services/api';
import { Key, Copy, Check, Eye, EyeOff, Terminal, Webhook } from 'lucide-react';

const ConfigCard = ({ title, children }) => (
    <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">{title}</h3>
        {children}
    </div>
);

const KeyRow = ({ label, value }) => {
    const [hidden, setHidden] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
            <div className="w-1/3">
                <p className="text-sm font-medium text-gray-400">{label}</p>
            </div>
            <div className="flex-1 flex items-center space-x-3">
                <code className="bg-[#0f1117] px-3 py-1.5 rounded-lg text-sm font-mono text-gray-300 flex-1 border border-white/5">
                    {hidden ? value.replace(/[a-zA-Z0-9]/g, '•').slice(0, 24) + '......' : value}
                </code>
                <button onClick={() => setHidden(!hidden)} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5">
                    {hidden ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={handleCopy} className="text-gray-500 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/5">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};

export default function Developers() {
    const { env, isTest } = usePlatform();
    const [keys, setKeys] = useState({ publicKey: '...', secretKey: '...' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadKeys = async () => {
            setLoading(true);
            try {
                // Fetch the consolidated "Znyck Demo App"
                // Assuming first org for now (Context later)
                const orgs = await fetch('http://localhost:5000/api/v1/orgs').then(r => r.json());
                if (orgs.length > 0) {
                    const orgId = orgs[0]._id;
                    const apps = await fetchApps(orgId);
                    // Find our consolidated app
                    const mainApp = apps.find(a => a.name === 'Znyck Demo App') || apps[0];

                    if (mainApp && mainApp.apiKeys) {
                        setKeys(mainApp.apiKeys[env] || {});
                    }
                }
            } catch (error) {
                console.error("Failed to load keys", error);
            } finally {
                setLoading(false);
            }
        };
        loadKeys();
    }, [env]); // Refetch when environment toggles

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Developers</h1>
                <p className="text-gray-400">Manage your API keys and integration settings.</p>
            </div>

            <ConfigCard title="API Keys">
                <div className="space-y-2">
                    <KeyRow label="Publishable Key" value={keys.publicKey || 'Loading...'} />
                    <KeyRow label="Secret Key" value={keys.secretKey || 'Loading...'} />
                </div>
                <div className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${isTest ? 'bg-orange-500/10 text-orange-300 border border-orange-500/20' : 'bg-green-500/10 text-green-300 border border-green-500/20'
                    }`}>
                    <div className={`w-2 h-2 rounded-full ${isTest ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <span>Viewing <strong>{isTest ? 'Test' : 'Live'}</strong> API keys. Use these for {isTest ? 'testing' : 'production'} transactions.</span>
                </div>
            </ConfigCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ConfigCard title="Webhooks">
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <Webhook size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No webhooks configured.</p>
                        <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                            + Add Endpoint
                        </button>
                    </div>
                </ConfigCard>

                <ConfigCard title="Recent Logs">
                    <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500">
                        <Terminal size={32} className="mb-3 opacity-50" />
                        <p className="text-sm">No recent API activity.</p>
                        <button className="mt-4 text-blue-400 hover:text-blue-300 text-sm font-medium">
                            View Full Logs
                        </button>
                    </div>
                </ConfigCard>
            </div>
        </div>
    );
}
