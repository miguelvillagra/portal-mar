export function StatusBadge({ value }: { value?: string | null }) {
  const v = (value || "").toLowerCase();
  const styles: Record<string, string> = {
    paid: "bg-green-100 text-green-700",
    unpaid: "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-100 text-gray-700",
    confirmed: "bg-blue-100 text-blue-700",
    packing: "bg-indigo-100 text-indigo-700",
    shipped: "bg-purple-100 text-purple-700",
    delivered: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const cls = styles[v] || "bg-gray-100 text-gray-700";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${cls}`}>{value || "-"}</span>;
}
