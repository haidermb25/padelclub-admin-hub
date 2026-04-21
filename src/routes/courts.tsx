import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, LandPlot } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { courts as initial, type Court } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/courts")({
  component: CourtsPage,
  head: () => ({
    meta: [
      { title: "Courts — TheLAPadelClub Admin" },
      { name: "description", content: "Manage padel courts across all branches." },
    ],
  }),
});

const empty: Court = { id: "", name: "", type: "Indoor", branch: "Downtown", available: true };

function CourtsPage() {
  const [items, setItems] = useState<Court[]>(initial);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Court>(empty);
  const [editing, setEditing] = useState<string | null>(null);

  const save = () => {
    if (!draft.name.trim()) { toast.error("Name is required"); return; }
    if (editing) {
      setItems((prev) => prev.map((c) => c.id === editing ? draft : c));
      toast.success("Court updated");
    } else {
      const id = `C-${String(items.length + 1).padStart(2, "0")}`;
      setItems((prev) => [...prev, { ...draft, id }]);
      toast.success("Court added");
    }
    setOpen(false);
    setDraft(empty);
    setEditing(null);
  };

  const edit = (c: Court) => {
    setDraft(c);
    setEditing(c.id);
    setOpen(true);
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((c) => c.id !== id));
    toast.success("Court deleted");
  };

  return (
    <AdminShell title="Courts" subtitle={`${items.length} courts across all branches`}>
      <div className="flex justify-end mb-4">
        <Button onClick={() => { setDraft(empty); setEditing(null); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" /> Add Court
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((c) => (
          <Card key={c.id} className="p-5 hover:shadow-[var(--shadow-elevated)] transition-all hover:-translate-y-0.5">
            <div className="flex items-start justify-between mb-3">
              <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <LandPlot className="h-5 w-5" />
              </div>
              <Badge variant="outline" className={c.available ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"}>
                {c.available ? "Available" : "Unavailable"}
              </Badge>
            </div>
            <h3 className="font-bold text-lg">{c.name}</h3>
            <p className="text-sm text-muted-foreground">{c.branch} · {c.type}</p>
            <p className="font-mono text-[11px] text-muted-foreground mt-1">{c.id}</p>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" size="sm" className="flex-1" onClick={() => edit(c)}>
                <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => remove(c.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit court" : "Add new court"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Court name</Label>
              <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="e.g. Court Alpha" className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={draft.type} onValueChange={(v) => setDraft({ ...draft, type: v as Court["type"] })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indoor">Indoor</SelectItem>
                    <SelectItem value="Outdoor">Outdoor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Branch</Label>
                <Select value={draft.branch} onValueChange={(v) => setDraft({ ...draft, branch: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Downtown">Downtown</SelectItem>
                    <SelectItem value="Marina">Marina</SelectItem>
                    <SelectItem value="Westside">Westside</SelectItem>
                    <SelectItem value="Skyline">Skyline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Available for booking</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Toggle court availability</p>
              </div>
              <Switch checked={draft.available} onCheckedChange={(v) => setDraft({ ...draft, available: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>{editing ? "Save changes" : "Add court"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
