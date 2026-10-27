# Acceptance — Reset Level to Default

Цель: подтвердить условия приёмки фичи «Сброс уровня к значению по умолчанию».

1) Ожидание: Нажатие «Сброс» делает активным «Новичок» и обновляет обе секции без перезагрузки.
   Факт: e2e тест кликает «Средний», затем «Сброс»; активным становится «Новичок», секции обновлены.
   Доказательство: файл practices/practice_04/tests/feature-a-reset-level.spec.ts (первый тест). Логи: practices/practice_05/artifacts/tests-last-run.txt (последний блок: 4 passed), локальный артефакт: practices/practice_04/test-results/.last-run.json.

2) Ожидание: Если уже «Новичок», повторный «Сброс» не ломает состояние, ошибок в консоли нет.
   Факт: покрыто тестом «idempotent reset when Novice is already active».
   Доказательство: practices/practice_04/tests/feature-a-reset-level.spec.ts (второй тест), логи в practices/practice_05/artifacts/tests-last-run.txt (последний блок с 4 passed).

3) Ожидание: Доступность — aria-selected и tabindex корректны.
   Факт: при смене уровня/сбросе атрибуты переключаются в `initLevelSwitcher`.
   Доказательство: код practices/practice_04/src/components/level-switcher.js (setActive) и прохождение e2e.
