"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie,
  Cell, Legend,
} from "recharts";

const COLORS = ["#f59e0b", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444"];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function DashboardCharts({
  bookings,
}: {
  bookings: { price: number; status: string; createdAt: Date }[];
}) {
  // Monthly revenue bar chart
  const monthlyMap: Record<string, { month: string; revenue: number; orders: number }> = {};
  bookings.forEach((b) => {
    const month = MONTHS[new Date(b.createdAt).getMonth()];
    if (!monthlyMap[month]) monthlyMap[month] = { month, revenue: 0, orders: 0 };
    monthlyMap[month].revenue += b.price;
    monthlyMap[month].orders += 1;
  });
  const barData = Object.values(monthlyMap);

  // Status pie chart
  const statusMap: Record<string, number> = {};
  bookings.forEach((b) => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });
  const pieData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <h3 className="font-semibold mb-4">Monthly Revenue</h3>
        {barData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]} />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl p-5 border shadow-sm">
        <h3 className="font-semibold mb-4">Order Status</h3>
        {pieData.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-12">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}