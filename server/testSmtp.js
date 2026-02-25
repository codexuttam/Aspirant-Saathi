const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: "aspirantsaathisuppport@gmail.com", pass: "lujnhzrycpatggsm" }
});
transporter.verify()
  .then(() => console.log("SMTP OK"))
  .catch(err => { console.error("SMTP Error:", err); process.exit(1); });
