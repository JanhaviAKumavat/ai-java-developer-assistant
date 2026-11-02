export default function LoadingIndicator({ label = "Thinking…" }) {
  return (
    <div className="loading" role="status">
      <span className="typing">
        <span />
        <span />
        <span />
      </span>
      <span>{label}</span>
    </div>
  );
}