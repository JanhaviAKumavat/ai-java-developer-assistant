import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import LoadingIndicator from "./LoadingIndicator.jsx";

export default function ChatWindow({ messages, loading, loadingLabel, suggestions = [], onSuggestion }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, loading]);

  return (
    <section className="chat" aria-live="polite">
      {messages.length === 0 && !loading && (
        <div className="chat-empty reveal">
          <div className="empty-orb">{"{ }"}</div>
          <h2>How can I help with your code?</h2>
          <p>Paste or upload Java code, then ask a question, explain an error, or generate tests.</p>
          <div className="chip-row">
            {suggestions.map((s) => (
              <button key={s} type="button" className="chip" onClick={() => onSuggestion(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} />
      ))}

      {loading && (
        <div className="msg assistant">
          <div className="msg-avatar bot">AI</div>
          <div className="msg-body">
            <LoadingIndicator label={loadingLabel} />
          </div>
        </div>
      )}

      <div ref={endRef} />
    </section>
  );
}