import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card.component";
export default function RequestsChart({ data }) {
  // If no data, show a message
  if (!data || data.length === 0) {
    return (
      <Card className="mt-8 mb-8">
        <CardHeader>
          <CardTitle className="text-xl">Weekly Requests Trend</CardTitle>
          <p className="text-sm text-slate-500">
            Number of document requests this week
          </p>
        </CardHeader>
        <CardContent className="h-72 flex items-center justify-center">
          <p className="text-slate-400">No data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Weekly Requests Trend</CardTitle>
        <p className="text-sm text-slate-500">
          Number of document requests this week
        </p>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#0f172a"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
