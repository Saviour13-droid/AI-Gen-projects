import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TxnList } from "@/components/finance/TxnList";
import { CATEGORIES, sortedTxns, useFinance, type CategoryId } from "@/lib/finance";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "Transaction History — Rent Splitter" },
      {
        name: "description",
        content: "Filter your rent income and category expenses by type, bucket and date range.",
      },
      { property: "og:title", content: "Transaction History — Rent Splitter" },
      {
        property: "og:description",
        content: "Every income and expense entry, filterable by bucket, type and date.",
      },
    ],
  }),
  component: HistoryPage,
});

type TypeFilter = "all" | "income" | "expense";
type CatFilter = "all" | CategoryId;

function HistoryPage() {
  const { data, removeTxn } = useFinance();
  const [type, setType] = useState<TypeFilter>("all");
  const [cat, setCat] = useState<CatFilter>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const txns = sortedTxns(data.transactions).filter((t) => {
    if (type !== "all" && t.type !== type) return false;
    if (cat !== "all") {
      if (t.type === "expense" ? t.category !== cat : (t.split[cat] || 0) === 0) return false;
    }
    if (from && t.date < from) return false;
    if (to && t.date > to) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">History</h1>
        <p className="text-sm text-muted-foreground">{txns.length} matching entries</p>
      </header>

      <div className="space-y-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
        <Chips
          label="Type"
          options={[
            { value: "all", label: "All" },
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
          value={type}
          onChange={(v) => setType(v as TypeFilter)}
        />
        <Chips
          label="Bucket"
          options={[
            { value: "all", label: "All" },
            ...CATEGORIES.map((c) => ({ value: c.id, label: c.label })),
          ]}
          value={cat}
          onChange={(v) => setCat(v as CatFilter)}
        />
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="from" className="text-xs">
              From
            </Label>
            <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="to" className="text-xs">
              To
            </Label>
            <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
          </div>
        </div>
      </div>

      <TxnList txns={txns} onDelete={removeTxn} emptyLabel="Nothing matches these filters." />
    </div>
  );
}

function Chips({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={value === o.value}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all active:scale-95 ${
              value === o.value
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}