import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Download, Eye, CalendarCheck, XCircle } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { bookings as initialBookings, type Booking } from "@/lib/mock-data";
import { exportToCSV } from "@/lib/export";
import { toast } from "sonner";

export const Route = createFileRoute("/bookings")({
  component: BookingsPage,
  head: () => ({
    meta: [
      { title: "Bookings — TheLAPadelClub Admin" },
      { name: "description", content: "Manage court bookings, statuses and cancellations." },
    ],
  }),
});

const PER_PAGE = 10;

function BookingsPage() {
  const [items, setItems] = useState<Booking[]>(initialBookings);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Booking | null>(null);

  const filtered = useMemo(() => items.filter((b) => {
    const matchesQ = !q || b.id.toLowerCase().includes(q.toLowerCase()) || b.user.toLowerCase().includes(q.toLowerCase()) || b.court.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = status === "all" || b.status === status;
    return matchesQ && matchesStatus;
  }), [items, q, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const cancel = (id: string) => {
    setItems((prev) => prev.map((b) => b.id === id ? { ...b, status: "cancelled" } : b));
    toast.success(`Booking ${id} cancelled`);
    setSelected(null);
  };

  const updateStatus = (id: string, newStatus: Booking["status"]) => {
    setItems((prev) => prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
    toast.success(`Status updated to ${newStatus}`);
  };

  return (
    <AdminShell title="Bookings" subtitle={`${filtered.length} court bookings`}>
      <Card className="p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} placeholder="Search booking, user, or court..." className="pl-9" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(1); }}>
            <SelectTrigger className="w-full md:w-44"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => exportToCSV("bookings", filtered)}>
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {paginated.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No bookings found" description="Try adjusting your filters." />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Court</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Slot</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/40">
                      <TableCell className="font-mono text-xs">{b.id}</TableCell>
                      <TableCell className="font-medium">{b.user}</TableCell>
                      <TableCell>
                        <div>{b.court}</div>
                        <div className="text-xs text-muted-foreground">{b.branch}</div>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(b.date).toLocaleDateString()}</TableCell>
                      <TableCell className="text-sm">{b.slot}</TableCell>
                      <TableCell className="font-medium">${b.amount}</TableCell>
                      <TableCell><StatusBadge status={b.status} /></TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" onClick={() => setSelected(b)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {b.status !== "cancelled" && (
                            <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => cancel(b.id)}>
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-xs text-muted-foreground">Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
              </div>
            </div>
          </>
        )}
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">User</p><p className="font-medium mt-1">{selected.user}</p></div>
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p><div className="mt-1"><StatusBadge status={selected.status} /></div></div>
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Court</p><p className="font-medium mt-1">{selected.court}</p></div>
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Branch</p><p className="font-medium mt-1">{selected.branch}</p></div>
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Date</p><p className="font-medium mt-1">{new Date(selected.date).toLocaleDateString()}</p></div>
              <div><p className="text-[11px] uppercase tracking-wider text-muted-foreground">Slot</p><p className="font-medium mt-1">{selected.slot}</p></div>
              <div className="col-span-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Update status</p>
                <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as Booking["status"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            {selected && selected.status !== "cancelled" && (
              <Button variant="destructive" onClick={() => cancel(selected.id)}>Cancel booking</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
