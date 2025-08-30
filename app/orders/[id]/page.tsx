// app/orders/[id]/page.tsx
import OrderActions from "./_actions";
import { getJSONServer } from "@/lib/fetcher";
import { fmtPYG, fmtDateTime } from "@/lib/format";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Next 15: params es async
  const { id } = await params;

  // 1) Traer el pedido
  const order = await getJSONServer(`/api/b/orders/${id}`);

  // 2) Si el backend no trae "customer", pedirlo por customer_id
  let customer = order.customer ?? null;
  if (!customer && order.customer_id) {
    try {
      customer = await getJSONServer(`/api/b/customers/${order.customer_id}`);
    } catch {
      /* ignoramos si falla; mostramos "—" */
    }
  }

  // 3) Normalizar ítems
  const items = (order.items ?? []).map((it: any) => {
    const product_name = it.product_name ?? it.name ?? it.name_snapshot ?? "—";
    const quantity = Number(it.quantity ?? it.qty ?? 0) || 0;
    const unit_price = Number(it.unit_price ?? it.price ?? 0) || 0;
    const product_id = it.product_id ?? it.id ?? null;
    const subtotal = quantity * unit_price;
    return { product_id, product_name, quantity, unit_price, subtotal };
  });

  // 4) Normalizar pagos
  const payments = (order.payments ?? []).map((p: any) => ({
    ...p,
    amount: Number(p.amount ?? 0) || 0,
  }));

  // 5) Total
  const total =
    Number(order.total ?? NaN) ||
    items.reduce((acc: number, it: any) => acc + it.subtotal, 0);

  return (
    <div className="space-y-6">
      {/* Header + acciones */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Pedido {order.id}</h1>
          <div className="text-sm text-gray-500">
            Creado: {order.created_at ? fmtDateTime(order.created_at) : "—"}
          </div>
        </div>
        <OrderActions
          orderId={order.id}
          canPay={order.payment_status !== "paid"}
          currentStatus={order.order_status}
        />
      </div>

      {/* Resumen */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b font-medium">Resumen</div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Cliente:</span>{" "}
            {customer?.name ?? customer?.display_name ?? "—"} ({customer?.wa_id ?? "—"})
          </div>
          <div>
            <span className="text-gray-500">Pago:</span>{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border">
              {order.payment_status ?? "—"}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Estado:</span>{" "}
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border">
              {order.order_status ?? "—"}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Total:</span>{" "}
            <strong>{fmtPYG(total)}</strong>
          </div>
          {order.payment_method && (
            <div className="col-span-1 md:col-span-2">
              <span className="text-gray-500">Método elegido:</span>{" "}
              {order.payment_method}
            </div>
          )}
        </div>
      </div>

      {/* Ítems */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b font-medium">Ítems</div>
        <div className="p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500">
                <th className="py-2">Producto</th>
                <th className="py-2">Cant</th>
                <th className="py-2">Precio</th>
                <th className="py-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((it: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="py-2">{it.product_name}</td>
                    <td className="py-2">{it.quantity}</td>
                    <td className="py-2">{fmtPYG(it.unit_price)}</td>
                    <td className="py-2">{fmtPYG(it.subtotal)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 text-center text-gray-500" colSpan={4}>
                    Sin ítems.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagos */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b font-medium">Pagos</div>
        <div className="p-4">
          {payments.length === 0 ? (
            <div className="text-sm text-gray-500">Sin pagos registrados.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Método</th>
                  <th className="py-2">Estado</th>
                  <th className="py-2">Monto</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p: any) => (
                  <tr key={p.id} className="border-t">
                    <td className="py-2">
                      {p.created_at ? fmtDateTime(p.created_at) : "—"}
                    </td>
                    <td className="py-2">{p.method ?? "—"}</td>
                    <td className="py-2">{p.status ?? "—"}</td>
                    <td className="py-2">{fmtPYG(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
