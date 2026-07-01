// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Helmet } from "react-helmet-async";
import { Check, User as UserIcon, Mail } from "lucide-react";
import { Button } from "../components/ui/button";
import MessageBox from "../components/MessageBox";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const navigate = useNavigate();

  // ⚡ Load user info on mount safely
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
    }
  }, [user]);

  // 🚨 Guard: user might be null initially
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!displayName) return;

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const token = localStorage.getItem("token");
      console.log("Token:", token);
      console.log("PUT URL:", "http://localhost:5000/api/profile");
      console.log("Body:", { displayName });

      const res = await fetch("http://localhost:5000/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ displayName }),
      });

      console.log("Response status:", res.status);

      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
        if (res.status === 401) {
          setUser(null);
          localStorage.clear();
          navigate("/signin");
          return;
        }
        throw new Error(data.error || "Update failed");
      }

      setUser(data.user);
      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ text: error.message || "Update failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>BitesFinder - Profile</title>
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          {message.text && (
            <MessageBox
              text={message.text}
              type={message.type}
              onClose={() => setMessage({ text: "", type: "" })}
            />
          )}

          <form
            onSubmit={handleUpdate}
            className="bg-white p-8 rounded-2xl shadow-md max-w-lg mx-auto space-y-6"
          >
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Display Name
              </label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-50 border border-gray-300 shadow-sm">
                <UserIcon className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={displayName ?? ""}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="flex-1 outline-none bg-transparent"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            {/* Email (readonly) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl px-4 py-3 bg-gray-100 border border-gray-300 shadow-sm">
                <Mail className="w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={user?.email ?? ""}
                  readOnly
                  className="flex-1 outline-none bg-transparent text-gray-500"
                />
              </div>
            </div>

            <Button
              type="submit"
              className={`w-full py-3 flex items-center justify-center gap-2 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              <Check className="w-4 h-4" />
              {loading ? "Updating..." : "Update Profile"}
            </Button>
            <Button
              type="button"
              className="w-full py-3 mt-4 flex items-center justify-center gap-2 bg-red-600 text-white hover:bg-red-700"
              onClick={async () => {
                if (
                  !window.confirm(
                    "Are you sure you want to delete your account? This cannot be undone.",
                  )
                )
                  return;

                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch("http://localhost:5000/api/user/me", {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (!res.ok) {
                    const errData = await res.json(); // safe if backend sends JSON
                    throw new Error(errData.error || "Delete failed");
                  }

                  alert("Your account has been deleted.");
                  // sign out locally
                  setUser(null);
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");

                  // redirect to home
                  navigate("/");
                } catch (error) {
                  console.error(error);
                  alert(error.message || "Failed to delete account");
                }
              }}
            >
              Delete Account
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
