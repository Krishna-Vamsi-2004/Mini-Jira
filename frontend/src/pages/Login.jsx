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

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/");
    } catch {
      setError("Invalid email or password");
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
          Welcome Back
        </h1>
        <p className="text-sm text-[#286ba2] text-center mt-2">
          Sign in to your workspace
        </p>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="mt-8 space-y-5">
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
            placeholder="Password"
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
            {loading ? "Signing in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-sm text-[#286ba2] mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-[#2088fb] font-semibold">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
