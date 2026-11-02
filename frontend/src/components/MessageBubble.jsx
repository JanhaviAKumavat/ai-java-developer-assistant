import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeViewer from "./CodeViewer.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const markdownComponents = {
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const text = String(children).replace(/\n$/, "");
    const match = /language-(\w+)/.exec(className || "");
    if (match || text.includes("\n")) {
      return <CodeViewer code={text} language={match ? match[1] : "text"} />;
    }
    return <code className="inline-code">{children}</code>;
  },
};

export default function MessageBubble({ role, content }) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const isUser = role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className={`msg ${isUser ? "user" : "assistant"}`}>
      <div className={`msg-avatar ${isUser ? "me" : "bot"}`}>
        {isUser ? (user?.name?.[0] || "U").toUpperCase() : "AI"}
      </div>
      <div className="msg-body">
        <div className="md">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {content}
          </ReactMarkdown>
        </div>
        {!isUser && (
          <button type="button" className="link-btn msg-copy" onClick={copy}>
            {copied ? "Copied ✓" : "Copy answer"}
          </button>
        )}
      </div>
    </div>
  );
}