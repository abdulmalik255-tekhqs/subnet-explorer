export default function StatusBadge({ status }) {
  const ok = String(status).toLowerCase() === "success";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
        ok ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
      }`}
    >
      {ok ? "✓ Success" : "✗ Failed"}
    </span>
  );
}
