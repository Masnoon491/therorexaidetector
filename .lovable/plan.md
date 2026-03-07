

## Admin Panel: 5-Minute Auto-Refresh & Live Indicator

### Changes

**File: `src/pages/Admin.tsx`**

1. **Add `lastRefreshed` state** — tracks the last refresh timestamp, displayed as HH:mm in GMT+6.

2. **Add `refreshAll` callback** — a single function that calls `fetchTransactions()`, `fetchInventory()`, `fetchUserSummaries()`, and `fetchScanAudit()`. Used by both the 5-minute interval and manual actions.

3. **Add 5-minute polling `useEffect`** — runs `setInterval(refreshAll, 300_000)` when `isAdmin` is true. Updates `lastRefreshed` after each cycle. Does NOT reset `searchQuery` or `currentPage`.

4. **Update action handlers** — `handleApprove`, `handleReject`, `handleTogglePostpone`, `handleDeleteUser`, and the Give Credit `onComplete` callback all call `refreshAll()` at the end to trigger immediate re-sync.

5. **Live pulse indicator in header** — next to "Theorex Admin Panel", add a teal pulsing dot and the last refresh time (e.g., `Live · 14:32`). Uses `Intl.DateTimeFormat` with `Asia/Dhaka` timezone.

6. **Inventory recalculation** — already computed as `baseStock - cumulativeUsage` in the render. The 5-minute refresh re-fetches `scanData` which recalculates `cumulativeUsage`, so this is automatically in sync.

### Technical Details

- No new dependencies needed.
- No database changes required.
- Pagination (`currentPage`) and search (`searchQuery`) are preserved across refreshes since `refreshAll` only updates the data arrays, not the UI filter state.
- The pulsing dot uses a simple CSS animation via Tailwind's `animate-pulse` on a small teal circle.

