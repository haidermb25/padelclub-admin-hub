import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  LandPlot,
  CreditCard,
  FileBarChart,
  Settings,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/registrations", label: "Registrations", icon: Users },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/courts", label: "Courts", icon: LandPlot },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AdminSidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-sidebar-border">
        <div className="h-9 w-9 rounded-lg bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
          <Trophy className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <div>
          <div className="text-sm font-bold leading-tight">TheLAPadelClub</div>
          <div className="text-[10px] uppercase tracking-widest text-sidebar-foreground/60">Admin</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[var(--shadow-glow)]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active && "text-sidebar-primary-foreground")} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-sidebar-border">
        <div className="rounded-lg bg-sidebar-accent p-3">
          <div className="text-xs font-semibold text-sidebar-accent-foreground">System Status</div>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-sidebar-foreground/70">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </aside>
  );
}
