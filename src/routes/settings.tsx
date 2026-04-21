import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Save, Settings as SettingsIcon, Clock, Ban, Bell } from "lucide-react";
import { AdminShell } from "@/components/layout/AdminShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
  head: () => ({
    meta: [
      { title: "Settings — TheLAPadelClub Admin" },
      { name: "description", content: "System configuration, booking rules and policies." },
    ],
  }),
});

function SettingsPage() {
  const [config, setConfig] = useState({
    slotDuration: "90",
    openingTime: "08:00",
    closingTime: "23:00",
    maxAdvanceDays: "14",
    minBookingLead: "60",
    cancellationWindow: "24",
    refundPolicy: "Bookings cancelled at least 24 hours before the slot are eligible for a full refund. Cancellations within 24 hours are non-refundable.",
    allowGuestBooking: false,
    requireDeposit: true,
    notifyEmail: true,
    notifySms: false,
  });

  const save = () => toast.success("Settings saved successfully");

  return (
    <AdminShell title="Settings" subtitle="System configuration & booking policies">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Time Slots</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Default slot duration (minutes)</Label>
              <Select value={config.slotDuration} onValueChange={(v) => setConfig({ ...config, slotDuration: v })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                  <SelectItem value="120">120 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Opening time</Label>
                <Input type="time" value={config.openingTime} onChange={(e) => setConfig({ ...config, openingTime: e.target.value })} className="mt-1.5" />
              </div>
              <div>
                <Label>Closing time</Label>
                <Input type="time" value={config.closingTime} onChange={(e) => setConfig({ ...config, closingTime: e.target.value })} className="mt-1.5" />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <SettingsIcon className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Booking Rules</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Maximum advance booking (days)</Label>
              <Input type="number" value={config.maxAdvanceDays} onChange={(e) => setConfig({ ...config, maxAdvanceDays: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Minimum lead time (minutes)</Label>
              <Input type="number" value={config.minBookingLead} onChange={(e) => setConfig({ ...config, minBookingLead: e.target.value })} className="mt-1.5" />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Allow guest bookings</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Non-registered users can book</p>
              </div>
              <Switch checked={config.allowGuestBooking} onCheckedChange={(v) => setConfig({ ...config, allowGuestBooking: v })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Require deposit</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Hold a payment to confirm</p>
              </div>
              <Switch checked={config.requireDeposit} onCheckedChange={(v) => setConfig({ ...config, requireDeposit: v })} />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Ban className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Cancellation Policy</h3>
          </div>
          <div className="space-y-4">
            <div>
              <Label>Free cancellation window (hours)</Label>
              <Input type="number" value={config.cancellationWindow} onChange={(e) => setConfig({ ...config, cancellationWindow: e.target.value })} className="mt-1.5" />
            </div>
            <div>
              <Label>Policy text</Label>
              <Textarea rows={5} value={config.refundPolicy} onChange={(e) => setConfig({ ...config, refundPolicy: e.target.value })} className="mt-1.5" />
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">Email notifications</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Booking & cancellation emails</p>
              </div>
              <Switch checked={config.notifyEmail} onCheckedChange={(v) => setConfig({ ...config, notifyEmail: v })} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="font-medium">SMS notifications</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Reminders & confirmations</p>
              </div>
              <Switch checked={config.notifySms} onCheckedChange={(v) => setConfig({ ...config, notifySms: v })} />
            </div>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button size="lg" onClick={save}>
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>
    </AdminShell>
  );
}
