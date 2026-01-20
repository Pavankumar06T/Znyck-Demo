const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Application = require('./modules/app/models/Application');

const cleanupDuplicates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected');

        // IDs identified from debug-apps.js output as "Old/Dynamic"
        const idsToDelete = [
            '696f3da7c14a6b761dc2d47b', // Old E-Book
            '696f3de145b400f5c1513d1d', // Old Freelance
            '696f3de145b400f5c1513d20'  // Old Product
        ];

        const result = await Application.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`✅ Deleted ${result.deletedCount} duplicate apps.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

cleanupDuplicates();
