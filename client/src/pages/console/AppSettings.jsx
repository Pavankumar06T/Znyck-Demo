import React, { useState, useEffect } from 'react';
import { useGlobal } from '../../context/GlobalContext';
import { User, Building2, CreditCard, Shield, Edit2, Globe, Phone, MapPin } from 'lucide-react';
import OnboardingModal from '../../components/OnboardingModal';

const SectionCard = ({ title, icon: Icon, children, onEdit }) => (
    <div className="bg-white dark:bg-[#1c1f2e] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none mb-6 relative overflow-hidden group">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-600 dark:text-blue-400">
                    <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
            </div>
            {onEdit && (
                <button
                    onClick={onEdit}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-white/10"
                >
                    <Edit2 size={14} />
                    <span>Edit</span>
                </button>
            )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {children}
        </div>
    </div>
);

const DetailItem = ({ label, value, icon: Icon }) => (
    <div className="relative">
        <label className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-1 block flex items-center gap-1.5">
            {Icon && <Icon size={12} />}
            {label}
        </label>
        <div className="text-base font-semibold text-slate-900 dark:text-white break-words">
            {value || <span className="text-slate-300 dark:text-gray-600 italic">Not set</span>}
        </div>
    </div>
);

export default function AppSettings() {
    const { activeApp } = useGlobal();
    const [profileData, setProfileData] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

    const loadProfile = () => {
        const saved = localStorage.getItem('onboarding_data');
        if (saved) {
            setProfileData(JSON.parse(saved));
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleEditComplete = () => {
        loadProfile(); // Reload data
        // Also update completion status if needed
        localStorage.setItem('profile_completed', 'true');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Settings</h1>
                    <p className="text-slate-500 dark:text-gray-500 text-sm">Manage your profile, business details and preferences.</p>
                </div>
            </div>

            {/* Profile Data Sections */}
            <div className="max-w-4xl">

                {/* Account Details */}
                <SectionCard
                    title="Account Details"
                    icon={User}
                    onEdit={() => setIsEditOpen(true)}
                >
                    <DetailItem label="Full Name" value={profileData?.fullName} />
                    <DetailItem label="Nickname" value={profileData?.nickName} />
                    <DetailItem label="Contact Number" value={profileData?.contactNumber} icon={Phone} />
                    <DetailItem label="Country" value={profileData?.country} icon={Globe} />
                </SectionCard>

                {/* Business Details */}
                <SectionCard
                    title="Business Profile"
                    icon={Building2}
                    onEdit={() => setIsEditOpen(true)}
                >
                    <DetailItem label="Organization Name" value={profileData?.orgName} />
                    <DetailItem label="Website" value={profileData?.orgWebsite} icon={Globe} />
                    <DetailItem label="Business Address" value={profileData?.businessAddress} icon={MapPin} />
                    <DetailItem label="PAN Number" value={profileData?.pan} />
                    <DetailItem label="GST Number" value={profileData?.gst} />
                </SectionCard>

                {/* Banking & KYC */}
                <SectionCard
                    title="Banking & KYC"
                    icon={Shield}
                    onEdit={() => setIsEditOpen(true)}
                >
                    <div className="md:col-span-2 p-4 bg-slate-50 dark:bg-[#0f1117] rounded-xl border border-slate-200 dark:border-white/5 flex items-start gap-4">
                        <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-500 rounded-lg">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Bank Account Linked</h4>
                            <div className="flex gap-6 text-sm">
                                <div>
                                    <span className="text-slate-500 dark:text-gray-500 block text-xs">Account Number</span>
                                    <span className="font-mono font-medium text-slate-900 dark:text-white">{profileData?.bankAccount || '•••• •••• ••••'}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 dark:text-gray-500 block text-xs">IFSC Code</span>
                                    <span className="font-mono font-medium text-slate-900 dark:text-white">{profileData?.ifsc || '•••••••'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SectionCard>

                {/* App Configuration (Read Only) */}
                <SectionCard title="App Configuration" icon={Globe}>
                    <DetailItem label="App Name" value={activeApp?.name} />
                    <DetailItem label="App ID" value={activeApp?.appId} />
                </SectionCard>

            </div>

            <OnboardingModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                onComplete={handleEditComplete}
            />
        </div>
    );
}
