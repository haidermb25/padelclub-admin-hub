import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, CreditCard, DollarSign, CheckCircle2, Clock } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { payments } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export";

export const Route = createFileRoute("/payments")({
  component: PaymentsPage,
  head: () => ({
    meta: [
      { title: "Payments — TheLAPadelClub Admin" },
      { name: "description", content: "Track all payment transactions and refunds." },
    ],
  }),
});

function PaymentsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => payments.filter((p) => {
    const m = !q || p.id.toLowerCase().includes(q.toLowerCase()) || p.bookingId.toLowerCase().includes(q.toLowerCase()) || p.user.toLowerCase().includes(q.toLowerCase());
    const s = status === "all" || p.status === status;
    return m && s;
  }), [q, status]);

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const pendingAmount = payments.filter((p) => p.status === "pending").reduce((s, p) => s + p.amount, 0);
  const refunded = payments.filter((p) => p.status === "refunded").length;

  return (
    <AdminShell title="Payments & Transactions" subtitle="All payment activity across the system">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Revenue" value={`$${totalPaid.toLocaleString()}`} delta={18.4} icon={DollarSign} accent="primary" />
        <StatCard label="Successful Payments" value={payments.filter((p) => p.status === "paid").length} delta={12.1} icon={CheckCircle2} accent="info" />
        <StatCard label="Pending" value={`$${pendingAmount}`} icon={Clock} accent="warning" />
        <StatCard label="Refunded" value={refunded} icon={CreditCard} accent="destructive" />
      </div>

      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by payment, booking, or user..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportToCSV("payments", filtered)}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState icon={CreditCard} title="No payments found" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Booking</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-muted/40">
                    <TableCell className="font-mono text-xs">{p.id}</TableCell>
                    <TableCell className="font-mono text-xs">{p.bookingId}</TableCell>
                    <TableCell className="font-medium">{p.user}</TableCell>
                    <TableCell className="font-semibold">${p.amount}</TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="text-sm">{new Date(p.date).toLocaleDateString()}</TableCell>
                    <TableCell><StatusBadge status={p.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </AdminShell>
  );
}
