import { useRef, useState } from "react";
import { uploadFile } from "../services/fileService.js";
import { ALLOWED_EXTENSIONS, isAllowedFile } from "../utils/formatCode.js";

export default function FileUpload({ userId, fileName, onLoaded, onClear }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setError("");

    if (!isAllowedFile(file.name)) {
      setError(`Allowed: ${ALLOWED_EXTENSIONS.map((e) => "." + e).join(", ")}`);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("File is too large (max 2 MB).");
      return;
    }

    setBusy(true);
    try {
      const res = await uploadFile(file, userId);
      onLoaded(res);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <>
      {fileName ? (
        <span className="file-chip">
          📄 {fileName}
          <button type="button" onClick={onClear} aria-label="Remove file">✕</button>
        </span>
      ) : (
        <div
          className={`dropzone ${dragging ? "drag" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        >
          <span>⇪</span>
          <span>{busy ? "Uploading…" : "Upload file or drop it here"}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ALLOWED_EXTENSIONS.map((e) => "." + e).join(",")}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <span className="file-error">{error}</span>}
    </>
  );
}