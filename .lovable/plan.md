
# LBPL v1.2.0 — Multi-Season Platform

Transform LBPL from a single-tournament app into a scalable multi-season cricket platform. Zero database changes, zero deletions, Season 3 stays 100% intact.

## Architecture

### Season context (frontend-only)
- New `src/context/SeasonContext.tsx` — provides `currentSeason`, `setCurrentSeason`, `seasons[]`.
- Season config lives in `src/config/seasons.ts` — a typed array of season metadata (number, year, status, champion, runnerUp, teamsCount, matchesCount, dataSource, theme accent). Adding Season 5/6 later = append one object.
- Selected season persisted in `localStorage` (`lbpl_active_season`). Default = latest active season (Season 4).
- Season 3 marked `status: "completed"` with existing tables as its data source. Season 4 marked `status: "upcoming"` (no live data yet — shows "Coming Soon" states inside each tab).
- No DB schema change. Existing Season 3 queries stay as-is; when Season 3 is active, components read as they do today. When a future season is active, components read from that season's data source (initially empty/coming-soon placeholders — real data slots in later via same config).

### Route structure (additive, non-breaking)
```
/                       → NEW: Season Hub landing (was Index)
/season/:seasonId/*     → Season shell wrapping existing pages
/hall-of-fame           → NEW: all-time records
/archive                → NEW: tournament archive index
/archive/:seasonId      → NEW: per-season archive page

# Legacy routes preserved (redirect to active season, keep working):
/matches, /results, /points-table, /teams, /stats, /gallery,
/community, /sponsors, /admin, /settings/*  → all still resolve
```
Legacy routes keep rendering existing pages against the active season context, so nothing breaks.

## New Pages & Components

### 1. Season Hub (`/`) — new landing
Netflix/Apple TV+ inspired dark premium layout:
- **Hero**: Featured current season (Season 4) — cinematic banner, live status pill, primary CTA "Enter Season 4".
- **Tournament Archive strip**: horizontal scroll of premium season cards (Season 3 = Completed w/ champion, Season 4 = Live, Season 5 = Coming Soon placeholder shown only if configured).
- **Hall of Fame teaser**: 3–4 record highlights + CTA.
- Glassmorphism cards, subtle parallax, staggered fade-ins.

### 2. Season Switcher
- Component `SeasonSwitcher.tsx` in `Navigation` + PWA bottom nav "More" sheet.
- Desktop: animated dropdown pill in navbar showing "Season 4 ▾".
- Mobile/PWA: bottom sheet with season cards, tap to switch — no reload, context updates → all season-scoped pages re-render.
- Persists to localStorage.

### 3. Hall of Fame (`/hall-of-fame`)
Aggregates from existing `match_scorecards` + `players` + `matches` across all completed seasons:
- Champion / Runner-up per season
- Most Runs, Most Wickets, Most Sixes, Highest Score, Best Bowling, Most POTM Awards, Fastest Fifty, Best Economy
- Filter chips: "All Seasons" / "Season 3" / etc.
- All values computed from real scorecard data — no fabricated names. Aggregation lives in `src/lib/hallOfFame.ts` (pure functions over Supabase query results).

### 4. Tournament Archive (`/archive`, `/archive/:seasonId`)
- Index: grid of completed seasons.
- Detail: champion, runner-up, final scorecard link, gallery highlights, top performers — all pulled from existing tables filtered by season.

### 5. Season Shell (`/season/:seasonId/*`)
Wraps existing pages inside `SeasonProvider`. Existing components unchanged — they consume season context to know which dataset to render.

## Season 3 preservation

- Season 3 data source = current tables (unchanged).
- When Season 3 is active, every page renders exactly as it does today.
- No visual, behavioral, or logic changes to Season 3 screens.
- Season 3 becomes accessible via Hub → Archive card OR direct legacy URL OR season switcher.

## PWA bottom nav update

Add new destinations, keep current 4-tab structure:
- Tabs: Home (Season Hub), Matches, Community, More
- **More sheet** gains: Season Switcher (top), Hall of Fame, Archive, then existing (Points Table, Results, Teams, Stats, Gallery, Settings).
- Settings verified: appearance, notifications, favorite team, rules, about, developer, help — all confirmed wired and functional.

## Design language

- Preserve current dark navy + gold (#F9C846) brand.
- New surfaces: glassmorphic cards (`backdrop-blur-xl`, subtle gold border), season status pills (Live=teal pulse, Completed=gold, Upcoming=muted), cinematic hero gradients.
- Motion: `framer-motion` not required — use existing tailwind `animate-fade-in`, `hover-scale`, `scale-in`. Add a couple of new keyframes (hero-glow, card-lift) in `tailwind.config.ts`.
- Typography scale bumped only on new pages; existing pages untouched.

## Technical Details

**Files created**
- `src/config/seasons.ts`
- `src/context/SeasonContext.tsx`
- `src/pages/SeasonHub.tsx` (new `/`)
- `src/pages/HallOfFame.tsx`
- `src/pages/Archive.tsx`, `src/pages/ArchiveSeason.tsx`
- `src/pages/SeasonShell.tsx` (wraps existing pages under `/season/:id/*`)
- `src/components/SeasonSwitcher.tsx`
- `src/components/season/SeasonCard.tsx`, `HeroSeason.tsx`, `ArchiveStrip.tsx`, `HallOfFameTeaser.tsx`
- `src/lib/hallOfFame.ts` (data aggregation)

**Files edited**
- `src/App.tsx` — new routes, wrap in `SeasonProvider`. Move current `Index` → mounted at `/season/:seasonId` (and legacy `/` handler kept as SeasonHub). Existing `Index.tsx` untouched, just re-routed.
- `src/components/Navigation.tsx` — add SeasonSwitcher + Hall of Fame + Archive links.
- `src/components/PwaBottomNav.tsx` + `MoreSheet.tsx` — add season switcher and new destinations.
- `package.json` — version bump `1.1.2` → `1.2.0`.
- `public/manifest.json` — version bump.
- `src/pages/settings/SettingsHome.tsx` — add "About This Season" info; verify all toggles wired.

**No changes**
- No SQL migrations. No edits to `src/integrations/supabase/*`. No edits to Season 3 page internals. No API changes.

## Rollout

1. Config + context + provider
2. Legacy route compatibility layer (all current URLs keep working)
3. Season Hub + SeasonSwitcher
4. Hall of Fame + Archive
5. PWA bottom nav additions + settings audit
6. Version bump + smoke test build

## Out of scope (explicitly)
- No new database tables/columns.
- No admin UI for creating seasons (config-file driven for now).
- No Season 4 fixture data yet — placeholders until data is entered.
- No changes to auth, moderation, OTP flow.

Ready to implement on approval.
