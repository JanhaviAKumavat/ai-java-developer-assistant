import { NavLink, useNavigate } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/assistant", label: "Assistant", icon: "✦" },
  { to: "/history", label: "History", icon: "◷" },
  { to: "/settings", label: "Settings", icon: "⚙" },
];

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const newChat = () => {
    navigate("/assistant", { state: { fresh: Date.now() } });
    onClose();
  };

  return (
    <>
      {open && <div className="scrim" onClick={onClose} />}
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <button type="button" className="btn btn-primary new-chat" onClick={newChat}>
          ＋ New chat
        </button>

        <nav className="side-nav">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={({ isActive }) => `side-link ${isActive ? "active" : ""}`}
            >
              <span className="side-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="side-foot">
          <p>Tip</p>
          Press Ctrl + Enter to send a message.
        </div>
      </aside>
    </>
  );
}