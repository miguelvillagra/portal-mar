"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Bucket = { status: string; count: number };

export default function OrdersStatusBar({ buckets }: { buckets: Bucket[] }) {
  const data = (buckets || []).map(b => ({ x: b.status, y: b.count || 0 }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="y" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
