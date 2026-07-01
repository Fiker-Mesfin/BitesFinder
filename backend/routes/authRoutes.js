// backend/server/authHandlers.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../server/models/User");
const Otp = require("../server/models/Otp");
const nodemailer = require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

// ------------------ Nodemailer setup ------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ------------------ Helper to send JSON ------------------
const sendJSON = (res, statusCode, data) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(JSON.stringify(data));
};

// ------------------ Handlers ------------------

async function sendOtpHandler(req, res, body) {
  console.log("➡ Received forgot-password request:", body);
  const { email, displayName } = body;
  if (!email || !displayName)
    return sendJSON(res, 400, { error: "Email and Display Name required" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return sendJSON(res, 400, {
        error: "Email already registered. Please log in.",
      });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, expiresAt },
      { upsert: true, new: true },
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your BitesFinder OTP",
      text: `Hello ${displayName}, your verification code is ${otpCode}. It expires in 10 minutes.`,
    });

    sendJSON(res, 200, { message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Failed to send OTP" });
  }
}

async function verifyOtpHandler(req, res, body) {
  const { email, code, password, displayName } = body;
  if (!email || !code || !password || !displayName)
    return sendJSON(res, 400, { error: "All fields are required" });

  try {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return sendJSON(res, 400, { error: "OTP not found" });
    if (otpRecord.code !== code)
      return sendJSON(res, 400, { error: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date())
      return sendJSON(res, 400, { error: "OTP expired" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return sendJSON(res, 400, {
        error: "Email already registered. Please log in.",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      displayName,
      password: hashedPassword,
    });

    await Otp.deleteOne({ email });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    sendJSON(res, 200, {
      message: "Signup successful",
      token,
      user: { email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Registration failed" });
  }
}

async function loginHandler(req, res, body) {
  const { email, password } = body;
  if (!email || !password)
    return sendJSON(res, 400, { error: "Email and password required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return sendJSON(res, 400, { error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return sendJSON(res, 400, { error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    sendJSON(res, 200, {
      message: `Welcome back, ${user.displayName}!`,
      token,
      user: { email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Login failed" });
  }
}

async function forgotPasswordHandler(req, res, body) {
  console.log("➡ Received forgot-password request:", body);
  const { email } = body;
  if (!email) return sendJSON(res, 400, { error: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return sendJSON(res, 400, { error: "Email not found" });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, expiresAt },
      { upsert: true, new: true },
    );

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your BitesFinder Password Reset OTP",
      text: `Your reset code is ${otpCode}. It expires in 10 minutes.`,
    });

    sendJSON(res, 200, { message: "Reset OTP sent successfully" });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Failed to send reset OTP" });
  }
}

async function resetPasswordHandler(req, res, body) {
  const { email, code, newPassword } = body;
  if (!email || !code || !newPassword)
    return sendJSON(res, 400, { error: "All fields required" });

  try {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return sendJSON(res, 400, { error: "OTP not found" });
    if (otpRecord.code !== code)
      return sendJSON(res, 400, { error: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date())
      return sendJSON(res, 400, { error: "OTP expired" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updateOne({ email }, { password: hashedPassword });
    await Otp.deleteOne({ email });

    sendJSON(res, 200, { message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    sendJSON(res, 500, { error: "Reset failed" });
  }
}

module.exports = {
  sendOtpHandler,
  verifyOtpHandler,
  loginHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};
