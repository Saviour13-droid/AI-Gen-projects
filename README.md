# Rent Flow

"Build a personal finance tracker web app to manage my monthly rent income. The app should let me:

Add Income: Log rent income received each month (amount + date + optional note).

Split Income into Categories (Fixed Amounts, Editable): Set default fixed amounts for how each rent payment gets split into:

Pocket Money

FD (Fixed Deposit / savings)

Home Needs

These default amounts should auto-fill whenever I log new income, but I should be able to manually edit the split amounts for any individual entry before confirming it. There should also be a settings section where I can update the default fixed amounts anytime.

Category Dashboards: Show each category as its own card/section with:

Current balance in that category

Total added over time

Total spent/withdrawn from that category

Track Expenses per Category: Let me log an expense against a specific category (e.g., "Home Needs: ₹2000 for groceries") and deduct it from that category's balance. Each expense should have an amount, date, category, and optional note.

Overview Page: A summary dashboard showing:

Total rent income received (all-time and this month)

Current balance in each of the three categories

A pie chart or bar chart showing the current split between Pocket Money, FD, and Home Needs

Recent transactions list (income + expenses combined, most recent first)

History/Filters: Let me filter transactions by category, date range, or type (income/expense).

Data Persistence: Save all data so it doesn't reset when I reload the app.

Mobile-First & Smooth UI: The app must be fully responsive and optimized for smartphones as the primary device — touch-friendly buttons, thumb-reachable navigation (bottom nav bar preferred), and no horizontal scrolling. Use smooth micro-animations and transitions (e.g., when adding a transaction, switching tabs, or updating balances) so it feels fluid, not laggy. Prioritize performance — avoid heavy assets or animations that could slow down loading or scrolling on mobile devices.

Color Palette & Visual Design: Use a modern, calming finance-app aesthetic with this palette:

Background: Soft off-white or light gray (#F7F8FA) for light mode, with a dark charcoal (#121417) option for dark mode

Primary/Accent: Deep indigo or teal (#3D5AFE or #0F766E) for buttons, headers, and key actions

FD (Savings): Emerald green (#10B981) — conveys growth and security

Pocket Money: Sky blue (#3B82F6) — light, everyday, approachable

Home Needs: Warm amber/orange (#F59E0B) — signals essential spending

Income entries: Soft green tint; Expense entries: Soft red/coral tint (#EF4444) for quick visual distinction

Cards: White or slightly elevated surface color with soft drop shadows and rounded corners (16px radius)

Typography: Clean sans-serif (e.g., Inter or Poppins), bold numerals for balances, muted gray for secondary text

Use subtle gradients on summary cards (e.g., indigo-to-teal) for visual depth without looking cluttered

Simple, clean UI foundation: Card-based layout with clear typography, good spacing, and legible font sizes for small screens. Currency should display in ₹ (INR).

Keep the app lightweight and functional — no login/auth needed for now, just local data storage optimized for fast mobile performance."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://rent-split.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/ea8f417a-8290-46d1-ab0b-da511d50b0a9).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
