"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
const revenueData = [
  { date: "Sep 24", revenue: 12400 },
  { date: "Sep 25", revenue: 18200 },
  { date: "Sep 26", revenue: 15600 },
  { date: "Sep 27", revenue: 22400 },
  { date: "Sep 28", revenue: 19800 },
  { date: "Sep 29", revenue: 26400 },
  { date: "Sep 30", revenue: 28600 },
];
export default function Home() {
  const [authorized, setAuthorized] = useState(false);

useEffect(() => {
  const user = localStorage.getItem("nexus-user");

  if (!user) {
    window.location.href = "/login";
    return;
  }

  setAuthorized(true);
}, []);

if (!authorized) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      Checking authentication...
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 bg-gray-900 border-r border-gray-800 flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">Nexus Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Management Portal</p>
        </div>

        <nav className="p-4 space-y-2">
          <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white">
            Dashboard
          </button>

         <a
  href="/customers"
  className="block px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800"
>
  Customers
</a>

        </nav>

        <div className="mt-auto p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="font-medium">Admin User</p>
            <p className="text-sm text-gray-400">admin@nexus.com</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        {/* Header */}
        <header className="h-20 border-b border-gray-800 bg-gray-950 flex items-center justify-between px-6 lg:px-10">
          <div>
            <h2 className="text-2xl font-semibold">Dashboard</h2>
            <p className="text-sm text-gray-400">
              Overview of your business performance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>

            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Revenue</p>
              <h3 className="text-3xl font-bold mt-2">$128,420</h3>
              <p className="text-green-400 text-sm mt-2">+12.5%</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Orders</p>
              <h3 className="text-3xl font-bold mt-2">1,284</h3>
              <p className="text-green-400 text-sm mt-2">+8.2%</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Customers</p>
              <h3 className="text-3xl font-bold mt-2">842</h3>
              <p className="text-green-400 text-sm mt-2">+18.4%</p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <p className="text-gray-400 text-sm">Conversion</p>
              <h3 className="text-3xl font-bold mt-2">4.8%</h3>
              <p className="text-green-400 text-sm mt-2">+0.7%</p>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-8">
            <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-[360px]">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">Revenue Overview</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Revenue performance over time
                  </p>
                </div>

                <button className="text-sm border border-gray-700 px-3 py-2 rounded-lg hover:bg-gray-800">
                  View report
                </button>
              </div>

              <div className="h-[260px] mt-6">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={revenueData}>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#1f2937"
        vertical={false}
      />

      <XAxis
        dataKey="date"
        stroke="#6b7280"
        tickLine={false}
        axisLine={false}
      />

      <YAxis
        stroke="#6b7280"
        tickLine={false}
        axisLine={false}
        tickFormatter={(value) => `$${value / 1000}k`}
      />

      <Tooltip
        contentStyle={{
          backgroundColor: "#111827",
          border: "1px solid #374151",
          borderRadius: "10px",
        }}
      />

      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#3b82f6"
        strokeWidth={3}
        fill="#3b82f633"
      />
    </AreaChart>
  </ResponsiveContainer>
</div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-semibold">Recent Activity</h3>
              <p className="text-sm text-gray-400 mt-1">
                Latest system updates
              </p>

              <div className="mt-6 space-y-6">
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 mt-2"></div>
                  <div>
                    <p className="font-medium">New customer registered</p>
                    <p className="text-sm text-gray-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-2"></div>
                  <div>
                    <p className="font-medium">Order #1048 completed</p>
                    <p className="text-sm text-gray-500">18 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mt-2"></div>
                  <div>
                    <p className="font-medium">Customer profile updated</p>
                    <p className="text-sm text-gray-500">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
