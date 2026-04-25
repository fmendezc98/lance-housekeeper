# Lance Housekeeper Home

A mobile-first prototype rebuilding the housekeeper view of the Lance Pad — a hotel ops tool used by staff during live shifts.


---

## The problem

When a housekeeper logs into the Lance Pad today, the home screen says "No rooms assigned" — even when work exists in the system. Without a digital surface for their core workflow, the housekeepers fall back to paper lists, walkies, and informal coordination, and small issues often go unlogged because the existing form takes 6+ taps for a simple request.

## What this prototype does

A rebuild of the housekeeper's shift screen, centered on three integrated pieces:

- **Inline room status updates** from the home row: tap the status pill, advance Dirty → In Progress → Clean. No navigation required.
- **DND as a first-class status:** mark a room DND with one tap; it auto-sorts to the bottom of the list.
- **Quick issue reporting:** file any issue (bulb out, low soap, leaky faucet) in ~10 seconds with three fields — type, urgency, description. Replaces the 6+ tap form in the current Pad.

Designed for a user who checks her phone 50+ times per shift, moves through the property one-handed, and has no time to think.

## Tech

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- lucide-react for icons
- Web Speech API for voice input on Report Issue
- Deployed via Vercel

All data is mocked in `src/data/mockData.ts`. No backend, no authentication, no persistence — this is a UX prototype for design and product validation, not a production system.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in mobile viewport (Chrome DevTools → toggle device toolbar → iPhone 14 Pro).

## Project structure

```
src/
  components/
    home/         — Room list, task list, room row with split tap behavior
    room/         — Room detail with status flow
    task/         — Task detail (single Complete action)
    report/       — Report Issue bottom sheet
    ui/           — shadcn primitives
  data/
    mockData.ts   — 14 rooms, 2 priority tasks, realistic shift load
  hooks/
    useAppState.ts — useReducer for room/task state
```
