import React from 'react';
import { useApp } from '../../layouts/AppLayout';
import { DollarSign, Activity, CreditCard, Users } from 'lucide-react';

const Metric = ({ label, value, icon: Icon, color }) => (
    <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-lg ${color} bg-opacity-10 text-white`}>
                <Icon size={20} />
            </div>
        </div>
        <p className="text-gray-400 text-sm mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
);

export default function AppOverview() {
    const { app } = useApp();

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Metric label="Total Revenue" value="₹0.00" icon={DollarSign} color="bg-green-500" />
                <Metric label="Success Rate" value="100%" icon={Activity} color="bg-blue-500" />
                <Metric label="Transactions" value="0" icon={CreditCard} color="bg-purple-500" />
                <Metric label="Customers" value="0" icon={Users} color="bg-orange-500" />
            </div>

            <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-8 text-center">
                <h3 className="text-lg font-bold text-white mb-2">Detailed Analytics Coming Soon</h3>
                <p className="text-gray-500">We are processing data for {app.name} to generate deeper insights.</p>
            </div>
        </div>
    );
}
