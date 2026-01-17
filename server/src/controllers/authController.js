const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Tenant = require('../models/Tenant');
const tenantPresets = require('../config/tenantPresets');

const generateToken = (userId, tenantId, role, saasType) => {
    return jwt.sign({ userId, tenantId, role, saasType }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.signup = async (req, res) => {
    try {
        const { email, password, companyName, saasType } = req.body;

        if (!['ebook-saas', 'freelance-saas', 'project-saas'].includes(saasType)) {
            return res.status(400).json({ error: 'Invalid SaaS Type' });
        }

        // Check if user exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Create Tenant
        const tenantId = companyName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 1000);
        const preset = tenantPresets[saasType];

        const tenant = new Tenant({
            name: companyName,
            tenantId: tenantId,
            saasType: saasType,
            theme: preset.theme,
            features: preset.features,
            labels: preset.labels
        });
        await tenant.save();

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User linked to Tenant
        const user = new User({
            email,
            password: hashedPassword,
            tenantId: tenantId,
            saasType: saasType,
            role: 'admin',
            plan: 'free'
        });
        await user.save();

        const token = generateToken(user._id, user.tenantId, user.role, user.saasType);

        res.status(201).json({ message: 'Signup successful', token, tenantId: user.tenantId, saasType: user.saasType });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.tenantId, user.role, user.saasType);

        res.json({ message: 'Login successful', token, tenantId: user.tenantId, role: user.role, plan: user.plan, saasType: user.saasType });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
