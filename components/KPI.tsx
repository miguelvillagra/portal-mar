export function KPI({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
