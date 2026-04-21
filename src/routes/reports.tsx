import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileBarChart, Users, CalendarCheck, XCircle, DollarSign } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { registrations, bookings, payments, trendData } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export";

export const Route = createFileRoute("/reports")({
  component: ReportsPage,
  head: () => ({
    meta: [
      { title: "Reports — TheLAPadelClub Admin" },
      { name: "description", content: "Generate and download analytics reports." },
    ],
  }),
});

const today = new Date().toISOString().slice(0, 10);
const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

function ReportsPage() {
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);
  const [type, setType] = useState("registrations");

  const filteredReg = useMemo(() => registrations.filter((r) => r.registeredAt >= from && r.registeredAt <= to + "T23:59:59"), [from, to]);
  const filteredBook = useMemo(() => bookings.filter((b) => b.date >= from && b.date <= to + "T23:59:59"), [from, to]);
  const filteredPay = useMemo(() => payments.filter((p) => p.date >= from && p.date <= to + "T23:59:59"), [from, to]);
  const cancelled = filteredReg.filter((r) => r.status === "cancelled");
  const revenue = filteredPay.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  const handleExport = () => {
    if (type === "registrations") exportToCSV("registrations-report", filteredReg);
    else if (type === "bookings") exportToCSV("bookings-report", filteredBook);
    else if (type === "cancellations") exportToCSV("cancellations-report", cancelled);
    else if (type === "revenue") exportToCSV("revenue-report", filteredPay.filter((p) => p.status === "paid"));
  };

  return (
    <AdminShell title="Reports & Analytics" subtitle="Generate, filter, and download operational reports">
      <Card className="p-5 mb-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2"><FileBarChart className="h-4 w-4 text-primary" /> Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <Label>Report type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="registrations">New Registrations</SelectItem>
                <SelectItem value="cancellations">Cancelled Registrations</SelectItem>
                <SelectItem value="bookings">Bookings</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>From</Label>
            <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>To</Label>
            <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1.5" />
          </div>
          <div className="flex items-end">
            <Button className="w-full" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryTile label="Registrations" value={filteredReg.length} icon={Users} />
        <SummaryTile label="Bookings" value={filteredBook.length} icon={CalendarCheck} />
        <SummaryTile label="Cancellations" value={cancelled.length} icon={XCircle} />
        <SummaryTile label="Revenue" value={`$${revenue.toLocaleString()}`} icon={DollarSign} />
      </div>

      <Card className="p-5 mb-6">
        <h3 className="font-semibold mb-4">Trend overview</h3>
        <div className="h-80">
          <ResponsiveContainer>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 240)" />
              <XAxis dataKey="date" stroke="oklch(0.5 0.02 240)" fontSize={11} />
              <YAxis stroke="oklch(0.5 0.02 240)" fontSize={11} />
              <Tooltip contentStyle={{ background: "oklch(1 0 0)", border: "1px solid oklch(0.9 0.01 240)", borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="registrations" stroke="oklch(0.72 0.22 145)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="bookings" stroke="oklch(0.6 0.15 200)" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="revenue" stroke="oklch(0.78 0.18 75)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Quick exports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button variant="outline" className="justify-start" onClick={() => exportToCSV("all-registrations", registrations)}>
            <Download className="h-4 w-4 mr-2" /> All registrations
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => exportToCSV("all-bookings", bookings)}>
            <Download className="h-4 w-4 mr-2" /> All bookings
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => exportToCSV("all-cancellations", registrations.filter((r) => r.status === "cancelled"))}>
            <Download className="h-4 w-4 mr-2" /> Cancellations
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => exportToCSV("all-payments", payments)}>
            <Download className="h-4 w-4 mr-2" /> All payments
          </Button>
        </div>
      </Card>
    </AdminShell>
  );
}

function SummaryTile({ label, value, icon: Icon }: { label: string; value: string | number; icon: typeof Users }) {
  return (
    <Card className="p-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="text-xl font-bold truncate">{value}</p>
      </div>
    </Card>
  );
}
