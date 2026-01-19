require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./src/modules/payment/models/Product');

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Delete products without organization
        const res = await Product.deleteMany({ organization: { $exists: false } });
        console.log(`Deleted ${res.deletedCount} invalid products.`);

    } catch (error) {
        console.error('Migration Failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

migrate();
