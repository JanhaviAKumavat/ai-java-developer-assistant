import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar({ onMenuClick }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const initial = (user?.name || "?").charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="nav-left">
        <button type="button" className="icon-btn hamburger" onClick={onMenuClick} aria-label="Toggle menu">
          ☰
        </button>
        <Link to="/dashboard" className="brand">
          <span className="logo-mark">{"{ }"}</span>
          <span>DevAssist</span>
        </Link>
      </div>

      <div className="nav-right">
        <div className="user-chip">
          <span className="avatar">{initial}</span>
          <span className="user-name">{user?.name}</span>
        </div>
        <button type="button" className="btn btn-silver btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}