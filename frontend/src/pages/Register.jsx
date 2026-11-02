import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.email.trim()) return setError("Please enter your email.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    try {
      const user = await register(form.name.trim(), form.email.trim(), form.password);
      signIn(user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <span className="blob b1" />
        <span className="blob b2" />
        <div className="brand">
          <span className="logo-mark">{"{ }"}</span>
          <span>DevAssist</span>
        </div>
        <h1 className="hero-title">
          Write better <em>Java</em>, faster.
        </h1>
        <p className="hero-text">
          Create a free account and start asking questions about your code right away.
        </p>
        <ul className="hero-list">
          <li>Upload .java, .txt and .md files</li>
          <li>Understand errors in plain English</li>
          <li>Get tests you can paste into your project</li>
        </ul>
      </section>

      <section className="auth-form-wrap">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-sub">It only takes a minute.</p>

          {error && <div className="alert alert-error" role="alert">{error}</div>}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" className="input" placeholder="Your name" autoComplete="name"
              value={form.name} onChange={update("name")} />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" className="input" type="email" placeholder="you@example.com"
              autoComplete="email" value={form.email} onChange={update("email")} />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="pw-wrap">
              <input id="password" className="input" type={showPw ? "text" : "password"}
                placeholder="At least 6 characters" autoComplete="new-password"
                value={form.password} onChange={update("password")} />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
                {showPw ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" className="input" type={showPw ? "text" : "password"}
              placeholder="Repeat your password" autoComplete="new-password"
              value={form.confirm} onChange={update("confirm")} />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="spin" /> : null}
            {loading ? "Creating account…" : "Create account"}
          </button>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}