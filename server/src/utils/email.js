const nodemailer = require("nodemailer");

// Simple transporter setup
// In production, user would provide SMTP credentials
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// HTML Template for OTP
const otpTemplate = (otp) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
  <div style="background-color: #0f172a; padding: 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0;">Aspirant-Saathi</h1>
  </div>
  <div style="padding: 30px; background-color: #ffffff;">
    <h2 style="color: #333333; margin-top: 0;">Verify Your Email Address</h2>
    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
      Hi there,
    </p>
    <p style="color: #666666; font-size: 16px; line-height: 1.5;">
      Thank you for being part of Aspirant-Saathi. Please use the following One-Time Password (OTP) to verify your account or login.
    </p>
    <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; margin: 25px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3b82f6;">${otp}</span>
    </div>
    <p style="color: #666666; font-size: 14px; margin-top: 20px;">
      This OTP is valid for 10 minutes. Do not share this code with anyone.
    </p>
  </div>
  <div style="background-color: #f8fafc; padding: 15px; text-align: center; font-size: 12px; color: #94a3b8;">
    &copy; ${new Date().getFullYear()} Aspirant-Saathi. All rights reserved.
  </div>
</div>
`;

exports.sendOTP = async (email, otp) => {
    // If no credentials, log to console for development
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[DEV MODE] Email Service Skipped. OTP for ${email}: ${otp}`);
        return;
    }

    const mailOptions = {
        from: `"Aspirant-Saathi Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your OTP for Aspirant-Saathi 🔐",
        html: otpTemplate(otp),
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        // Fallback log for dev if send fails
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
    }
};
