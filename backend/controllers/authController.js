const path = require("path");
const User = require(path.join(__dirname, "../server/models/User"));
const Otp = require(path.join(__dirname, "../server/models/Otp"));
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
//const user = new User({ email, displayName, password: hashedPassword });
//await user.save();

// ---- Send OTP ----
exports.sendOtp = async (req, res) => {
  const { email, displayName } = req.body;
  if (!email || !displayName)
    return res.status(400).json({ error: "Missing fields" });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  try {
    // Save OTP to DB
    await Otp.findOneAndUpdate(
      { email },
      { code: otpCode, expiresAt },
      { upsert: true, new: true },
    );

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Your BitesFinder OTP",
      text: `Hello ${displayName}, your verification code is ${otpCode}. It expires in 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};
// controllers/authController.js
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Missing email or password" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
      message: `Welcome back, ${user.displayName}!`,
      token,
      user: { email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// ---- Verify OTP + Register ----
exports.verifyOtp = async (req, res) => {
  const { email, code, password, displayName } = req.body;
  if (!email || !code || !password || !displayName)
    return res.status(400).json({ error: "Missing fields" });

  try {
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) return res.status(400).json({ error: "OTP not found" });
    if (otpRecord.code !== code)
      return res.status(400).json({ error: "Invalid OTP" });
    if (otpRecord.expiresAt < new Date())
      return res.status(400).json({ error: "OTP expired" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      displayName,
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    await Otp.deleteOne({ email });

    res.json({
      token,
      user: { email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};
