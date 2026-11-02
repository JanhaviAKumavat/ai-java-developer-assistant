import api from "./api";

export const MODES = [
  {
    id: "ask",
    label: "Ask",
    icon: "✦",
    placeholder: "Ask anything about your code, e.g. What does this method do?",
    suggestions: ["Explain what this code does", "Find bugs in this code", "How can I improve this code?"],
  },
  {
    id: "error",
    label: "Explain error",
    icon: "⚠",
    placeholder: "Paste the exception or stack trace here…",
    suggestions: ["Explain this NullPointerException", "Why does this exception happen?", "How do I fix this error?"],
  },
  {
    id: "tests",
    label: "Generate tests",
    icon: "✓",
    placeholder: "Optional: extra instructions, e.g. cover null and negative values",
    suggestions: ["Cover null and negative values", "Include tests for expected exceptions", "Use Mockito for dependencies"],
  },
];

const ENDPOINTS = {
  ask: "/api/assistant/ask",
  error: "/api/assistant/explain-error",
  tests: "/api/assistant/generate-tests",
};

export async function sendMessage(mode, payload) {
  const { data } = await api.post(ENDPOINTS[mode], payload);
  return data; // { answer, conversationId }
}

export async function listConversations(userId) {
  const { data } = await api.get("/api/conversations", { params: { userId } });
  return data;
}

export async function getConversation(id, userId) {
  const { data } = await api.get(`/api/conversations/${id}`, { params: { userId } });
  return data;
}

/* ---- Local preferences (Settings page) ---- */
const PREFS_KEY = "devassist_prefs";
const DEFAULT_PREFS = { defaultMode: "ask", saveHistory: true };

export function getPrefs() {
  try {
    return { ...DEFAULT_PREFS, ...JSON.parse(localStorage.getItem(PREFS_KEY)) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}