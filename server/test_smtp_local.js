const nodemailer = require("nodemailer");
require("dotenv").config();

async function testSMTP() {
    console.log("Testing SMTP connection...");
    console.log("Host:", process.env.EMAIL_HOST);
    console.log("Port:", process.env.EMAIL_PORT);
    console.log("User:", process.env.EMAIL_USER);
    console.log("Pass:", process.env.EMAIL_PASS);

    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.verify();
        console.log("✅ SMTP Server is connected and ready to send emails!");
    } catch (error) {
        console.error("❌ SMTP Connection Error:", error);
    }
}

testSMTP();
