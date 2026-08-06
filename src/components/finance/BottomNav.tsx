import { Link } from "@tanstack/react-router";
import { Home, PlusCircle, Wallet, History, Settings } from "lucide-react";

const items = [
  { to: "/", label: "Overview", icon: Home },
  { to: "/categories", label: "Buckets", icon: Wallet },
  { to: "/add", label: "Add", icon: PlusCircle },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 px-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors active:scale-95 data-[status=active]:text-primary"
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              <span className="truncate">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}