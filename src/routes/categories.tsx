import { createFileRoute } from "@tanstack/react-router";
import { CATEGORIES, categoryStats, inr, useFinance } from "@/lib/finance";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Category Buckets — Rent Splitter" },
      {
        name: "description",
        content:
          "Track balances, deposits and spending across Pocket Money, FD savings and Home Needs buckets.",
      },
      { property: "og:title", content: "Category Buckets — Rent Splitter" },
      {
        property: "og:description",
        content: "Balances, total added and total spent for each rent split bucket.",
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data } = useFinance();
  const stats = categoryStats(data.transactions);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Buckets</h1>
        <p className="text-sm text-muted-foreground">Where every rent payment goes.</p>
      </header>

      {CATEGORIES.map((c) => {
        const s = stats[c.id];
        const pct = s.added > 0 ? Math.min(100, (s.spent / s.added) * 100) : 0;
        return (
          <section
            key={c.id}
            className="animate-in fade-in slide-in-from-bottom-2 space-y-4 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] duration-300"
          >
            <div className="flex items-center gap-3">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--${c.token})` }}
              />
              <h2 className="min-w-0 flex-1 truncate font-semibold">{c.label}</h2>
              <span
                className="shrink-0 text-lg font-bold tabular-nums"
                style={{ color: `var(--${c.token})` }}
              >
                {inr(s.balance)}
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, backgroundColor: `var(--${c.token})` }}
              />
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Total added</dt>
                <dd className="font-bold tabular-nums text-income">{inr(s.added)}</dd>
              </div>
              <div className="rounded-xl bg-secondary p-3">
                <dt className="text-xs text-muted-foreground">Total spent</dt>
                <dd className="font-bold tabular-nums text-expense">{inr(s.spent)}</dd>
              </div>
            </dl>
          </section>
        );
      })}
    </div>
  );
}