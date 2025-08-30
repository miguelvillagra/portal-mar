"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

type Props = {
  defaultFrom?: string;   // ISO (ej: 2025-08-20T00:00:00Z)
  defaultTo?: string;     // ISO
  defaultTz?: string;     // ej: America/Asuncion
};

function toLocalInputValue(iso?: string) {
  if (!iso) return "";
  // tomamos solo la parte de fecha para <input type="date">
  return new Date(iso).toISOString().slice(0, 10);
}

export default function DateRangeControls({ defaultFrom, defaultTo, defaultTz = "America/Asuncion" }: Props) {
  const sp = useSearchParams();
  const router = useRouter();

  const [from, setFrom] = useState(toLocalInputValue(sp.get("from") || defaultFrom));
  const [to, setTo] = useState(toLocalInputValue(sp.get("to") || defaultTo));
  const [tz, setTz] = useState(sp.get("tz") || defaultTz);

  useEffect(() => {
    // sync si cambian por URL externa
    setFrom(toLocalInputValue(sp.get("from") || defaultFrom));
    setTo(toLocalInputValue(sp.get("to") || defaultTo));
    setTz(sp.get("tz") || defaultTz);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  function apply() {
    const params = new URLSearchParams(sp.toString());
    if (from) params.set("from", new Date(from).toISOString());
    if (to) params.set("to", new Date(to).toISOString());
    params.set("tz", tz || "America/Asuncion");
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div>
        <label className="block text-xs text-gray-500">Desde</label>
        <input type="date" className="border rounded p-2 text-sm" value={from || ""} onChange={e=>setFrom(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Hasta</label>
        <input type="date" className="border rounded p-2 text-sm" value={to || ""} onChange={e=>setTo(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-500">Zona</label>
        <input type="text" className="border rounded p-2 text-sm w-56" value={tz} onChange={e=>setTz(e.target.value)} />
      </div>
      <button onClick={apply} className="bg-black text-white px-3 py-2 rounded text-sm">
        Aplicar
      </button>
    </div>
  );
}
