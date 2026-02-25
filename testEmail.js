require("dotenv").config({ path: "./server/.env" });
const { sendOTP } = require("./server/src/utils/email");
sendOTP("sashanksingh363@gmail.com", "123456", "register").then(() => console.log("Done")).catch(console.error);
