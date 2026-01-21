import React, { useState, useEffect } from 'react';
import { Book, Briefcase, ShoppingBag, Wallet, CreditCard, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CategoryCard = ({ title, icon: Icon, colorClass, onBuy }) => (
    <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 hover:border-blue-500/30 transition-all group flex flex-col h-full relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colorClass} opacity-5 rounded-bl-full pointer-events-none`} />

        <div className="flex justify-between items-start mb-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10 text-white`}>
                <Icon size={28} />
            </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-8 flex-1">
            Manage your {title.toLowerCase()} business, view sales, and process new orders.
        </p>

        <div className="mt-auto flex justify-center">
            <button
                onClick={onBuy}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
                <CreditCard size={18} />
                <span className="text-sm font-bold">Buy</span>
            </button>
        </div>
    </div>
);

import { fetchApps, fetchOrgs } from '../../services/api';

export default function DashboardOverview() {
    const navigate = useNavigate();
    const [apps, setApps] = useState([]);

    useEffect(() => {
        // Fetch apps to map them to categories for filtering
        const loadApps = async () => {
            try {
                // 1. Get Organization
                const orgs = await fetchOrgs();
                if (orgs.length > 0) {
                    const orgId = orgs[0]._id;
                    // 2. Fetch Apps with Org ID
                    const data = await fetchApps(orgId);
                    console.log('Loaded Apps for Dashboard:', data);
                    setApps(data);
                }
            } catch (err) {
                console.error("Failed to fetch apps", err);
            }
        };
        loadApps();
    }, []);

    // Helper functions can go here

    const categories = [
        { id: 'ebook', title: 'E-Book', icon: Book, color: 'from-purple-500 to-pink-500' },
        { id: 'freelance', title: 'Freelance', icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
        { id: 'product', title: 'Product', icon: ShoppingBag, color: 'from-orange-500 to-red-500' },
    ];


    const handleBuy = (categoryTitle) => {
        navigate(`/dashboard/store/${categoryTitle.toLowerCase()}`);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Select a category to manage or purchase via test mode.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories.map(cat => (
                    <CategoryCard
                        key={cat.id}
                        title={cat.title}
                        icon={cat.icon}
                        colorClass={cat.color}
                        onBuy={() => handleBuy(cat.title)}
                    />
                ))}
            </div>
        </div>
    );
}
