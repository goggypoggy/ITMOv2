# UI Spec — Reset Level to Default

## Screens & Actions
- Location: Hero section, block `#level-switcher`.
- Controls: three level tabs (Новичок, Средний, Продвинутый) + button "Сброс".
- Action: click "Сброс" sets active tab to "Новичок".

## States
- Active state on "Новичок": `aria-selected="true"`, class `.is-active`, `tabindex="0"`; остальные `tabindex="-1"`.
- Sections `#catalog-list`, `#pricing-cards` re-rendered for "Новичок"; aria-live containers update.

## Errors
- None surfaced. Rapid repeated clicks are idempotent; no console errors.

## Acceptance Criteria
1) Нажатие «Сброс» делает активным «Новичок» и обновляет обе секции без перезагрузки.
2) Если уже «Новичок» — состояние не ломается, ошибок в консоли нет.
3) Доступность соблюдена: aria-selected, tabindex корректны для активного/неактивных вкладок.

## Out of Scope
- Сохранение выбора, новые страницы, изменение данных, взаимодействие с калькулятором.
