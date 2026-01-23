import React, { useState } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { Copy, Eye, EyeOff, Check, Terminal, Key } from 'lucide-react';
import { motion } from 'framer-motion';

const ApiKeyDisplay = ({ label, value }) => {
    const [show, setShow] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-50 dark:bg-[#0f1117] p-4 rounded-lg border border-slate-200 dark:border-white/5 mb-3">
            <div className="text-xs text-slate-500 dark:text-gray-500 uppercase font-bold mb-2 flex justify-between">
                <span>{label}</span>
                {copied && <span className="text-green-500 dark:text-green-400">Copied!</span>}
            </div>
            <div className="flex items-center space-x-3">
                <code className="flex-1 font-mono text-sm text-slate-700 dark:text-gray-300 truncate">
                    {show ? value : value.replace(/./g, '•').slice(0, 24) + '...'}
                </code>
                <button onClick={() => setShow(!show)} className="text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={handleCopy} className="text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            </div>
        </div>
    );
};

export default function AppDevelopers() {
    const { activeApp, env } = useGlobal();

    // Mock Keys - in real app fetch from backend based on env
    const keys = {
        publicKey: env === 'live' ? `pk_live_${activeApp?.appId}_x9d8f7` : `pk_test_${activeApp?.appId}_t2k3m4`,
        secretKey: env === 'live' ? `sk_live_${activeApp?.appId}_j29d01` : `sk_test_${activeApp?.appId}_p0d9s8`
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Developers</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <Key size={20} className="text-blue-600 dark:text-blue-500" />
                        <span>API Keys ({env})</span>
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-gray-500 mb-6">
                        Use these keys to authenticate requests for the <strong className="uppercase text-slate-900 dark:text-white">{env}</strong> environment.
                    </p>

                    <ApiKeyDisplay label="Public Key" value={keys.publicKey || '...'} />
                    <ApiKeyDisplay label="Secret Key" value={keys.secretKey || '...'} />

                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-700 dark:text-yellow-400">
                        <strong>security note:</strong> Never share your Secret Key on the client-side code.
                    </div>
                </motion.div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Terminal size={20} className="text-purple-600 dark:text-purple-500" />
                            <span>Quick Start</span>
                        </h3>
                        <div className="prose prose-sm dark:prose-invert">
                            <p className="text-slate-500 dark:text-gray-400 mb-4">
                                Install our SDK to get started immediately.
                            </p>
                            <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto relative group">
                                <span className="text-green-400">$</span> npm install @znyck/react-sdk
                                <button className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white">
                                    <Copy size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
