const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 5000;

const connectAndStart = async () => {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.error("MONGO_URI is not set in environment. Set it in .env before starting the server.");
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected");

        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("MongoDB connection error:", err);
        console.error("Make sure your MongoDB URI is correct and your IP is allowed (Atlas Network Access whitelist).");
        process.exit(1);
    }
};

connectAndStart();