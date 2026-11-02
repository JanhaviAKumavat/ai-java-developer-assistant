import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { listConversations } from "../services/assistantService.js";
import { formatDate } from "../utils/formatCode.js";

const features = [
  { mode: "ask", icon: "✦", title: "Ask about code", text: "Paste or upload Java code and ask what it does, why it fails, or how to improve it." },
  { mode: "error", icon: "⚠", title: "Explain an error", text: "Paste a stack trace and get the likely cause with a suggested fix." },
  { mode: "tests", icon: "✓", title: "Generate JUnit tests", text: "Get JUnit 5 tests covering normal inputs, boundaries, and expected exceptions." },
];

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const { user } = useAuth();
  const [chats, setChats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let off = false;
    listConversations(user.id)
      .then((data) => !off && setChats(data))
      .catch((e) => !off && setError(e.message));
    return () => {
      off = true;
    };
  }, [user.id]);

  return (
    <div className="page">
      <section className="hero-card reveal">
        <h1>
          {greeting()}, <em>{user.name}</em>.
        </h1>
        <p>What are we working on today? Pick a tool below or start a fresh conversation.</p>
        <Link to="/assistant" state={{ fresh: Date.now() }} className="btn btn-primary">
          Start a new chat →
        </Link>
      </section>

      <div className="grid-3">
        {features.map((f, i) => (
          <Link
            key={f.mode}
            to={`/assistant?mode=${f.mode}`}
            state={{ fresh: Date.now() }}
            className="card card-hover feature-card reveal"
            style={{ animationDelay: `${i * 90}ms` }}
          >
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Recent conversations</h2>

      {error && <div className="alert alert-error">{error}</div>}

      {chats === null && !error && (
        <div className="list">
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {chats && chats.length === 0 && (
        <div className="card empty">
          <div className="big">💬</div>
          No conversations yet. Ask your first question!
        </div>
      )}

      {chats && chats.length > 0 && (
        <div className="list">
          {chats.slice(0, 4).map((c, i) => (
            <Link key={c.id} to={`/assistant?c=${c.id}`} className="list-item" style={{ animationDelay: `${i * 70}ms` }}>
              <span className="list-title">{c.title}</span>
              <span className="list-meta">{formatDate(c.createdAt)}</span>
            </Link>
          ))}
          {chats.length > 4 && <Link to="/history" className="link-btn">View all {chats.length} conversations →</Link>}
        </div>
      )}
    </div>
  );
}