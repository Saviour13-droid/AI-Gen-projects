import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CATEGORIES,
  categoryStats,
  inr,
  today,
  useFinance,
  type CategoryId,
  type Split,
} from "@/lib/finance";

export const Route = createFileRoute("/add")({
  head: () => ({
    meta: [
      { title: "Log Income or Expense — Rent Splitter" },
      {
        name: "description",
        content:
          "Log monthly rent income with an editable split, or record an expense against a bucket.",
      },
      { property: "og:title", content: "Log Income or Expense — Rent Splitter" },
      {
        property: "og:description",
        content: "Add rent income with auto-filled split amounts, or log a category expense.",
      },
    ],
  }),
  component: AddPage,
});

function AddPage() {
  const [tab, setTab] = useState<"income" | "expense">("income");
  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Add entry</h1>
        <p className="text-sm text-muted-foreground">Rent received, or money spent.</p>
      </header>

      <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
        {(["income", "expense"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`rounded-lg py-2 text-sm font-semibold capitalize transition-all active:scale-[0.98] ${
              tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "income" ? <IncomeForm /> : <ExpenseForm />}
    </div>
  );
}

function IncomeForm() {
  const { data, addIncome } = useFinance();
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [split, setSplit] = useState<Split>(data.defaults);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (!touched) setSplit(data.defaults);
  }, [data.defaults, touched]);

  const total = CATEGORIES.reduce((s, c) => s + (split[c.id] || 0), 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (total <= 0) {
      toast.error("Enter at least one split amount.");
      return;
    }
    addIncome({ amount: total, date, note: note.trim() || undefined, split });
    toast.success(`Rent income of ${inr(total)} logged`);
    setNote("");
    setTouched(false);
    setSplit(data.defaults);
  };

  return (
    <form
      onSubmit={submit}
      className="animate-in fade-in slide-in-from-bottom-2 space-y-5 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] duration-300"
    >
      <div className="space-y-2">
        <Label htmlFor="income-date">Date received</Label>
        <Input
          id="income-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Split amounts</legend>
        <p className="text-xs text-muted-foreground">
          Pre-filled from your defaults — edit any amount for this entry.
        </p>
        {CATEGORIES.map((c) => (
          <div key={c.id} className="space-y-1.5">
            <Label htmlFor={`split-${c.id}`} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: `var(--${c.token})` }}
              />
              {c.label}
            </Label>
            <Input
              id={`split-${c.id}`}
              type="number"
              inputMode="numeric"
              min={0}
              value={split[c.id]}
              onChange={(e) => {
                setTouched(true);
                setSplit({ ...split, [c.id]: Number(e.target.value) || 0 });
              }}
            />
          </div>
        ))}
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="income-note">Note (optional)</Label>
        <Input
          id="income-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. August rent, 2BHK"
        />
      </div>

      <div className="flex items-center justify-between rounded-xl bg-income-soft px-4 py-3">
        <span className="text-sm font-medium">Total income</span>
        <span className="text-lg font-bold tabular-nums text-income">{inr(total)}</span>
      </div>

      <Button type="submit" className="h-12 w-full text-base">
        Confirm income
      </Button>
    </form>
  );
}

function ExpenseForm() {
  const { data, addExpense } = useFinance();
  const stats = categoryStats(data.transactions);
  const [category, setCategory] = useState<CategoryId>("home");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid amount.");
      return;
    }
    addExpense({ amount: value, date, note: note.trim() || undefined, category });
    toast.success(`${inr(value)} deducted from ${CATEGORIES.find((c) => c.id === category)!.label}`);
    setAmount("");
    setNote("");
  };

  return (
    <form
      onSubmit={submit}
      className="animate-in fade-in slide-in-from-bottom-2 space-y-5 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)] duration-300"
    >
      <fieldset className="space-y-2">
        <legend className="mb-2 text-sm font-semibold">Deduct from</legend>
        <div className="grid gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              aria-pressed={category === c.id}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all active:scale-[0.98] ${
                category === c.id
                  ? "border-transparent ring-2"
                  : "border-border bg-secondary/40"
              }`}
              style={
                category === c.id
                  ? {
                      backgroundColor: `var(--${c.token}-soft)`,
                      ["--tw-ring-color" as string]: `var(--${c.token})`,
                    }
                  : undefined
              }
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(--${c.token})` }}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">{c.label}</span>
              <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
                {inr(stats[c.id].balance)} left
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="expense-amount">Amount (₹)</Label>
        <Input
          id="expense-amount"
          type="number"
          inputMode="numeric"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="2000"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-date">Date</Label>
        <Input
          id="expense-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="expense-note">Note (optional)</Label>
        <Input
          id="expense-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. groceries"
        />
      </div>

      <Button type="submit" variant="destructive" className="h-12 w-full text-base">
        Log expense
      </Button>
    </form>
  );
}