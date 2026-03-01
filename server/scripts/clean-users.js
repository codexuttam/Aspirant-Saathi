#!/usr/bin/env node
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../src/models/User');

const devEmail = 'uttamrajsingh43@gmail.com';
const force = process.argv.includes('--confirm') || process.env.FORCE === 'true';

async function main() {
    if (!process.env.MONGO_URI) {
        console.error('MONGO_URI not set in environment. Aborting.');
        process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find users that will be deleted (exclude the developer email)
    const users = await User.find({ email: { $ne: devEmail } }).select('email').lean();
    const count = users.length;
    console.log(`Found ${count} user(s) that will be deleted (excluding ${devEmail}).`);
    if (count > 0) {
        console.log('Sample emails (up to 20):');
        users.slice(0, 20).forEach(u => console.log(' -', u.email));
    }

    if (!force) {
        console.log('\nDry run: no changes were made. Re-run with --confirm to actually delete these users.');
        await mongoose.disconnect();
        process.exit(0);
    }

    const res = await User.deleteMany({ email: { $ne: devEmail } });
    console.log(`Deleted ${res.deletedCount} user(s).`);

    await mongoose.disconnect();
    process.exit(0);
}

main().catch(err => {
    console.error('Error during cleanup:', err);
    mongoose.disconnect().finally(() => process.exit(1));
});
