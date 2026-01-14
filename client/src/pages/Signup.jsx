import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [saasType, setSaasType] = useState('ebook-saas');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/signup', { email, password, companyName, saasType });
            localStorage.setItem('token', response.data.token);
            // We might want to auto-login or redirect to login. For now auto-login:
            localStorage.setItem('user', JSON.stringify({
                tenantId: response.data.tenantId,
                role: 'admin', // default for signup
                plan: 'free',   // default
                saasType: response.data.saasType
            }));
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'Signup failed');
        }
    };

    return (
        <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
            <div className="card">
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Start Your Journey</h2>
                <form onSubmit={handleSignup}>
                    <input
                        type="text"
                        placeholder="Company Name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select
                        value={saasType}
                        onChange={(e) => setSaasType(e.target.value)}
                        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
                    >
                        <option value="ebook-saas">WriterPro (Ebook SaaS)</option>
                        <option value="freelance-saas">DevHire (Freelance SaaS)</option>
                        <option value="project-saas">TaskFlow (Project SaaS)</option>
                    </select>
                    <button type="submit">Create Account</button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
