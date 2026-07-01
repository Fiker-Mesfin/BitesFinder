require("dotenv").config();
const nodemailer = require("nodemailer");

async function testEmail() {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // 587 = false
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_USER, // send test to yourself
      subject: "Test Email from BitesFinder",
      text: "This is a test email to verify App Password",
    });
    console.log("✅ Email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Email failed:", err.message);
  }
}

testEmail();
