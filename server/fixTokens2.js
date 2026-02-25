require("dotenv").config({ path: ".env" });
const mongoose = require("mongoose");
const User = require("./src/models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({ email: 'uttamrajsingh423@gmail.com' });
  console.log("DB User:", users);
  process.exit(0);
});
