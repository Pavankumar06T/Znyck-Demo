import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import StripeCheckoutModal from '../components/StripeCheckoutModal';

const AiInsightCard = ({ topic, themeColor }) => (
    <div className="card" style={{ borderLeft: `5px solid ${themeColor}`, background: 'linear-gradient(to right, #f8fafc, white)' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', color: themeColor, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>✨</span> AI Intelligence: {topic}
        </h4>
        <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Analysis shows a <strong style={{ color: '#059669' }}>24% increase</strong> in activity this week.
            Recommendation: Focus on high-value items to maximize revenue based on current trends.
        </p>
    </div>
);

const ModuleRenderer = ({ features, labels, isPremium, theme }) => {
    return (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {features.ebooks && (
                <div className="card">
                    <h3>{labels.itemName} Manager</h3>
                    <p>Track your writing progress.</p>
                    <button style={{ background: theme.primary, color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {labels.actionBtn}
                    </button>
                    {isPremium && <p style={{ color: theme.primary, marginTop: '0.5rem' }}>Pro Export Enabled</p>}
                </div>
            )}

            {features.jobs && (
                <div className="card">
                    <h3>active {labels.itemName}s</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Frontend Role - $60/hr</li>
                        <li style={{ padding: '0.5rem', borderBottom: '1px solid #eee' }}>Backend Role - $80/hr</li>
                    </ul>
                    <button style={{ background: theme.primary, color: 'white', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {labels.actionBtn}
                    </button>
                </div>
            )}

            {features.projects && (
                <div className="card">
                    <h3>{labels.itemName} Pipeline</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ background: theme.accent, padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary }}>5</div>
                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.primary }}>Pending</div>
                        </div>
                        <div style={{ background: theme.accent, padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary }}>2</div>
                            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: theme.primary }}>Active</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [config, setConfig] = useState(null);
    const navigate = useNavigate();
    const [showStripeModal, setShowStripeModal] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (!storedUser) return navigate('/login');
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                const res = await api.get('/config');
                setConfig(res.data);

            } catch (err) {
                console.error("Failed to load config", err);
            }
        };
        fetchConfig();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleUpgrade = async (paymentMethod) => {
        if (paymentMethod === 'Stripe') {
            setShowStripeModal(true);
            return;
        }

        try {
            // Existing Razorpay or other flow
            const response = await api.post('/payments/upgrade', { paymentMethod });
            if (response.data.success) {
                alert('Upgrade Successful!');
                const updatedUser = { ...user, plan: 'premium' };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            alert('Upgrade Failed');
        }
    };

    const handleStripeSuccess = () => {
        const updatedUser = { ...user, plan: 'premium' };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Upgrade Successful with Stripe!');
    }

    if (!config || !user) return <div style={{ padding: '2rem' }}>Loading Workspace...</div>;

    return (
        <div className="container" style={{ maxWidth: '1000px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
                borderBottom: `2px solid ${config.theme.primary}`,
                paddingBottom: '1rem'
            }}>
                <div>
                    <h1 style={{ margin: 0, color: config.theme.primary }}>{config.name}</h1>
                    <span style={{
                        background: config.theme.accent,
                        color: config.theme.primary,
                        padding: '0.2rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        {user.plan === 'premium' ? 'PREMIUM PLAN' : 'FREE PLAN'}
                    </span>
                </div>
                <button onClick={handleLogout} style={{ background: '#333' }}>Sign Out</button>
            </div>

            {/* AI Insight Section */}
            <AiInsightCard
                topic={config.saasType === 'ebook-saas' ? 'Reading Trends' : 'Market Demand'}
                themeColor={config.theme.primary}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                {/* Main Action Area (Dynamic Module) */}
                <div>
                    <h3 style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.5rem' }}>Workspace</h3>
                    <ModuleRenderer
                        features={config.features}
                        labels={config.labels}
                        isPremium={user.plan === 'premium'}
                        theme={config.theme}
                    />
                </div>

                {/* Sidebar / Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <h3>Quick Stats</h3>
                        <div style={{ fontSize: '3.5rem', fontWeight: '800', color: config.theme.primary, lineHeight: '1' }}>12</div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{config.labels.itemName}s Created</p>
                    </div>

                    {user.plan !== 'premium' && (
                        <div className="card" style={{ background: `linear-gradient(135deg, ${config.theme.accent} 0%, white 100%)`, border: `1px solid ${config.theme.primary}40` }}>
                            <h4 style={{ color: config.theme.primary }}>Unlock Pro Power</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Get unlimited exports and AI tools.</p>
                            <button onClick={() => handleUpgrade('Stripe')} style={{ background: config.theme.primary, width: '100%', marginTop: '1rem' }}>
                                Upgrade with Stripe
                            </button>
                            <button onClick={() => handleUpgrade('Razorpay')} style={{ background: 'transparent', color: config.theme.primary, border: `1px solid ${config.theme.primary}`, width: '100%', marginTop: '0.5rem' }}>
                                Upgrade with Razorpay
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <StripeCheckoutModal
                isOpen={showStripeModal}
                onClose={() => setShowStripeModal(false)}
                amount={299} // Hardcoded for demo
                onSuccess={handleStripeSuccess}
            />
        </div>
    );
};

export default Dashboard;
