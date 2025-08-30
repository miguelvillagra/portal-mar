"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type NextAction = { label: string; to: string };
const NEXT: Record<string, NextAction[]> = {
  pending:   [{ label: "Confirmar", to: "confirmed" }, { label: "Cancelar", to: "cancelled" }],
  confirmed: [{ label: "Empacar",   to: "packing"   }, { label: "Cancelar", to: "cancelled" }],
  packing:   [{ label: "Enviar",    to: "shipped"   }, { label: "Cancelar", to: "cancelled" }],
  shipped:   [{ label: "Entregar",  to: "delivered" }, { label: "Cancelar", to: "cancelled" }],
  delivered: [],
  cancelled: [],
};

const BTN = "px-3 py-2 rounded-lg text-sm font-medium transition border shadow-sm";
const BTN_PRIMARY = `${BTN} bg-gray-900 text-white hover:bg-black`;
const BTN_SECOND = `${BTN} bg-white text-gray-700 hover:bg-gray-50 border-gray-200`;

export default function OrderActions({
  orderId,
  canPay,
  currentStatus,
}: {
  orderId: string;
  canPay: boolean;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<"status" | "pay" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showPayForm, setShowPayForm] = useState(false);
  const [payMethod, setPayMethod] = useState<"tarjeta" | "efectivo" | "transferencia">("tarjeta");
  const [payAmount, setPayAmount] = useState<string>("");
  const [payRef, setPayRef] = useState<string>("");

  async function patchStatus(nextTo: string) {
    try {
      setError(null);
      setLoading("status");
      const r = await fetch(`/api/b/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to_status: nextTo }), // <- IMPORTANTE
      });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || "Error al cambiar estado");
      }
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(null);
    }
  }

  async function submitPayment() {
    if (!payAmount || isNaN(Number(payAmount)) || Number(payAmount) <= 0) {
      setError("Monto inválido");
      return;
    }
    try {
      setError(null);
      setLoading("pay");
      const r = await fetch(`/api/b/orders/${orderId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(payAmount),
          method: payMethod,
          reference: payRef || undefined,
        }),
      });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(txt || "Error al registrar pago");
      }
      setShowPayForm(false);
      setPayAmount("");
      setPayRef("");
      router.refresh();
    } catch (e: any) {
      setError(e?.message || "Error");
    } finally {
      setLoading(null);
    }
  }

  const nextOptions = NEXT[currentStatus] ?? [];

  return (
    <div className="space-y-3">
      {/* Botones de estado */}
      <div className="flex flex-wrap gap-2 items-center">
        {nextOptions.length === 0 ? (
          <span className="text-sm text-gray-500">Sin acciones para este estado.</span>
        ) : (
          nextOptions.map((opt) => (
            <button
              key={opt.to}
              disabled={loading === "status"}
              onClick={() => patchStatus(opt.to)}
              className={opt.to === "cancelled" ? BTN_SECOND : BTN_PRIMARY}
              title={`Cambiar a: ${opt.to}`}
            >
              {loading === "status" ? "Guardando..." : opt.label}
            </button>
          ))
        )}

        {/* Registrar pago */}
        <button
          disabled={!canPay || loading === "pay"}
          onClick={() => setShowPayForm((v) => !v)}
          className={BTN_SECOND + (canPay ? "" : " opacity-50 cursor-not-allowed")}
          title={!canPay ? "Ya está pagado" : "Registrar un pago"}
        >
          {showPayForm ? "Cerrar pago" : "Registrar pago"}
        </button>
      </div>

      {/* Formulario inline de pago */}
      {showPayForm && (
        <div className="p-3 rounded-xl border bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Método</label>
              <select
                className="w-full border rounded-lg p-2"
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
              >
                <option value="tarjeta">Tarjeta</option>
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Monto</label>
              <input
                type="number"
                min={0}
                step="1"
                className="w-full border rounded-lg p-2"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                placeholder="Ej: 10000"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Referencia (opcional)</label>
              <input
                type="text"
                className="w-full border rounded-lg p-2"
                value={payRef}
                onChange={(e) => setPayRef(e.target.value)}
                placeholder="voucher, comprobante..."
              />
            </div>
          </div>
          <div className="mt-3">
            <button
              disabled={loading === "pay"}
              onClick={submitPayment}
              className={BTN_PRIMARY}
            >
              {loading === "pay" ? "Registrando..." : "Confirmar pago"}
            </button>
          </div>
        </div>
      )}

      {error && <div className="text-red-600 text-xs">{error}</div>}
    </div>
  );
}
