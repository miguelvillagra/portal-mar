import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MAR Portal",
  description: "Panel interno para agentes y admins",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="flex min-h-screen">
          <aside className="w-64 bg-white border-r">
            <div className="p-4 font-semibold">MAR Portal</div>
            <nav className="px-4 space-y-2 text-sm">
              <Link className="block p-2 rounded hover:bg-gray-100" href="/dashboard">Dashboard</Link>
              <Link className="block p-2 rounded hover:bg-gray-100" href="/orders">Pedidos</Link>
              <Link className="block p-2 rounded hover:bg-gray-100" href="/conversations">Conversaciones</Link>
              <Link className="block p-2 rounded hover:bg-gray-100" href="/customers">Clientes</Link>
            </nav>
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
