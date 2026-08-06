import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CATEGORIES, inr, useFinance, type Split } from "@/lib/finance";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Default Split Settings — Rent Splitter" },
      {
        name: "description",
        content:
          "Update the default fixed amounts used to auto-split each rent payment across your buckets.",
      },
      { property: "og:title", content: "Default Split Settings — Rent Splitter" },
      {
        property: "og:description",
        content: "Set fixed default amounts for Pocket Money, FD savings and Home Needs.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data, setDefaults } = useFinance();
  const [draft, setDraft] = useState<Split>(data.defaults);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!dirty) setDraft(data.defaults);
  }, [data.defaults, dirty]);

  const total = CATEGORIES.reduce((s, c) => s + (draft[c.id] || 0), 0);

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Default split for every new rent entry.</p>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDefaults(draft);
          setDirty(false);
          toast.success("Default split updated");
        }}
        className="space-y-5 rounded-2xl bg-card p-5 shadow-[var(--shadow-card)]"
      >
        {CATEGORIES.map((c) => (
          <div key={c.id} className="space-y-1.5">
            <Label htmlFor={`default-${c.id}`} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: `var(--${c.token})` }}
              />
              {c.label}
            </Label>
            <Input
              id={`default-${c.id}`}
              type="number"
              inputMode="numeric"
              min={0}
              value={draft[c.id]}
              onChange={(e) => {
                setDirty(true);
                setDraft({ ...draft, [c.id]: Number(e.target.value) || 0 });
              }}
            />
          </div>
        ))}

        <div className="flex items-center justify-between rounded-xl bg-secondary px-4 py-3">
          <span className="text-sm font-medium">Expected monthly rent</span>
          <span className="text-lg font-bold tabular-nums">{inr(total)}</span>
        </div>

        <Button type="submit" className="h-12 w-full text-base">
          Save defaults
        </Button>
      </form>
    </div>
  );
}