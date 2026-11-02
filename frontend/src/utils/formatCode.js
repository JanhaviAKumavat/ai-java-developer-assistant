export const ALLOWED_EXTENSIONS = ["java", "txt", "md", "xml", "properties"];

export const DEFAULT_TEST_INSTRUCTIONS =
  "Cover normal inputs, boundary values, and expected exceptions.";

/** Normalise code before sending it to the backend. */
export function formatCode(code = "") {
  return code
    .replace(/\r\n/g, "\n")
    .replace(/\t/g, "    ")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

export function isAllowedFile(fileName = "") {
  const ext = fileName.split(".").pop().toLowerCase();
  return ALLOWED_EXTENSIONS.includes(ext);
}

/** Mirrors the text the backend saves in history, so live and saved chats look the same. */
export function buildUserText(mode, question, code) {
  let head = question;
  if (mode === "error") head = `Explain this error:\n${question}`;
  if (mode === "tests") head = `Generate JUnit tests. ${question}`;
  return code ? `${head}\n\n\`\`\`java\n${code}\n\`\`\`` : head;
}

export function truncate(text = "", max = 60) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const date = d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const time = d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  return `${date} · ${time}`;
}