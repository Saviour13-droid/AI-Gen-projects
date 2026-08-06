import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { categoryLabel, inr, prettyDate, type Txn } from "@/lib/finance";

export function TxnList({
  txns,
  onDelete,
  emptyLabel = "No transactions yet.",
}: {
  txns: Txn[];
  onDelete?: (id: string) => void;
  emptyLabel?: string;
}) {
  if (txns.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {txns.map((t) => {
        const income = t.type === "income";
        return (
          <li
            key={t.id}
            className="animate-in fade-in slide-in-from-bottom-1 flex items-center gap-3 rounded-2xl bg-card p-3 shadow-[var(--shadow-card)] duration-300"
          >
            <span
              className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                income ? "bg-income-soft text-income" : "bg-expense-soft text-expense"
              }`}
            >
              {income ? (
                <ArrowDownLeft className="size-5" />
              ) : (
                <ArrowUpRight className="size-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {income ? "Rent income" : categoryLabel(t.category)}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {prettyDate(t.date)}
                {t.note ? ` · ${t.note}` : ""}
              </p>
            </div>
            <span
              className={`shrink-0 text-sm font-bold tabular-nums ${
                income ? "text-income" : "text-expense"
              }`}
            >
              {income ? "+" : "−"}
              {inr(t.amount)}
            </span>
            {onDelete ? (
              <button
                onClick={() => onDelete(t.id)}
                aria-label="Delete transaction"
                className="shrink-0 rounded-lg p-2 text-muted-foreground transition-colors active:scale-95 hover:text-expense"
              >
                <Trash2 className="size-4" />
              </button>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}