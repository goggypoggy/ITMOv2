# Contract — Reset Level to Default

## Interfaces
- UI -> Logic: Reset action invokes `apply('Новичок')` exposed within `initLevelSwitcher` scope via event handler on `#level-reset`.

## Inputs
- Event: click on `#level-reset` (no payload).

## Outputs
- DOM side-effects:
  - Active tab updated to "Новичок" with `aria-selected=true` and `.is-active`.
  - `#catalog-list` and `#pricing-cards` reflect data for "Новичок".

## Invariants
- Idempotency: multiple resets in a row preserve the same state.
- Isolation: no effects on time calculator.
