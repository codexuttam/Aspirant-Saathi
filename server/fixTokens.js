require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("./src/models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const res = await User.updateMany({ isPro: false, tokens: { $gt: 100 } }, { tokens: 100 });
    console.log("Fixed users:", res.modifiedCount);
    process.exit(0);
});
