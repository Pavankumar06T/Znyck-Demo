import React, { useState, useEffect } from 'react';
import { usePlatform } from '../../layouts/PlatformLayout';
import { useApp } from '../../layouts/AppLayout';
import { Copy, Check, Eye, EyeOff, Info } from 'lucide-react';

const KeyCard = ({ label, value, description }) => {
    const [hidden, setHidden] = useState(true);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 mb-4">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-white font-bold mb-1">{label}</h3>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center space-x-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
            </div>

            <div className="relative group">
                <code className="block w-full bg-[#0f1117] border border-white/10 rounded-lg p-4 font-mono text-sm text-gray-300 break-all">
                    {hidden ? value.replace(/[a-zA-Z0-9]/g, '•').slice(0, 32) + '...' : value}
                </code>
                <button
                    onClick={() => setHidden(!hidden)}
                    className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors"
                >
                    {hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>
        </div>
    );
};

export default function AppKeys() {
    const { env, isTest } = usePlatform();
    const { app } = useApp();

    // Safety check if app/keys logic is missing
    if (!app || !app.apiKeys) return <div className="text-gray-500">No keys available for this app.</div>;

    const currentKeys = app.apiKeys[env] || {};

    return (
        <div className="max-w-4xl">
            <div className={`mb-8 p-4 rounded-xl border ${isTest ? 'bg-orange-500/10 border-orange-500/20' : 'bg-green-500/10 border-green-500/20'
                }`}>
                <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${isTest ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                        <Info size={20} />
                    </div>
                    <div>
                        <h3 className={`font-bold mb-1 ${isTest ? 'text-orange-400' : 'text-green-400'}`}>
                            Viewing {isTest ? 'Test' : 'Live'} Mode Credentials
                        </h3>
                        <p className={`text-sm ${isTest ? 'text-orange-200' : 'text-green-200'}`}>
                            These keys will only work for {isTest ? 'test' : 'real'} transactions.
                            Use the toggle in the top header to switch environments.
                        </p>
                    </div>
                </div>
            </div>

            <KeyCard
                label="Publishable Key"
                description="Use this key in your frontend code (React, Android, iOS) to tokenize payment details."
                value={currentKeys.publicKey || 'Generating...'}
            />

            <KeyCard
                label="Secret Key"
                description="Use this key in your backend code to authorize payments. Never share this key."
                value={currentKeys.secretKey || 'Generating...'}
            />
        </div>
    );
}
