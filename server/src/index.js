require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const configRoutes = require('./routes/configRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/config', configRoutes);

app.get('/', (req, res) => {
    res.send('SaaS Platform API');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    let mongoUri = process.env.MONGO_URI;

    try {
        // Try connecting to provided URI first, if valid local mongo
        // But since we know it failed, let's prioritize Memory Server for this prototype env
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log('Using In-Memory MongoDB at:', mongoUri);

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

startServer();
