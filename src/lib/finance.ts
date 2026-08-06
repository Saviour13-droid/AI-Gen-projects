import { useCallback, useEffect, useState } from "react";

export type CategoryId = "pocket" | "fd" | "home";

export const CATEGORIES: { id: CategoryId; label: string; token: string }[] = [
  { id: "pocket", label: "Pocket Money", token: "pocket" },
  { id: "fd", label: "FD / Savings", token: "fd" },
  { id: "home", label: "Home Needs", token: "home" },
];

export const categoryLabel = (id: CategoryId) =>
  CATEGORIES.find((c) => c.id === id)?.label ?? id;

export type Split = Record<CategoryId, number>;

export type Income = {
  id: string;
  type: "income";
  amount: number;
  date: string;
  note?: string | undefined;
  split: Split;
};

export type Expense = {
  id: string;
  type: "expense";
  amount: number;
  date: string;
  note?: string | undefined;
  category: CategoryId;
};

export type Txn = Income | Expense;

export type FinanceData = {
  defaults: Split;
  transactions: Txn[];
};

const KEY = "rent-finance-v1";

const EMPTY: FinanceData = {
  defaults: { pocket: 10000, fd: 15000, home: 5000 },
  transactions: [],
};

let cache: FinanceData | null = null;
const listeners = new Set<() => void>();

function read(): FinanceData {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...(JSON.parse(raw) as FinanceData) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: FinanceData) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useFinance() {
  const [data, setData] = useState<FinanceData>(EMPTY);

  useEffect(() => {
    const sync = () => setData(read());
    sync();
    listeners.add(sync);
    return () => listeners.delete(sync) as unknown as void;
  }, []);

  const update = useCallback((fn: (d: FinanceData) => FinanceData) => {
    write(fn(read()));
  }, []);

  const addIncome = useCallback(
    (input: { amount: number; date: string; note?: string | undefined; split: Split }) =>
      update((d) => ({
        ...d,
        transactions: [
          { id: crypto.randomUUID(), type: "income" as const, ...input },
          ...d.transactions,
        ],
      })),
    [update],
  );

  const addExpense = useCallback(
    (input: {
      amount: number;
      date: string;
      note?: string | undefined;
      category: CategoryId;
    }) =>
      update((d) => ({
        ...d,
        transactions: [
          { id: crypto.randomUUID(), type: "expense" as const, ...input },
          ...d.transactions,
        ],
      })),
    [update],
  );

  const removeTxn = useCallback(
    (id: string) =>
      update((d) => ({ ...d, transactions: d.transactions.filter((t) => t.id !== id) })),
    [update],
  );

  const setDefaults = useCallback(
    (defaults: Split) => update((d) => ({ ...d, defaults })),
    [update],
  );

  return { data, addIncome, addExpense, removeTxn, setDefaults };
}

export function sortedTxns(txns: Txn[]) {
  return [...txns].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function categoryStats(txns: Txn[]) {
  const stats: Record<CategoryId, { added: number; spent: number; balance: number }> = {
    pocket: { added: 0, spent: 0, balance: 0 },
    fd: { added: 0, spent: 0, balance: 0 },
    home: { added: 0, spent: 0, balance: 0 },
  };
  for (const t of txns) {
    if (t.type === "income") {
      for (const c of CATEGORIES) stats[c.id].added += t.split[c.id] || 0;
    } else {
      stats[t.category].spent += t.amount;
    }
  }
  for (const c of CATEGORIES) stats[c.id].balance = stats[c.id].added - stats[c.id].spent;
  return stats;
}

export function totalIncome(txns: Txn[], monthOnly = false) {
  const prefix = new Date().toISOString().slice(0, 7);
  return txns
    .filter((t) => t.type === "income" && (!monthOnly || t.date.startsWith(prefix)))
    .reduce((s, t) => s + t.amount, 0);
}

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export const today = () => new Date().toISOString().slice(0, 10);

export const prettyDate = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });