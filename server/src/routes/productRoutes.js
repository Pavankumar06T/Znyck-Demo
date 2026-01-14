const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products or filter by category
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Seed products (Helper for demo)
router.post('/seed', async (req, res) => {
    try {
        const count = await Product.countDocuments();
        if (count > 0 && !req.query.force) {
            return res.status(200).json({ message: 'Products already seeded' });
        }

        // Reliable Picsum Images
        const products = [
            {
                title: 'Mastering React',
                description: 'The ultimate guide to building modern web applications with React.js.',
                price: 499,
                category: 'ebook',
                image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop'
            },
            {
                title: 'Clean Code Principles',
                description: 'Write cleaner, more maintainable code with these proven patterns.',
                price: 299,
                category: 'ebook',
                image: 'http://localhost:5173/clean-code.jpg'
            },
            {
                title: 'Full Stack Development',
                description: 'I will build your complete web application from scratch using MERN stack.',
                price: 5000,
                category: 'freelance',
                image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop'
            },
            {
                title: 'Brand Identity Design',
                description: 'Professional logo and brand identity design package for startups.',
                price: 1500,
                category: 'freelance',
                image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop'
            },
            {
                title: 'Mechanical Keyboard RGB',
                description: 'Tactile switches, customizable RGB lighting, and premium build quality.',
                price: 3500,
                category: 'accessories',
                image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=800&auto=format&fit=crop'
            },
            {
                title: 'Wireless Gaming Mouse',
                description: 'Ultra-low latency, high DPI sensor, and ergonomic design.',
                price: 1200,
                category: 'accessories',
                image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=800&auto=format&fit=crop'
            }
        ];

        if (req.query.force) {
            await Product.deleteMany({});
        }
        await Product.insertMany(products);
        res.json({ message: 'Products seeded successfully with reliable images' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
