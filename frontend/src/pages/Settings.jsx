import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MODES, getPrefs, savePrefs } from "../services/assistantService.js";

export default function Settings() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(getPrefs);
  const [saved, setSaved] = useState(false);

  const update = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    savePrefs(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const logout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="page">
      <h1 className="page-title reveal">Settings</h1>
      <p className="page-sub reveal">Your profile and how the assistant behaves.</p>

      {saved && <div className="alert alert-ok">Preferences saved ✓</div>}

      <div className="settings-grid">
        <section className="card reveal">
          <h3 className="section-title">Profile</h3>
          <dl className="kv">
            <dt>Name</dt>
            <dd>{user.name}</dd>
            <dt>Email</dt>
            <dd>{user.email}</dd>
            <dt>User ID</dt>
            <dd>{user.id}</dd>
          </dl>
          <button type="button" className="btn btn-dark" style={{ marginTop: 18 }} onClick={logout}>
            Log out
          </button>
        </section>

        <section className="card reveal" style={{ animationDelay: "90ms" }}>
          <h3 className="section-title">Preferences</h3>

          <div className="setting-row">
            <div>
              Default tool
              <small>Which tab opens first</small>
            </div>
            <select
              className="select"
              style={{ width: "auto" }}
              value={prefs.defaultMode}
              onChange={(e) => update({ defaultMode: e.target.value })}
            >
              {MODES.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          <div className="setting-row">
            <div>
              Save chats to history
              <small>Turn off to chat without saving</small>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={prefs.saveHistory}
                onChange={(e) => update({ saveHistory: e.target.checked })}
              />
              <span className="slider" />
            </label>
          </div>
        </section>

        <section className="card reveal" style={{ animationDelay: "180ms" }}>
          <h3 className="section-title">Connection</h3>
          <dl className="kv">
            <dt>Backend</dt>
            <dd>{import.meta.env.VITE_API_BASE_URL || "http://localhost:8080"}</dd>
          </dl>
          <p className="hint" style={{ marginTop: 10 }}>
            Your Gemini key stays on the server and is never sent to the browser.
          </p>
        </section>
      </div>
    </div>
  );
}