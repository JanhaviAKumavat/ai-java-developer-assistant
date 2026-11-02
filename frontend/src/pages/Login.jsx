// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { login } from "../services/authService.js";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPw, setShowPw] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { signIn } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     if (!email.trim() || !password) {
//       setError("Enter your email and password.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const user = await login(email.trim(), password);
//       signIn(user);
//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <section className="auth-hero">
//         <span className="blob b1" />
//         <span className="blob b2" />
//         <div className="brand">
//           <span className="logo-mark">{"{ }"}</span>
//           <span>DevAssist</span>
//         </div>
//         <h1 className="hero-title">
//           Your AI pair programmer for <em>Java</em>.
//         </h1>
//         <p className="hero-text">
//           Upload code, ask technical questions, understand errors, and generate JUnit tests in seconds.
//         </p>
//         <ul className="hero-list">
//           <li>Explain any class or method</li>
//           <li>Decode stack traces with suggested fixes</li>
//           <li>Generate JUnit 5 tests automatically</li>
//           <li>Keep your conversations in history</li>
//         </ul>
//       </section>

//       <section className="auth-form-wrap">
//         <form className="auth-card" onSubmit={handleSubmit} noValidate>
//           <h2 className="auth-title">Welcome back</h2>
//           <p className="auth-sub">Sign in to continue to your workspace.</p>

//           {error && <div className="alert alert-error" role="alert">{error}</div>}

//           <div className="field">
//             <label htmlFor="email">Email</label>
//             <input
//               id="email"
//               className="input"
//               type="email"
//               placeholder="you@example.com"
//               autoComplete="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="field">
//             <label htmlFor="password">Password</label>
//             <div className="pw-wrap">
//               <input
//                 id="password"
//                 className="input"
//                 type={showPw ? "text" : "password"}
//                 placeholder="Your password"
//                 autoComplete="current-password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//               <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
//                 {showPw ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           <button className="btn btn-primary" type="submit" disabled={loading}>
//             {loading ? <span className="spin" /> : null}
//             {loading ? "Signing in…" : "Sign in"}
//           </button>

//           <p className="auth-switch">
//             New here? <Link to="/register">Create an account</Link>
//           </p>
//         </form>
//       </section>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";

const WORDS = ["Java", "Spring Boot", "JUnit", "APIs"];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [wordIdx, setWordIdx] = useState(0);
  const tiltRef = useRef(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Rotate the highlighted word in the headline
  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2600);
    return () => clearInterval(t);
  }, []);

  // Card tilts slightly toward the mouse
  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 8}deg`);
    el.style.setProperty("--rx", `${-y * 8}deg`);
  };
  const onLeave = () => {
    const el = tiltRef.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await login(email.trim(), password);
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
        <span className="grid-bg" />
        <span className="blob b1" />
        <span className="blob b2" />

        <div className="brand">
          <span className="logo-mark">{"{ }"}</span>
          <span>DevAssist</span>
        </div>

        <h1 className="hero-title">
          Your AI pair programmer for{" "}
          <em key={WORDS[wordIdx]} className="swap">{WORDS[wordIdx]}</em>.
        </h1>

        <p className="hero-text">
          Upload code, ask technical questions, understand errors, and generate JUnit tests in seconds.
        </p>

        <ul className="hero-list">
          <li>Explain any class or method</li>
          <li>Decode stack traces with suggested fixes</li>
          <li>Generate JUnit 5 tests automatically</li>
          <li>Keep your conversations in history</li>
        </ul>

        <div className="code-card" aria-hidden="true">
          <div className="code-card-head">
            <i /><i /><i />
            <span>AssistantController.java</span>
          </div>
          <pre>
            <span className="code-line" style={{ "--i": 0 }}>
              <span className="k">@PostMapping</span><span className="s">("/ask")</span>
            </span>
            <span className="code-line" style={{ "--i": 1 }}>
              <span className="k">public</span> Answer ask(Question q) {"{"}
            </span>
            <span className="code-line" style={{ "--i": 2 }}>
              {"  "}<span className="k">return</span> ai.<span className="m">explain</span>(q.code());
            </span>
            <span className="code-line" style={{ "--i": 3 }}>
              {"}"}<span className="cursor" />
            </span>
          </pre>
          <span className="float-badge">✓ Answer ready · 3 tests generated</span>
        </div>
      </section>

      <section className="auth-form-wrap">
        <div className="tilt-wrap" onMouseMove={onMove} onMouseLeave={onLeave}>
          <div className="tilt-inner" ref={tiltRef}>
            <form className="auth-card" onSubmit={handleSubmit} noValidate>
              <h2 className="auth-title rise" style={{ "--i": 0 }}>Welcome back</h2>
              <p className="auth-sub rise" style={{ "--i": 1 }}>Sign in to continue to your workspace.</p>

              {error && <div className="alert alert-error" role="alert">{error}</div>}

              <div className="field rise" style={{ "--i": 2 }}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="field rise" style={{ "--i": 3 }}>
                <label htmlFor="password">Password</label>
                <div className="pw-wrap">
                  <input
                    id="password"
                    className="input"
                    type={showPw ? "text" : "password"}
                    placeholder="Your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw((s) => !s)}>
                    {showPw ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button className="btn btn-primary rise" style={{ "--i": 4 }} type="submit" disabled={loading}>
                {loading ? <span className="spin" /> : null}
                {loading ? "Signing in…" : "Sign in"}
              </button>

              <p className="auth-switch rise" style={{ "--i": 5 }}>
                New here? <Link to="/register">Create an account</Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}