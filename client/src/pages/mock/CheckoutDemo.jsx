import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, CreditCard, ShieldCheck, Globe, Code, Loader2, BookOpen, Briefcase, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

// --- PRODUCTS DATA ---
const PRODUCT_SETS = {
    digital: [
        { name: "SaaS Blueprint eBook", price: 2900, currency: "USD", icon: <BookOpen /> },
        { name: "Full Stack Course", price: 9900, currency: "USD", icon: <BookOpen /> },
        { name: "Dev Bundle (India)", price: 49900, currency: "INR", icon: <BookOpen /> }
    ],
    service: [
        { name: "UI Design Audit", price: 15000, currency: "USD", icon: <Briefcase /> },
        { name: "Consulting Call", price: 30000, currency: "USD", icon: <Briefcase /> },
        { name: "Retainer (India)", price: 2500000, currency: "INR", icon: <Briefcase /> }
    ],
    physical: [
        { name: "Ergo Mouse", price: 8900, currency: "USD", icon: <Monitor /> },
        { name: "4K Monitor", price: 49900, currency: "USD", icon: <Monitor /> },
        { name: "Gaming Chair (IN)", price: 1500000, currency: "INR", icon: <Monitor /> }
    ]
};

const MockProduct = ({ price, currency, name, icon, onBuy }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col items-center text-center border border-gray-100 hover:shadow-md transition-all">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mb-4">
            {icon || <ShoppingBag size={24} />}
        </div>
        <h3 className="font-bold text-gray-800">{name}</h3>
        <p className="text-2xl font-bold text-gray-900 mt-2">
            {amountFormatter(price, currency)}
        </p>
        <button
            onClick={() => onBuy({ price, currency, name })}
            className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
        >
            <CreditCard size={16} />
            <span>Buy Now</span>
        </button>
    </div>
);

const amountFormatter = (amount, currency) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount / 100);
};

export default function CheckoutDemo() {
    const { appId } = useParams();
    const [log, setLog] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appContext, setAppContext] = useState(null);
    const [initError, setInitError] = useState(null);

    // Fetch App Context by ID
    useEffect(() => {
        const initApp = async () => {
            if (!appId || appId === 'demo') {
                setInitError("Invalid App Launch. Please open from Dashboard.");
                return;
            }

            try {
                // NOTE: In real world, we wouldn't fetch via list query, but by ID. 
                // Since we don't have GetAppById Public endpoint yet, we simulate fetching org apps and finding it, 
                // OR we fix the backend to allowing getting public app info by ID. 
                // For hackathon speed, we'll fetch all apps of the first org found and match ID (hacky but works if only 1 org).

                // Better: Let's assume we can fetch App Config if we had a dedicated endpoint. 
                // Fallback: We fetch orgs -> apps -> find by ID.
                const orgRes = await fetch('http://localhost:5000/api/v1/orgs');
                const orgs = await orgRes.json();
                if (orgs.length > 0) {
                    const appRes = await fetch(`http://localhost:5000/api/v1/apps?organizationId=${orgs[0]._id}`);
                    const apps = await appRes.json();
                    const found = apps.find(a => a._id === appId);

                    if (found) {
                        setAppContext(found);
                        addLog(`App Initialized: ${found.name}`, 'success');
                    } else {
                        setInitError("Application not found.");
                    }
                }
            } catch (err) {
                setInitError("Failed to connect to platform.");
            }
        };
        initApp();
    }, [appId]);

    const addLog = (msg, type = 'info') => {
        setLog(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
    };

    const handleBuy = async (product) => {
        if (!appContext) return;

        setLoading(true);
        addLog(`Initiating Checkout for ${product.name}`, 'info');

        try {
            addLog(`Calling Znyck API (POST /orders)`, 'info');

            const payload = {
                amount: product.price,
                currency: product.currency,
                customer: {
                    email: `user_${Math.floor(Math.random() * 1000)}@example.com`,
                    name: 'Demo Customer',
                    country: product.currency === 'INR' ? 'IN' : 'US'
                },
                metadata: {
                    productName: product.name,
                    appType: appContext.settings?.theme
                }
            };

            const res = await fetch('http://localhost:5000/api/v1/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': appContext.secretKey // Using the specific app's key
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error(`API Error: ${res.status}`);

            const order = await res.json();

            addLog(`Order Created: ${order.orderId}`, 'success');
            addLog(`Routing Strategy: ${order.provider}`, 'success');

            await new Promise(r => setTimeout(r, 1200));
            addLog(`Payment Capture Successful`, 'success');

        } catch (err) {
            addLog(`Error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (initError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
                <h1 className="text-2xl font-bold text-red-500 mb-2">Simulation Error</h1>
                <p className="text-gray-600">{initError}</p>
            </div>
        );
    }

    if (!appContext) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-500" /></div>;
    }

    // Choose products based on settings
    const theme = appContext.settings?.theme || 'digital';
    const products = PRODUCT_SETS[theme] || PRODUCT_SETS['digital'];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <div className="flex-1 p-12 overflow-y-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center space-x-2 text-gray-900">
                        <Globe className="text-blue-600" />
                        <span className="font-bold text-xl">{appContext.name}</span>
                    </div>
                    <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                        Mock Environment
                    </div>
                </header>

                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            {theme === 'digital' ? 'Upgrade your knowledge' : theme === 'service' ? 'Hire an Expert' : 'Gear Up'}
                        </h1>
                        <p className="text-gray-500">Demo storefront connected to Znyck Pay.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {products.map((p, i) => (
                            <MockProduct key={i} {...p} onBuy={handleBuy} />
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-96 bg-[#0f1117] text-white p-6 overflow-hidden flex flex-col font-mono text-xs border-l border-white/10">
                <h3 className="font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
                    <Code size={14} />
                    <span>Backend Integration Logs</span>
                </h3>
                <div className="text-xs text-gray-600 mb-4 break-all">
                    Key: {appContext.publicKey}
                </div>
                <div className="flex-1 overflow-y-auto space-y-3">
                    {log.map((l, i) => (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={i}
                            className="border-l-2 pl-3 py-1"
                            style={{
                                borderColor: l.type === 'error' ? '#ef4444' : l.type === 'success' ? '#22c55e' : '#3b82f6'
                            }}
                        >
                            <span className="text-gray-500 block mb-1">{l.time}</span>
                            <span className={l.type === 'error' ? 'text-red-400' : l.type === 'success' ? 'text-green-400' : 'text-gray-300'}>
                                {l.msg}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
