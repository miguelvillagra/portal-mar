"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

function isoShort(d: Date) {
  return d.toISOString().slice(0, 19) + "Z";
}
function lastNDays(n: number) {
  const to = new Date();
  const from = new Date(to.getTime() - n * 86400000);
  return { from: isoShort(from), to: isoShort(to) };
}

export default function DateFilters() {
  const sp = useSearchParams();
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const tz = sp.get("tz") || "America/Asuncion";

  useEffect(() => {
    const f = sp.get("from"); const t = sp.get("to");
    if (f && t) { setFrom(f); setTo(t); }
    else {
      const { from, to } = lastNDays(7);
      setFrom(from); setTo(to);
      // no navegamos aún, dejamos que el SSR tenga defaults también
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const apply = () => {
    const q = new URLSearchParams({ from, to, tz }).toString();
    router.push(`/dashboard?${q}`);
  };

  return (
    <div className="flex items-end gap-2 flex-wrap">
      <div>
        <label className="block text-xs text-gray-500 mb-1">Desde</label>
        <input className="border rounded p-2 text-sm" value={from} onChange={e=>setFrom(e.target.value)} />
      </div>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Hasta</label>
        <input className="border rounded p-2 text-sm" value={to} onChange={e=>setTo(e.target.value)} />
      </div>
      <button onClick={apply} className="px-3 py-2 bg-black text-white rounded text-sm">Aplicar</button>
      <div className="ml-auto flex gap-1">
        {[7,14,30].map(n=>(
          <button key={n} onClick={()=>{
            const r=lastNDays(n);
            setFrom(r.from); setTo(r.to);
            const q = new URLSearchParams({ from:r.from, to:r.to, tz }).toString();
            router.push(`/dashboard?${q}`);
          }} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">{n} días</button>
        ))}
      </div>
    </div>
  );
}
