import React, { useState } from 'react';
import { Book, Briefcase, ShoppingBag, Wallet, CreditCard, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const CategoryCard = ({ title, icon: Icon, colorClass, onBuy, onViewTransactions }) => (
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

        <div className="grid grid-cols-2 gap-3 mt-auto">
            <button
                onClick={onViewTransactions}
                className="flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-lg transition-colors border border-white/5"
            >
                <Wallet size={18} />
                <span className="text-sm font-medium">View Transactions</span>
            </button>
            <button
                onClick={onBuy}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20"
            >
                <CreditCard size={18} />
                <span className="text-sm font-bold">Buy</span>
            </button>
        </div>
    </div>
);

export default function DashboardOverview() {
    const navigate = useNavigate();

    const categories = [
        { id: 'ebook', title: 'E-Book', icon: Book, color: 'from-purple-500 to-pink-500' },
        { id: 'freelance', title: 'Freelance', icon: Briefcase, color: 'from-emerald-500 to-teal-500' },
        { id: 'product', title: 'Product', icon: ShoppingBag, color: 'from-orange-500 to-red-500' },
    ];

    const handleViewTransactions = (category) => {
        // Navigate to transactions, optionally could filter by category if we wanted
        navigate('/dashboard/transactions');
    };

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
                        onViewTransactions={() => handleViewTransactions(cat.id)}
                    />
                ))}
            </div>
        </div>
    );
}
