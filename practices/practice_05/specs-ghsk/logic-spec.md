# Logic Spec — Reset Level to Default

## Data & Interfaces
- No new persistent data. Uses existing level keys: `Новичок`, `Средний`, `Продвинутый`.
- Public behavior: invoking reset triggers `apply('Новичок')` inside `initLevelSwitcher`.

## Algorithm / Rules
1) On reset action, call `apply('Новичок')`.
2) `apply(level)` performs:
   - `setActive(level)` to update tab UI/ARIA.
   - `renderCatalog(level)` and `renderPricing(level)` to update DOM.
3) If `level === 'Новичок'` and it is already active, operations are no-ops (idempotent).

## Validation & Errors
- If DOM containers are missing, functions guard and do not throw; UI remains stable.
- No user-visible errors for reset.

## Acceptance Criteria
- After reset, derived DOM reflects data for "Новичок"; no change to other modules (e.g., time calculator).

## Out of Scope
- Storage, routing, data mutations, cross-module side effects.
