import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { listConversations } from "../services/assistantService.js";
import { formatDate } from "../utils/formatCode.js";

export default function History() {
  const { user } = useAuth();
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let off = false;
    listConversations(user.id)
      .then((data) => !off && setItems(data))
      .catch((e) => !off && setError(e.message));
    return () => {
      off = true;
    };
  }, [user.id]);

  const filtered = (items || []).filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="page">
      <h1 className="page-title reveal">History</h1>
      <p className="page-sub reveal">Open any previous conversation to continue where you left off.</p>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search conversations…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {items === null && !error && (
        <div className="list">
          <div className="skeleton" />
          <div className="skeleton" />
          <div className="skeleton" />
        </div>
      )}

      {items && filtered.length === 0 && (
        <div className="card empty">
          <div className="big">🗂️</div>
          {items.length === 0 ? "No saved conversations yet." : "No conversations match your search."}
        </div>
      )}

      <div className="list">
        {filtered.map((c, i) => (
          <Link key={c.id} to={`/assistant?c=${c.id}`} className="list-item" style={{ animationDelay: `${Math.min(i, 10) * 50}ms` }}>
            <span className="list-title">{c.title}</span>
            <span className="list-meta">{formatDate(c.createdAt)}</span>
            <span className="list-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}