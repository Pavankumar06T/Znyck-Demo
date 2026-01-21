const mongoose = require('mongoose');
const Organization = require('./modules/core/models/Organization');
const User = require('./modules/core/models/User');
require('dotenv').config();

const updateOrgName = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const user = await User.findOne({ email: 'mrsmithc2006@gmail.com' });
        if (!user) {
            console.log('Target User not found: mrsmithc2006@gmail.com');
            const allUsers = await User.find({});
            console.log('Available Users:', allUsers.map(u => u.email));
            return;
        }

        let org = await Organization.findOne({ owner: user._id });
        if (!org) {
            console.log('Org not found by owner. Trying by name "Acme Corp"...');
            org = await Organization.findOne({ name: /Acme Corp/i });
        }

        if (!org) {
            console.log('Org still not found.');
            const allOrgs = await Organization.find({});
            console.log('Available Orgs:', allOrgs.map(o => ({ id: o._id, name: o.name, owner: o.owner })));
            return;
        }

        console.log('Current Org Name:', org.name);
        org.name = 'Znyck Demo';
        await org.save();
        console.log('Updated Org Name to:', org.name);

    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.disconnect();
    }
};

updateOrgName();
