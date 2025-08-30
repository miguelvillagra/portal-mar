"use client";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";

type Point = { bucket_start: string; value: number };

export default function TrafficLine({ data }: { data: Point[] }) {
  const mapped = (data || []).map(d => ({
    x: format(new Date(d.bucket_start), "dd/MM"),
    y: d.value || 0,
  }));
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={mapped}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="y" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
