import { getJSONServer } from "@/lib/fetcher";
import { fmtDateTime } from "@/lib/format";


export default async function ConversationsPage() {
  const data = await getJSONServer(`/api/b/conversations?page=1&page_size=20`);
  // ... (resto igual)
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Conversaciones</h1>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Inicio</th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((c: any) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{c.id}</td>
                <td className="p-3">{c.customer_id || "-"}</td>
                <td className="p-3">{c.state || "-"}</td>
                <td className="p-3">{fmtDateTime(c.started_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-500">Total: {data.total}</div>
      </div>
    </div>
  );
}
