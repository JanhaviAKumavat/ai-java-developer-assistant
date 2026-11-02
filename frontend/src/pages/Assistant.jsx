import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import FileUpload from "../components/FileUpload.jsx";
import { MODES, getConversation, getPrefs, sendMessage } from "../services/assistantService.js";
import { DEFAULT_TEST_INSTRUCTIONS, buildUserText, formatCode } from "../utils/formatCode.js";

export default function Assistant() {
  const { user } = useAuth();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [prefs] = useState(getPrefs);

  const [mode, setMode] = useState(() => {
    const fromUrl = searchParams.get("mode");
    return MODES.some((m) => m.id === fromUrl) ? fromUrl : prefs.defaultMode;
  });
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [question, setQuestion] = useState("");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState("");

  const currentMode = MODES.find((m) => m.id === mode);
  const codeVisible = showCode || code || mode === "tests";
  const chatParam = searchParams.get("c");
  const fresh = location.state?.fresh;

  const resetChat = () => {
    setMessages([]);
    setConversationId(null);
    setQuestion("");
    setCode("");
    setFileName("");
    setShowCode(false);
    setError("");
    setSearchParams({}, { replace: true });
  };

  // "New chat" button / dashboard cards
  useEffect(() => {
    if (!fresh) return;
    const requested = searchParams.get("mode");
    if (MODES.some((m) => m.id === requested)) setMode(requested);
    resetChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh]);

  // Open a saved conversation from History
  useEffect(() => {
    if (!chatParam) return;
    let cancelled = false;
    setLoadingChat(true);
    setError("");
    getConversation(chatParam, user.id)
      .then((data) => {
        if (cancelled) return;
        setConversationId(data.id);
        setMessages(data.messages.map((m) => ({ role: m.role.toLowerCase(), content: m.content })));
      })
      .catch((e) => !cancelled && setError(e.message))
      .finally(() => !cancelled && setLoadingChat(false));
    return () => {
      cancelled = true;
    };
  }, [chatParam, user.id]);

  const handleSend = async () => {
    if (loading || loadingChat) return;

    const q = question.trim();
    const c = formatCode(code);

    if (mode === "tests" && !c) {
      setError("Add or upload the Java code you want tests for.");
      return;
    }
    if (mode !== "tests" && !q) {
      setError(mode === "error" ? "Paste the error or stack trace first." : "Type your question first.");
      return;
    }

    const payload = {
      question: q || DEFAULT_TEST_INSTRUCTIONS,
      code: c || null,
      userId: prefs.saveHistory ? user.id : null,
      conversationId: prefs.saveHistory ? conversationId : null,
    };

    setMessages((prev) => [...prev, { role: "user", content: buildUserText(mode, payload.question, c) }]);
    setQuestion("");
    setError("");
    setLoading(true);

    try {
      const data = await sendMessage(mode, payload);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      if (data.conversationId) setConversationId(data.conversationId);
    } catch (e) {
      setMessages((prev) => prev.slice(0, -1)); // remove the unsent message
      setQuestion(q);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="assistant">
      <div className="assistant-head reveal">
        <div className="tabs" role="tablist">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              className={`tab ${mode === m.id ? "active" : ""}`}
              onClick={() => setMode(m.id)}
            >
              {m.icon} {m.label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost btn-sm" onClick={resetChat}>
          ＋ New chat
        </button>
      </div>

      <ChatWindow
        messages={messages}
        loading={loading || loadingChat}
        loadingLabel={loadingChat ? "Loading conversation…" : "Thinking…"}
        suggestions={currentMode.suggestions}
        onSuggestion={setQuestion}
      />

      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 0 }}>{error}</div>}

      <div className="composer">
        <div className="composer-top">
          <FileUpload
            userId={user.id}
            fileName={fileName}
            onLoaded={(res) => {
              setCode(res.content);
              setFileName(res.fileName);
              setShowCode(true);
            }}
            onClear={() => {
              setCode("");
              setFileName("");
            }}
          />
          {!codeVisible && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowCode(true)}>
              ＋ Paste code
            </button>
          )}
        </div>

        {codeVisible && (
          <div className="code-box">
            <textarea
              className="textarea code"
              style={{ width: "100%" }}
              rows={5}
              placeholder="Paste your Java code here…"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            {code && (
              <button type="button" className="link-btn" onClick={() => { setCode(""); setFileName(""); }}>
                Clear code
              </button>
            )}
          </div>
        )}

        <div className="composer-row">
          <textarea
            className="textarea"
            rows={2}
            placeholder={currentMode.placeholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="btn btn-primary send-btn"
            onClick={handleSend}
            disabled={loading || loadingChat}
            aria-label="Send"
          >
            {loading ? <span className="spin" /> : "➤"}
          </button>
        </div>
        <span className="hint">
          Ctrl + Enter to send. Each question is answered on its own, so keep the code in the box for follow-ups.
        </span>
      </div>
    </div>
  );
}