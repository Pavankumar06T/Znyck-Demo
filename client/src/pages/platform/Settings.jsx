import React, { useState, useEffect } from 'react';
import { Building2, Mail, Globe, Palette, Save } from 'lucide-react';
import { usePlatform } from '../../layouts/PlatformLayout';

const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-[#1c1f2e] border border-white/5 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Icon size={20} />
            </div>
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        {children}
    </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1.5">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
            placeholder={placeholder}
        />
    </div>
);

export default function Settings() {
    const { refetchAuth } = usePlatform();
    const [org, setOrg] = useState({ name: '', email: '', website: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch org details from currently logged in user
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:5000/api/v1/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(r => r.json())
                .then(data => {
                    if (data && data.organization) {
                        const o = data.organization;
                        const u = data.user || {};
                        setOrg({
                            _id: o._id,
                            name: o.name,
                            email: u.email || '',
                            website: u.website || o.website || ''
                        });
                    }
                })
                .catch(err => console.error(err));
        }
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (token && org._id) {
                const res = await fetch(`http://localhost:5000/api/v1/orgs/${org._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(org)
                });

                if (res.ok) {
                    alert('Settings Updated Successfully!');
                    if (refetchAuth) refetchAuth(); // Refresh sidebar data
                } else {
                    const errorData = await res.json();
                    console.error('Update Failed:', errorData);
                    alert(`Failed to update settings: ${res.status} - ${errorData.error || 'Unknown Error'}`);
                }
            } else {
                alert(`Missing organization ID (${org._id ? 'Present' : 'Missing'}) or Token`);
            }
        } catch (err) {
            console.error('Fetch Error:', err);
            alert(`Error updating settings: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your organization profile and preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </header>

            <Section title="General Information" icon={Building2}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Organization Name"
                        value={org.name}
                        onChange={(e) => setOrg({ ...org, name: e.target.value })}
                    />
                    <InputField
                        label="Support Email"
                        type="email"
                        value={org.email}
                        onChange={(e) => setOrg({ ...org, email: e.target.value })}
                    />
                    <InputField
                        label="Website"
                        value={org.website}
                        onChange={(e) => setOrg({ ...org, website: e.target.value })}
                        placeholder="https://"
                    />
                </div>
            </Section>

            <Section title="Branding" icon={Palette}>
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-xl bg-[#0f1117] border border-white/10 flex items-center justify-center text-gray-500 cursor-pointer hover:border-blue-500/50 transition-colors">
                        <span className="text-xs">Upload Logo</span>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-400 mb-4">
                            Upload your organization logo to be displayed on checkout pages and invoices.
                            Recommended size: 512x512px (PNG).
                        </p>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-blue-600 cursor-pointer ring-2 ring-white/20" />
                            <div className="h-10 w-10 rounded-full bg-purple-600 cursor-pointer hover:ring-2 ring-white/20" />
                            <div className="h-10 w-10 rounded-full bg-orange-600 cursor-pointer hover:ring-2 ring-white/20" />
                            <div className="h-10 w-10 rounded-full bg-green-600 cursor-pointer hover:ring-2 ring-white/20" />
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
