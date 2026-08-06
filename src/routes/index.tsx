import { createFileRoute, Link } from "@tanstack/react-router";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { PlusCircle } from "lucide-react";
import { TxnList } from "@/components/finance/TxnList";
import {
  CATEGORIES,
  categoryStats,
  inr,
  sortedTxns,
  totalIncome,
  useFinance,
} from "@/lib/finance";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rent Splitter — Monthly Rent Income Tracker" },
      {
        name: "description",
        content:
          "Track monthly rent income in ₹, auto-split it into Pocket Money, FD savings and Home Needs, and watch every bucket balance.",
      },
      { property: "og:title", content: "Rent Splitter — Monthly Rent Income Tracker" },
      {
        property: "og:description",
        content: "Log rent income, split it across buckets, and track spending on your phone.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const { data, removeTxn } = useFinance();
  const stats = categoryStats(data.transactions);
  const allTime = totalIncome(data.transactions);
  const thisMonth = totalIncome(data.transactions, true);
  const recent = sortedTxns(data.transactions).slice(0, 6);

  const chartData = CATEGORIES.map((c) => ({
    name: c.label,
    value: Math.max(0, stats[c.id].balance),
    token: c.token,
  }));
  const chartTotal = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-5">
      <section
        className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl p-5 text-primary-foreground shadow-[var(--shadow-card)] duration-500"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <p className="text-xs font-medium uppercase tracking-wider opacity-80">
          Rent received this month
        </p>
        <p className="mt-1 text-4xl font-bold tabular-nums">{inr(thisMonth)}</p>
        <p className="mt-2 text-sm opacity-80">All-time: {inr(allTime)}</p>
        <Link
          to="/add"
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-card/20 px-4 py-2.5 text-sm font-semibold backdrop-blur transition-transform active:scale-95"
        >
          <PlusCircle className="size-4" /> Log rent or expense
        </Link>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to="/categories"
            className="rounded-2xl bg-card p-3 shadow-[var(--shadow-card)] transition-transform active:scale-[0.97]"
          >
            <span
              className="block size-2.5 rounded-full"
              style={{ backgroundColor: `var(--${c.token})` }}
            />
            <p className="mt-2 truncate text-[11px] text-muted-foreground">{c.label}</p>
            <p
              className="text-base font-bold tabular-nums"
              style={{ color: `var(--${c.token})` }}
            >
              {inr(stats[c.id].balance)}
            </p>
          </Link>
        ))}
      </section>

      <section className="rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-sm font-semibold">Current split</h2>
        {chartTotal === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Log your first rent payment to see the split.
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="h-36 w-36 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="value"
                    innerRadius={38}
                    outerRadius={64}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {chartData.map((d) => (
                      <Cell key={d.name} fill={`var(--${d.token})`} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="min-w-0 flex-1 space-y-2">
              {chartData.map((d) => (
                <li key={d.name} className="flex items-center gap-2 text-xs">
                  <span
                    className="size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: `var(--${d.token})` }}
                  />
                  <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.name}</span>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {Math.round((d.value / chartTotal) * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <Link to="/history" className="text-xs font-medium text-primary">
            View all
          </Link>
        </div>
        <TxnList txns={recent} onDelete={removeTxn} emptyLabel="No transactions yet." />
      </section>
    </div>
  );
}