"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function BarOrdersByStatus({ data }: { data: { status: string; count: number }[] }) {
  const rows = data.map(d => ({ x: d.status, y: d.count }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="x" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="y" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
