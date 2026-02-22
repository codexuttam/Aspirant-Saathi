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
const otpTemplate = (otp, action) => {
  const isLogin = action === 'login';
  const headerText = isLogin ? "Welcome Back!" : "Welcome to Aspirant-Saathi!";
  const subText = isLogin
    ? "Ready to crush your next study session? Securely log into your account with the OTP below."
    : "You're one step away from joining the ultimate preparation platform! Verify your email with the OTP below.";
  const heroImage = isLogin
    ? "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80"
    : "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80";

  return `
<div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background-color: #ffffff;">
  
  <!-- Hero Section -->
  <div style="background-color: #0f172a; text-align: center; position: relative;">
    <img src="${heroImage}" alt="Welcome" style="width: 100%; height: 200px; object-fit: cover; opacity: 0.8;" />
    <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, #0f172a, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Aspirant-Saathi</h1>
      <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">Ignite Your Potential</p>
    </div>
  </div>

  <!-- Content Section -->
  <div style="padding: 40px 30px; background-color: #ffffff;">
    <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">${headerText}</h2>
    
    <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
      Hi there, <br><br>
      ${subText}
    </p>

    <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px dashed #93c5fd;">
      <p style="color: #1e3a8a; font-size: 14px; margin-top: 0; margin-bottom: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
      <span style="font-size: 42px; font-weight: 800; letter-spacing: 8px; color: #2563eb; text-shadow: 2px 2px 4px rgba(37, 99, 235, 0.2);">${otp}</span>
    </div>

    <p style="color: #64748b; font-size: 14px; text-align: left; background-color: #f8fafc; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 0 8px 8px 0;">
      <strong style="color: #475569;">Security Notice:</strong> This OTP is valid for exactly 10 minutes. Never share this code with anyone. Our team will never ask for your OTP.
    </p>
    
    <div style="margin-top: 30px; text-align: center;">
      <a href="https://aspirantsaathi.com" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 50px; font-weight: 600; font-size: 15px; transition: background-color 0.3s;">Visit Dashboard</a>
    </div>
  </div>

  <!-- Footer -->
  <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0;">
    <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aspirant-Saathi. Empowering Aspirants Worldwide.</p>
    <p style="margin: 5px 0 0 0;">Need help? <a href="mailto:aspirantsaathisuppport@gmail.com" style="color: #3b82f6; text-decoration: none;">Contact Support</a></p>
  </div>
</div>
  `;
};

exports.sendOTP = async (email, otp, action = "register") => {
  // If no credentials, log to console for development
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV MODE] Email Service Skipped. OTP for ${email}: ${otp}`);
    return;
  }

  const subjectText = action === 'login' ? "Welcome Back! Your OTP 🔐" : "Verify Your Email 🚀";

  const mailOptions = {
    from: `"Aspirant-Saathi Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Aspirant-Saathi: ${subjectText}`,
    html: otpTemplate(otp, action),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP sent to ${email} (Action: ${action})`);
  } catch (error) {
    console.error("Error sending email:", error);
    // Fallback log for dev if send fails
    console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
  }
};

exports.sendContactEmail = async (name, email, subject, message) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV MODE] Contact form received from ${email} - subject: ${subject}`);
    return;
  }

  const mailOptions = {
    // Setting `from` to the support address to avoid Gmail throwing errors on impersonation
    from: `"Aspirant-Saathi Contact" <${process.env.EMAIL_USER}>`,
    to: "aspirantsaathisuppport@gmail.com", // The final destination
    replyTo: email, // This allows the admin to hit "reply" and talk directly to the user
    subject: `New Contact Form Submission: ${subject}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <hr />
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `,
  };

  try {
    // 1. Send the email to the admin
    await transporter.sendMail(mailOptions);
    console.log(`Contact email received from ${email}`);

    // 2. Send the auto-reply "Thank you" email to the sender
    const thankYouMailOptions = {
      from: `"Aspirant-Saathi Support" <${process.env.EMAIL_USER}>`,
      to: email, // Send to the person who filled out the form
      subject: `Thank you for reaching out, ${name}! 😊`,
      html: `
        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); background-color: #ffffff;">
          
          <!-- Hero Section -->
          <div style="background-color: #0f172a; text-align: center; position: relative;">
            <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80" alt="Thank You!" style="width: 100%; height: 200px; object-fit: cover; opacity: 0.8;" />
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(to top, #0f172a, transparent); display: flex; flex-direction: column; justify-content: flex-end; padding: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">Aspirant-Saathi</h1>
              <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">Message Received!</p>
            </div>
          </div>

          <!-- Content Section -->
          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 24px;">Hi ${name}, <br/>Thank You for Reaching Out!</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              We have successfully received your message regarding <strong>"${subject}"</strong>.
            </p>

            <!-- Fun Highlight Box -->
            <div style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); padding: 25px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px dashed #93c5fd;">
              <h3 style="color: #1e3a8a; font-size: 18px; margin-top: 0; margin-bottom: 15px; font-weight: 700;">We'll be in touch soon! 🚀</h3>
              <p style="color: #3b82f6; font-size: 15px; margin: 0; font-weight: 500;">
                Our team is looking over your message and we'll reply to this email address as quickly as possible (usually within 24 hours). 
              </p>
            </div>

            <!-- Summary Box -->
            <p style="color: #64748b; font-size: 14px; text-align: left; background-color: #f8fafc; padding: 20px; border-left: 4px solid #3b82f6; border-radius: 0 8px 8px 0;">
              <strong style="color: #475569;">Copy of your message:</strong><br><br>
              <span style="font-style: italic; color: #1e293b;">"${message}"</span>
            </p>
            
            <!-- CTA -->
            <div style="margin-top: 35px; text-align: center;">
              <a href="https://aspirantsaathi.com" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.4); transition: transform 0.2s;">Return to Website</a>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0;">&copy; ${new Date().getFullYear()} Aspirant-Saathi. Empowering Aspirants Worldwide.</p>
            <p style="margin: 5px 0 0 0;">Need immediate help? <a href="mailto:aspirantsaathisuppport@gmail.com" style="color: #3b82f6; text-decoration: none;">Reply to this email</a></p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(thankYouMailOptions);
    console.log(`Thank you confirm email sent to ${email}`);

  } catch (error) {
    console.error("Error sending contact email:", error);
    throw error;
  }
};
