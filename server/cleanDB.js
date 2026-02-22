require('dotenv').config();
const mongoose = require('mongoose');

const cleanDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // Get all collections
        const collections = await mongoose.connection.db.collections();

        for (let collection of collections) {
            await collection.deleteMany({});
            console.log(`Cleared all documents from collection: ${collection.collectionName}`);
        }

        console.log('✅ Database cleaned successfully! All records have been removed but table structures/indexes remain intact.');
    } catch (error) {
        console.error('Error cleaning database:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
};

cleanDatabase();
