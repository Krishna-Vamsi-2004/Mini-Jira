import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { isAuthenticated } from "../utils/auth";

/* ================= MOTION VARIANTS ================= */

const sectionReveal = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 90, damping: 18 },
  },
};

const stagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.1 },
  },
};

export default function Home() {
  const loggedIn = isAuthenticated();
  const user = loggedIn
    ? JSON.parse(localStorage.getItem("user") || "{}")
    : null;

  /* ================= HERO PARALLAX ================= */
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  return (
    <div className="w-full overflow-x-hidden bg-[#f2ecff] text-[#522987]">
      <Header />

      {/* ================= HERO ================= */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center justify-center px-6
                   bg-gradient-to-br from-[#f2ecff] via-[#e9f2ff] to-white"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 70, damping: 18 }}
          className="max-w-5xl w-full text-center p-10 md:p-16 rounded-[2.5rem]
                     backdrop-blur-2xl bg-white/50 border border-white/60
                     shadow-[0_30px_120px_rgba(0,0,0,0.18)]"
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            Mini Jira
          </h1>

          <p className="text-lg md:text-xl text-[#286ba2] max-w-3xl mx-auto">
            A modern task management system inspired by Jira — built to help
            you plan work, track progress, and deliver with confidence.
          </p>

          {!loggedIn ? (
            <motion.div
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="mt-14"
            >
              <Link
                to="/register"
                className="inline-block px-16 py-4 rounded-full
                           bg-gradient-to-r from-[#2088fb] to-[#286ba2]
                           text-white font-bold text-lg shadow-lg"
              >
                Get Started 🚀
              </Link>
            </motion.div>
          ) : (
            <div className="mt-14">
              <p className="text-xl text-[#286ba2] mb-2">Welcome back,</p>
              <p className="text-4xl md:text-5xl font-extrabold mb-6">
                {user?.name || "User"} 👋
              </p>
              <Link
                to="/dashboard"
                className="inline-block px-16 py-4 rounded-full
                           bg-gradient-to-r from-[#2088fb] to-[#286ba2]
                           text-white font-bold"
              >
                Open Dashboard
              </Link>
            </div>
          )}
        </motion.div>
      </section>

      {/* ================= WHY MINI JIRA ================= */}
      <motion.section
        className="py-36 px-6 md:px-32"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl font-bold mb-10">Why Mini Jira?</h2>

        <motion.p variants={cardReveal} className="max-w-5xl text-lg text-[#286ba2] mb-6">
          Many tools are either too simple or overwhelmingly complex.
          Mini Jira is intentionally designed to balance structure with clarity.
        </motion.p>

        <motion.p variants={cardReveal} className="max-w-5xl text-lg text-[#286ba2] mb-6">
          It models how real teams work — visual boards, task states,
          priorities, deadlines, and accountability.
        </motion.p>

        <motion.p variants={cardReveal} className="max-w-5xl text-lg text-[#286ba2]">
          Every feature exists to reduce friction and improve execution.
        </motion.p>
      </motion.section>

      {/* ================= WORKFLOW ================= */}
      <motion.section
        className="py-36 px-6 md:px-32 bg-[#e9f2ff]"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={sectionReveal} className="text-4xl font-bold mb-14">
          Task Lifecycle
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-10">
          {[
            ["Create", "Add tasks with priority, description, and deadlines."],
            ["Plan", "Organize tasks visually across workflow stages."],
            ["Execute", "Move tasks smoothly using drag & drop."],
            ["Complete", "Finish work and archive it safely."],
          ].map(([title, desc], i) => (
            <motion.div
              key={i}
              variants={cardReveal}
              className="bg-white rounded-2xl p-8 border border-[#2088fb]/20 shadow"
            >
              <h3 className="text-2xl font-semibold mb-3">{title}</h3>
              <p className="text-[#286ba2]">{desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= FEATURES ================= */}
      <motion.section
        className="py-36 px-6 md:px-32"
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={sectionReveal} className="text-4xl font-bold mb-14">
          Powerful Features
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            "📋 Kanban drag & drop workflow",
            "⏰ Due date & overdue alerts",
            "🔔 Notification center",
            "🗂 Archived tasks with restore",
            "📊 Real-time dashboard analytics",
            "🧠 User activity tracking",
            "⚡ Instant UI updates",
            "🔐 Secure JWT authentication",
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={cardReveal}
              className="bg-white rounded-xl p-6 border border-[#286ba2]/20 shadow"
            >
              {feature}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ================= CTA ================= */}
      <motion.section
        className="py-40 px-6 md:px-32 text-center text-white
                   bg-gradient-to-br from-[#2088fb] to-[#286ba2]"
        variants={sectionReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Organize Work. Deliver Faster.
        </h2>
        <p className="max-w-3xl mx-auto text-lg mb-10">
          Start managing tasks professionally with Mini Jira today.
        </p>
        <Link
          to={loggedIn ? "/dashboard" : "/register"}
          className="inline-block px-16 py-4 bg-white text-[#2088fb]
                     font-bold rounded-full shadow-lg"
        >
          Get Started
        </Link>
      </motion.section>

      <Footer />
    </div>
  );
}
