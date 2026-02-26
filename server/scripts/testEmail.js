require('dotenv').config();
const nodemailer = require("nodemailer");

async function testMail() {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: "uttamrajsingh423@gmail.com",
            subject: "Test Mail",
            text: "Testing email delivery."
        });
        console.log("Email sent successfully!");
    } catch (err) {
        console.error("Failed to send:", err);
    }
}

testMail();
