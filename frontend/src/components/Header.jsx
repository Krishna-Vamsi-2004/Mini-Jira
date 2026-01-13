import { Link, useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import NotificationBell from "./NotificationBell";

const Header = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();

  const handleLogout = () => {
    localStorage.clear(); // remove token + user
    navigate("/");        // go to public home
  };

  return (
    <header className="bg-[#f2ecff] border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#522987] tracking-tight"
        >
          Mini Jira
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-6">
          {loggedIn ? (
            <>
              {/* 🔔 NOTIFICATION BELL */}
              <NotificationBell />

              <Link
                to="/dashboard"
                className="text-[#522987] font-medium hover:text-[#2088fb] transition"
              >
                Dashboard
              </Link>

              <Link
                to="/profile"
                className="text-[#522987] font-medium hover:text-[#2088fb] transition"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:text-red-700 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-5 py-2 rounded-lg bg-[#2088fb] text-white font-semibold hover:bg-[#286ba2] transition"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
