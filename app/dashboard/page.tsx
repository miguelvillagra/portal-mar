import { getJSONServer } from "@/lib/fetcher";
import { KPI } from "@/components/KPI";
import { Card } from "@/components/Card";
import DateFilters from "@/components/DateFilters";
import LineMessages from "@/components/charts/LineMessages";
import BarOrdersByStatus from "@/components/charts/BarOrdersByStatus";



type Search = { from?: string; to?: string; tz?: string };

export default async function DashboardPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const from = sp.from ?? new Date(Date.now() - 7*86400000).toISOString().slice(0,19)+"Z";
  const to   = sp.to   ?? new Date().toISOString().slice(0,19)+"Z";
  const tz   = sp.tz   ?? "America/Asuncion";

  const [overview, traffic, byStatus, topProducts] = await Promise.all([
    getJSONServer(`/api/b/stats/overview?from=${from}&to=${to}&tz=${tz}`),
    getJSONServer(`/api/b/stats/traffic?metric=messages&bucket=daily&from=${from}&to=${to}&tz=${tz}`),
    getJSONServer(`/api/b/stats/orders_by_status?from=${from}&to=${to}&tz=${tz}`),
    getJSONServer(`/api/b/stats/top_products?from=${from}&to=${to}&tz=${tz}&limit=5&paid_only=true`),
  ]);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <DateFilters />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPI label="Mensajes" value={overview.messages} />
        <KPI label="Conversaciones" value={overview.conversations} />
        <KPI label="Pedidos" value={overview.orders} />
        <KPI label="Pagados" value={overview.paid_orders} />
        <KPI label="Revenue" value={overview.revenue} />
        <KPI label="Conversión %" value={overview.conversion_rate} />
      </div>

      <Card title="Mensajes por día">
        <LineMessages data={traffic.series ?? []} />
      </Card>

      <Card title="Pedidos por estado">
        <BarOrdersByStatus data={byStatus.buckets ?? []} />
      </Card>

      <Card title="Top productos">
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500">
              <tr><th className="py-2">Producto</th><th className="py-2">Cant</th><th className="py-2">Revenue</th></tr>
            </thead>
            <tbody>
            {(topProducts.products ?? []).map((p: any) => (
              <tr key={p.name} className="border-t">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.qty}</td>
                <td className="py-2">{Math.round(p.revenue).toLocaleString("es-PY")}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
