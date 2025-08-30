// app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/dashboard";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Podrías enviar `remember` si luego quieres ajustar expiración en backend
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Error al iniciar sesión");
      router.push(next);
    } catch (err: any) {
      setError(err.message || "Error inesperado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Marca */}
      <div className="flex items-center justify-center mb-6">
        <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
          <div className="h-5 w-5 rounded-full bg-blue-400" />
        </div>
        <div className="ml-3 text-2xl font-semibold tracking-tight">
          Mar Insumos
        </div>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 shadow-2xl backdrop-blur">
        <div className="px-6 pt-6">
          <h1 className="text-lg font-semibold">Inicia sesión en tu cuenta</h1>
          <p className="mt-1 text-sm text-slate-400">
            Usa tus credenciales de administrador o agente.
          </p>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6 pt-4 space-y-4">
          {error && (
            <div className="text-sm rounded-md border border-red-500/30 bg-red-500/10 text-red-300 px-3 py-2">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm text-slate-300">Correo</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm text-slate-300">Contraseña</label>
              <a
                className="text-xs text-blue-400 hover:text-blue-300"
                href="#"
                onClick={(e) => e.preventDefault()}
                title="Próximamente"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500"
              />
              Recordarme
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-white font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>

          <p className="text-xs text-slate-400 text-center">
            ¿No tienes cuenta? <span className="text-slate-300">Solicita acceso al admin</span>
          </p>
        </form>
      </div>
    </div>
  );
}
