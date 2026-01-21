const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const Application = require('./modules/app/models/Application');
const Transaction = require('./modules/payment/models/Transaction');

const debugTransactionApps = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        const apps = await Application.find({});
        console.log(`\nFound ${apps.length} Apps:`);
        const appIdMap = {};
        apps.forEach(app => {
            console.log(`- ${app.name}: _id=${app._id}, appId=${app.appId}`);
            appIdMap[app._id.toString()] = app.name;
            appIdMap[app.appId] = app.name;
        });

        const transactions = await Transaction.find({}).populate('application', 'name _id appId');
        console.log(`\nFound ${transactions.length} Transactions:`);
        transactions.forEach(tx => {
            const appRef = tx.application;
            console.log(`- Amount: ₹${(tx.amount / 100).toFixed(2)}`);
            console.log(`  Application field type: ${typeof appRef}`);
            if (appRef) {
                if (typeof appRef === 'object') {
                    console.log(`  App (populated): name=${appRef.name}, _id=${appRef._id}, appId=${appRef.appId}`);
                } else {
                    console.log(`  App (ID only): ${appRef}`);
                    console.log(`  Maps to: ${appIdMap[appRef.toString()] || 'NOT FOUND'}`);
                }
            } else {
                console.log(`  App: NULL/UNDEFINED`);
            }
            console.log('');
        });

        process.exit(0);
    } catch (e) {
        console.error('❌ Error:', e);
        process.exit(1);
    }
};

debugTransactionApps();
