import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const variants: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/20",
  confirmed: "bg-primary/15 text-primary border-primary/20",
  paid: "bg-primary/15 text-primary border-primary/20",
  completed: "bg-info/15 text-info border-info/20",
  pending: "bg-warning/15 text-warning border-warning/20",
  cancelled: "bg-destructive/15 text-destructive border-destructive/20",
  refunded: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/15 text-destructive border-destructive/20",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge variant="outline" className={cn("capitalize font-medium", variants[status] ?? "")}>
      {status}
    </Badge>
  );
}
