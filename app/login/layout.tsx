// app/login/layout.tsx
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión — MAR Portal",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <div className="min-h-screen flex items-center justify-center p-4">
          {children}
        </div>
      </body>
    </html>
  );
}
