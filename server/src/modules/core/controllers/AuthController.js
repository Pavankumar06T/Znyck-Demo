const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Organization = require('../models/Organization');

class AuthController {

    // POST /api/v1/auth/signup
    async signup(req, res) {
        try {
            const { email, password, companyName, name, country, contact, panNumber, bankDetails, website } = req.body;

            // Defaults since removed from UI
            const role = 'admin';
            const saasType = 'ebook-saas';

            // 1. Check if user exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // 2. Create User
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                password: hashedPassword,
                name: name || email.split('@')[0], // Use provided name or default
                country,
                contact,
                website,
                panNumber,
                bankDetails
            });

            // 3. Create Tenant/Organization
            // If customer, we create a personal workspace
            const orgName = companyName || (role === 'customer' ? `${user.name}'s Space` : `${user.name}'s Org`);
            const userRole = role === 'customer' ? 'viewer' : 'admin'; // Map customer to viewer in Org, or just use custom string if schema allows

            const org = await Organization.create({
                name: orgName,
                owner: user._id,
                members: [{ user: user._id, role: userRole }],
                settings: { saasType: saasType || 'generic' }
            });



            // 5. Seed Default Products for this Merchant (So they have inventory to sell in Demo)
            const Product = require('../../payment/models/Product');
            const defaultProducts = [
                {
                    name: "The Art of " + (saasType === 'freelance-saas' ? "Freelancing" : "Coding"),
                    description: "Master the skills you need to succeed in the modern digital economy.",
                    price: 2900, // ₹29.00
                    currency: "INR",
                    category: "E-Book",
                    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
                    organization: org._id
                },
                {
                    name: saasType === 'project-saas' ? "Pro Project Template" : "Brand Identity Kit",
                    description: "Professional templates to jumpstart your next big project.",
                    price: 4900, // ₹49.00
                    currency: "INR",
                    category: "Product",
                    image: "https://images.unsplash.com/photo-1626785774573-4b799314346d?auto=format&fit=crop&q=80&w=800",
                    organization: org._id
                }
            ];

            await Product.insertMany(defaultProducts);

            // 6. Generate Token
            const token = jwt.sign(
                { userId: user._id, orgId: org._id, role: role || 'admin' },
                process.env.JWT_SECRET || 'secret_key_change_me',
                { expiresIn: '7d' }
            );

            res.status(201).json({
                token,
                tenantId: org._id,
                role: role || 'admin',
                saasType: org.settings.saasType
            });
        } catch (error) {
            console.error('Signup Error:', error);
            res.status(500).json({ error: 'Signup failed', details: error.message });
        }
    }

    // POST /api/v1/auth/login
    async login(req, res) {
        console.log('[AuthController] Login called');
        try {
            const { email, password } = req.body;

            // 1. Find User
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 2. Check Password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // 3. Find Org (For this demo, just pick the first one they own or belong to)
            const org = await Organization.findOne({ 'members.user': user._id });

            // Determine Role
            let userRole = 'admin';
            if (org) {
                const memberParams = org.members.find(m => m.user.toString() === user._id.toString());
                if (memberParams) {
                    // Map internal org roles to our App Roles
                    userRole = memberParams.role === 'viewer' ? 'customer' : 'admin';
                }
            }

            // 4. Generate Token
            const token = jwt.sign(
                { userId: user._id, orgId: org ? org._id : null, role: userRole },
                process.env.JWT_SECRET || 'secret_key_change_me',
                { expiresIn: '7d' }
            );

            res.json({
                token,
                tenantId: org ? org._id : null,
                role: userRole,
                plan: 'free' // Placeholder
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
    // GET /api/v1/auth/me
    async getMe(req, res) {
        try {
            const userId = req.user.userId;
            const user = await User.findById(userId).select('-password');

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Fetch Organization
            // Logic: Find org where this user is the owner OR a member
            // For MVP simplicty, looking for one they own or just the one in the token
            let org;
            if (req.user.orgId) {
                org = await Organization.findById(req.user.orgId);
            } else {
                org = await Organization.findOne({ 'members.user': userId });
            }

            res.json({
                user: {
                    ...user.toObject(),
                    role: req.user.role // Return the effective role from token
                },
                organization: org
            });

        } catch (error) {
            console.error('GetMe Error:', error);
            res.status(500).json({ error: 'Failed to fetch user details' });
        }
    }
}

module.exports = new AuthController();
