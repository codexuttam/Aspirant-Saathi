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
      to: "sashanksingh363@gmail.com",
      subject: "Test Mail Direct",
      text: "Testing email delivery to the user directly."
    });
    console.log("Email sent successfully to sashanksingh363@gmail.com!");
  } catch (err) {
    console.error("Failed to send:", err);
  }
}

testMail();
