import { createFileRoute } from "@tanstack/react-router";
import { Users, CalendarCheck, XCircle, DollarSign, Activity, Download } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminShell } from "@/components/layout/AdminShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  registrations,
  bookings,
  payments,
  trendData,
  monthlyData,
  branchDistribution,
  recentActivity,
} from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Dashboard — TheLAPadelClub Admin" },
      { name: "description", content: "Admin analytics overview for TheLAPadelClub padel game management." },
    ],
  }),
});

const PIE_COLORS = ["oklch(0.72 0.22 145)", "oklch(0.6 0.15 200)", "oklch(0.78 0.18 75)", "oklch(0.65 0.2 300)"];

function Dashboard() {
  const totalReg = registrations.length;
  const cancelledReg = registrations.filter((r) => r.status === "cancelled").length;
  const activeUsers = registrations.filter((r) => r.status === "active").length;
  const totalBookings = bookings.length;
  const revenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <AdminShell title="Dashboard Overview" subtitle="Welcome back — here's what's happening at the club today.">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
        <StatCard label="Total Registrations" value={totalReg} delta={12.4} icon={Users} accent="primary" />
        <StatCard label="Active Users" value={activeUsers} delta={8.1} icon={Activity} accent="info" />
        <StatCard label="Total Bookings" value={totalBookings} delta={18.7} icon={CalendarCheck} accent="primary" />
        <StatCard label="Cancelled" value={cancelledReg} delta={-3.2} icon={XCircle} accent="destructive" />
        <StatCard label="Revenue" value={`$${revenue.toLocaleString()}`} delta={22.3} icon={DollarSign} accent="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Registration & Booking Trends</h3>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => exportToCSV("trends", trendData)}>
              <Download className="h-3.5 w-3.5 mr-1.5" /> Export
            </Button>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.22 145)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.72 0.22 145)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.6 0.15 200)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.6 0.15 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
                <XAxis dataKey="date" stroke="oklch(0.5 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.02 240)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(1 0 0)",
                    border: "1px solid oklch(0.9 0.01 240)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="registrations" stroke="oklch(0.72 0.22 145)" strokeWidth={2} fill="url(#g1)" />
                <Area type="monotone" dataKey="bookings" stroke="oklch(0.6 0.15 200)" strokeWidth={2} fill="url(#g2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-1">Bookings by Branch</h3>
          <p className="text-xs text-muted-foreground mb-3">Distribution across locations</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={branchDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {branchDistribution.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.9 0.01 240)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Monthly Registrations vs Cancellations</h3>
              <p className="text-xs text-muted-foreground">This year</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
                <XAxis dataKey="month" stroke="oklch(0.5 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.5 0.02 240)" fontSize={11} />
                <Tooltip contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.9 0.01 240)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="registrations" fill="oklch(0.72 0.22 145)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="cancelled" fill="oklch(0.6 0.22 27)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a) => (
              <div key={a.id} className="flex gap-3 items-start text-sm">
                <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-foreground/90 leading-snug">{a.text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 capitalize">{a.type}</Badge>
                    <span className="text-[11px] text-muted-foreground">{a.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
