import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api.jsx";
import { motion } from "framer-motion";

const floatAnim = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 2.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2ecff] via-[#e9f2ff] to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="
          w-full max-w-md p-8 rounded-[2rem]
          bg-white/70 backdrop-blur-xl
          border border-white/60
          shadow-[0_30px_120px_rgba(0,0,0,0.15)]
        "
      >
        <h1 className="text-3xl font-extrabold text-[#522987] text-center">
          Create Account
        </h1>
        <p className="text-sm text-[#286ba2] text-center mt-2">
          Start managing tasks professionally
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <input
            type="text"
            placeholder="Full name"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2088fb] outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2088fb] outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Minimum 6 characters"
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#2088fb] outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            variants={floatAnim}
            animate="animate"
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className="
              w-full py-3 rounded-full font-semibold text-white
              bg-gradient-to-r from-[#2088fb] to-[#286ba2]
              shadow-lg hover:shadow-2xl transition
            "
          >
            {loading ? "Creating account..." : "Register"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-[#286ba2] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#2088fb] font-semibold">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
