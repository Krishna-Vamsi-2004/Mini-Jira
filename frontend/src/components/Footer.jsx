import { Link } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const Footer = () => {
  const loggedIn = isAuthenticated();

  return (
    <footer className="bg-black text-slate-400 py-8 text-center mt-20">
      <p>© 2025 Mini Jira · MERN Stack Project</p>

      {loggedIn && (
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <Link to="/dashboard" className="hover:text-indigo-400">
            My Dashboard
          </Link>
          <Link to="/dashboard" className="hover:text-indigo-400">
            Add Task
          </Link>
        </div>
      )}
    </footer>
  );
};

export default Footer;
