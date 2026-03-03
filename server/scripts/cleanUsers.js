const mongoose = require("mongoose");
const path = require("path");
// Load environment variables from server/.env
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const User = require("../src/models/User");
const Attempt = require("../src/models/Attempt");
const Refund = require("../src/models/Refund");

const developerEmail = "uttamrajsingh423@gmail.com";

const cleanDatabase = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("❌ Error: MONGO_URI is missing in server/.env");
            process.exit(1);
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
        console.log("✅ Connected to MongoDB.");

        // 1. Logic Check - Find the developer account first
        const devUser = await User.findOne({ email: developerEmail });

        if (!devUser) {
            console.log(`⚠️  Warning: Developer account (${developerEmail}) was NOT found in the database.`);
            console.log("Aborting cleanup to prevent accidental global deletion.");
            console.log("💡 Tip: Make sure the developer account exists before running this script.");
            await mongoose.disconnect();
            process.exit(1);
        }

        console.log(`✨ Found Developer Account: ${devUser.email} (ID: ${devUser._id})`);

        // 2. Delete Other Users
        const userResult = await User.deleteMany({ _id: { $ne: devUser._id } });
        console.log(`🗑️  Deleted ${userResult.deletedCount} users (excluding the developer account).`);

        // 3. Delete Other Attempts (Keep only developer's attempts)
        const attemptResult = await Attempt.deleteMany({ userId: { $ne: devUser._id } });
        console.log(`🗑️  Deleted ${attemptResult.deletedCount} attempts.`);

        // 4. Delete Other Refunds
        const refundResult = await Refund.deleteMany({ email: { $ne: developerEmail } });
        console.log(`🗑️  Deleted ${refundResult.deletedCount} refunds.`);

        console.log("\n🚀 Database cleanup completed successfully!");
        console.log("Only the developer account and its associated data remain.");

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error("❌ Error during database cleanup:", error);
        if (mongoose.connection && mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
};

// Run the script
cleanDatabase();
