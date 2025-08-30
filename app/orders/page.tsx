import Link from "next/link";
import { getJSONServer } from "@/lib/fetcher";
import { fmtPYG, fmtDateTime } from "@/lib/format";
import { StatusBadge } from "@/components/StatusBadge";


export default async function OrdersPage() {
  const data = await getJSONServer(`/api/b/orders?page=1&page_size=20`);
  // ... (resto igual)
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Pedidos</h1>
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr className="text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Total</th>
              <th className="p-3">Pago</th>
              <th className="p-3">Estado</th>
              <th className="p-3">Creado</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {data.data.map((o: any) => (
              <tr key={o.id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-mono text-xs">{o.id}</td>
                <td className="p-3">{fmtPYG(o.total)}</td>
                <td className="p-3"><StatusBadge value={o.payment_status} /></td>
                <td className="p-3"><StatusBadge value={o.order_status} /></td>
                <td className="p-3">{fmtDateTime(o.created_at)}</td>
                <td className="p-3 text-right">
                  <Link href={`/orders/${o.id}`} className="text-blue-600 hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-3 text-xs text-gray-500">Total: {data.total}</div>
      </div>
    </div>
  );
}
