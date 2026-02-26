const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./src/models/User");
const Attempt = require("./src/models/Attempt");
const Refund = require("./src/models/Refund");

const cleanDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI missing");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
        console.log("Connected to MongoDB.");

        const developerEmail = "uttamrajsingh423@gmail.com";

        // Find developer user
        const devUser = await User.findOne({ email: developerEmail });

        if (devUser) {
            console.log(`Developer found with ID: ${devUser._id}`);

            // Delete other users
            const deletedUsers = await User.deleteMany({ email: { $ne: developerEmail } });
            console.log(`Deleted ${deletedUsers.deletedCount} users.`);

            // Delete other attempts
            const deletedAttempts = await Attempt.deleteMany({ userId: { $ne: devUser._id } });
            console.log(`Deleted ${deletedAttempts.deletedCount} attempts.`);

            // Delete other refunds
            const deletedRefunds = await Refund.deleteMany({ email: { $ne: developerEmail } });
            console.log(`Deleted ${deletedRefunds.deletedCount} refunds.`);

        } else {
            console.log("Developer user not found. Deleting all users/attempts/refunds...");
            const deletedUsers = await User.deleteMany({ email: { $ne: developerEmail } });
            console.log(`Deleted ${deletedUsers.deletedCount} users.`);

            const deletedAttempts = await Attempt.deleteMany({});
            console.log(`Deleted ${deletedAttempts.deletedCount} attempts.`);

            const deletedRefunds = await Refund.deleteMany({ email: { $ne: developerEmail } });
            console.log(`Deleted ${deletedRefunds.deletedCount} refunds.`);
        }

        console.log("Database cleaned successfully.");
        process.exit(0);

    } catch (err) {
        console.error("Error cleaning DB:", err);
        process.exit(1);
    }
};

cleanDB();
