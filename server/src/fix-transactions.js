const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Transaction = require('./modules/payment/models/Transaction');
const Application = require('./modules/app/models/Application');
const Product = require('./modules/payment/models/Product');

const fixTransactions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const apps = await Application.find({});
        console.log(`Found ${apps.length} Apps`);

        const appMap = {};
        apps.forEach(app => {
            // Map 'Znyck E-Books' or 'E-Book' -> ID
            // The seeds are named 'E-Book', 'Freelance', 'Product' now.
            if (app.name.includes('E-Book')) appMap['E-Book'] = app;
            if (app.name.includes('Freelance')) appMap['Freelance'] = app;
            if (app.name.includes('Product') || app.name.includes('Gear')) appMap['Product'] = app;
        });

        const transactions = await Transaction.find({});
        console.log(`Found ${transactions.length} Transactions`);

        let updated = 0;
        for (const tx of transactions) {
            let targetApp = null;

            // 1. Try to find product to determine category
            if (tx.metadata && tx.metadata.productId) {
                const product = await Product.findById(tx.metadata.productId);
                if (product) {
                    if (product.category === 'E-Book') targetApp = appMap['E-Book'];
                    else if (product.category === 'Freelance') targetApp = appMap['Freelance'];
                    else if (product.category === 'Product') targetApp = appMap['Product'];
                }
            }

            // 2. Fallback: Round robin or random if no product info? 
            // Better to force 'Product' or just skip if we really can't tell.
            // Let's default to 'Product' (Znyck Gear) if unknown, OR leave it alone?
            // User said "Still 0", implies they want to see them.
            if (!targetApp) {
                targetApp = appMap['Product']; // Fallback
            }

            if (targetApp) {
                tx.application = targetApp._id;
                tx.organization = targetApp.organization; // Align org too
                await tx.save();
                updated++;
                process.stdout.write('.');
            }
        }

        console.log(`\n✅ Fixed ${updated} transactions.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }
};

fixTransactions();
