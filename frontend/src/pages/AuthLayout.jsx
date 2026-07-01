// pages/AuthLayout.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mail, Lock, User, Hash, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  sendOtp,
  verifyOtp,
  loginUser,
  sendResetOtp,
  resetPassword,
} from "../api/auth";
import MessageBox from "../components/MessageBox";
import { useAuth } from "../hooks/useAuth"; // add this

export default function AuthLayout() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState("credentials");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isForgot, setIsForgot] = useState(false);

  const [resetStep, setResetStep] = useState("email");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { setUser } = useAuth();
  // ---------------- Handlers ----------------

  const handleForgotClick = () => {
    setIsForgot(true);
    setIsLogin(false);
    setStep("credentials");
    setResetStep("email");
    setMessage({ text: "", type: "" });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await sendResetOtp(email);
      setResetStep("otp");
      setMessage({
        text: "Reset code sent! Check your email.",
        type: "success",
      });
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Failed to send reset code",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setMessage({ text: "OTP is required", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      setResetStep("newPassword");
      setMessage({
        text: "Code verified! Set your new password.",
        type: "success",
      });
    } catch (err) {
      setMessage({ text: "Invalid OTP", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setMessage({ text: "All fields are required", type: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ text: "Passwords do not match", type: "error" });
      return;
    }
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      await resetPassword(email, otp, newPassword);
      setMessage({
        text: "Password reset successful. Please login.",
        type: "success",
      });
      setTimeout(() => {
        setIsForgot(false);
        setIsLogin(true);
        setResetStep("email");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
      }, 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Reset failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    setLoading(true);

    try {
      // 1️⃣ Call your API
      const res = await loginUser(email, password);

      // 2️⃣ Save token to localStorage
      localStorage.setItem("token", res.data.token); // ✅ this line is crucial

      // 3️⃣ Set user in context
      setUser(res.data.user);

      // 4️⃣ Show success message
      setMessage({
        text: `Welcome back ${res.data.user.displayName}!`,
        type: "success",
      });

      // 5️⃣ Redirect to dashboard
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || "Login failed",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = isForgot
    ? resetStep === "email"
      ? handleForgotPassword
      : resetStep === "otp"
        ? handleVerifyResetOtp
        : handleResetPassword
    : isLogin
      ? handleLogin
      : step === "credentials"
        ? async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await sendOtp(email, displayName);
              setStep("otp");
              setMessage({ text: "OTP sent to your email!", type: "success" });
            } catch (err) {
              // Check if error is because email is already used
              const errMsg = err.response?.data?.error || "";
              if (
                errMsg.toLowerCase().includes("already") ||
                errMsg.toLowerCase().includes("exist")
              ) {
                setMessage({
                  text: "This email is already registered. Please log in.",
                  type: "error",
                });
              } else {
                setMessage({
                  text: "Failed to send OTP. Try again.",
                  type: "error",
                });
              }
            } finally {
              setLoading(false);
            }
          }
        : async (e) => {
            e.preventDefault();
            setLoading(true);
            try {
              await verifyOtp(email, otp, password, displayName);
              // SUCCESSFUL REGISTER -> REDIRECT TO LOGIN
              setMessage({
                text: "Registration successful! You can now log in.",
                type: "success",
              });
              setTimeout(() => {
                setIsLogin(true);
                setStep("credentials");
                setOtp("");
                setPassword("");
              }, 2000);
            } catch (err) {
              setMessage({
                text: err.response?.data?.error || "Verification failed",
                type: "error",
              });
            } finally {
              setLoading(false);
            }
          };

  return (
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT: BRAND */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=1200"
          alt="Dining"
          className="absolute inset-0 w-full h-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center text-white px-12 bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-8"
        >
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            BitesFinder
          </h1>
          <p className="text-xl opacity-90">Culinary secrets of Addis Ababa.</p>
        </motion.div>
      </div>

      {/* RIGHT: FORM */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 bg-gray-50">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#6f4e37] mb-10"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              {isForgot
                ? "Reset Password"
                : isLogin
                  ? "Welcome back"
                  : "Get started"}
            </h2>
            <p className="text-gray-500">
              {isForgot
                ? resetStep === "email"
                  ? "Enter your email to receive a reset code."
                  : resetStep === "otp"
                    ? "Enter the 6-digit code."
                    : "Create a strong new password."
                : isLogin
                  ? "Enter your details to access your account."
                  : "Create your account today."}
            </p>
          </div>

          {message.text && (
            <MessageBox
              text={message.text}
              type={message.type}
              onClose={() => setMessage({ text: "", type: "" })}
            />
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {/* FORGOT PASSWORD FLOW */}
              {isForgot && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {resetStep === "email" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email Address
                      </label>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1 outline-none"
                          placeholder="name@email.com"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {resetStep === "otp" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Reset Code
                      </label>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                        <Hash className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="flex-1 outline-none"
                          placeholder="Enter OTP"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {resetStep === "newPassword" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          New Password
                        </label>
                        <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                          <Lock className="w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="flex-1 outline-none"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Confirm Password
                        </label>
                        <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                          <CheckCircle className="w-5 h-5 text-gray-400" />
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="flex-1 outline-none"
                            placeholder="••••••••"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* REGULAR AUTH FLOW */}
              {!isForgot && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {!isLogin && step === "credentials" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Display Name
                      </label>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                        <User className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="flex-1 outline-none"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 outline-none"
                        placeholder="name@email.com"
                        required
                      />
                    </div>
                  </div>
                  {step === "credentials" && (
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <label className="block text-sm font-semibold text-gray-700">
                          Password
                        </label>
                        {isLogin && (
                          <button
                            type="button"
                            onClick={handleForgotClick}
                            className="text-sm font-bold text-[#ff4500] hover:text-[#ff7f50] transition-colors"
                          >
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="flex-1 outline-none"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>
                  )}
                  {step === "otp" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white border border-gray-300 shadow-sm focus-within:ring-2 focus-within:ring-[#6f4e37]">
                        <Hash className="w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="flex-1 outline-none"
                          placeholder="123456"
                          required
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0px 20px 30px rgba(255, 127, 80, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 mt-6 rounded-xl text-white font-bold text-lg transition-all"
              style={{
                background: "linear-gradient(135deg, #ff7f50 0%, #ff4500 100%)",
              }}
            >
              {loading
                ? "Processing..."
                : isForgot
                  ? resetStep === "email"
                    ? "Send Reset Code"
                    : resetStep === "otp"
                      ? "Verify OTP"
                      : "Reset Password"
                  : isLogin
                    ? "Sign In"
                    : step === "credentials"
                      ? "Send OTP"
                      : "Verify Account"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsForgot(false);
                setIsLogin(!isLogin);
                setResetStep("email");
                setStep("credentials");
                setMessage({ text: "", type: "" });
              }}
              className="text-sm font-semibold text-[#6f4e37] hover:underline"
            >
              {isForgot
                ? "Back to Login"
                : isLogin
                  ? "New to BitesFinder? Sign up"
                  : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
