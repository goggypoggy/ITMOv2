### Этап 0. Подготовка условия лабораторной работы

Был использован Claude Sonnet 5.5 для составления своего README.md, которое затем используется агентами для выполнения работы.

- Создан README.md

### Этап 1. Планирование шагов работы

Непосредственное выполнение самой практики было начато с подготовки плана работы:
```
Выполняем практику в @practices/practice_05  Условие описано в README.md. Дорабатывать будем проект, который находится в @practice/practice04  Пока что, ничего не меняй. В practice_05 распиши workplan.md. В нём нужно расписать последовательные шаги, которые необходимо выполнить для завершения лабораторной работы. Рекомендации по выполнению: в качестве второй SDD-фреймворка используй GitHub Spec Kit.
```

- Создан workplan.md

Затем, были выделены роли агентов, которые будут необходимы для выполнения задач.
```
Ничего не меняй, создай ещё один файл: responsibilities.md. Проанализируй подзадачи в @practices/practice_05/workplan.md  : какие навыки необходимы для её выполнения? кто бы в команде разработки занимался бы такой задачей? Ответив на эти вопросы, выдели 3-6 ролей для выполнения этих задач (количество ролей определяется строго по надобности), запиши эти роли в responsibilities.md и для каждой укажи, какие задачи они выполняют.
```

- Создан responsibilities.md

### Этап 2. Выполнение работы

Агенту была поручена задача - управлять работой нескольких других агентов, специализированных под выполнение определённых задач.
```
Теперь, приступай к выполнению работы. Твоя задача - создать 5 агентов, роли которых описаны в @practices/practice_05/responsibilities.md  . Тебе нужно управлять их работой и гарантировать выполнение всей лабораторной работы + домашней работы в соответствии с @practices/practice_05/workplan.md  . Работа выполняется по задачам в последовательности, описанной в @practices/practice_05/workplan.md , теми агентами, которые за них отвечают (смотреть @practices/practice_05/responsibilities.md )
```

Результаты и артефакты выполнения:
- Добавлены 5 файлов агентов: `.opencode/agents/{product-owner,sdd-facilitator,frontend-ui,frontend-logic,qa-automation}.md`.
- OpenSpec 1.14.1 инициализирован в `practices/practice_04` (`openspec/config.yaml`).
- Создан change `reset-level-to-default`: `proposal.md`, `design.md` (с Mermaid), `skip_specs: true`; валидирован и заархивирован.
- Реализована фича «Сброс уровня» (кнопка в `index.html`, обработчик в `initLevelSwitcher`).
- Тесты Playwright дополнены `tests/feature-a-reset-level.spec.ts`; все тесты проходят.
- Правило OpenSpec добавлено (`rules.design: Mermaid`), проверено через `openspec instructions design`.
- GitHub Spec Kit: созданы `specs-ghsk/ui-spec.md`, `logic-spec.md`, `contract.md`.


Следующая секция будет отражать конкретную работу, выполненную ИИ-агентами.

### Конкретные шаги работы ИИ-агентов

- Контекст и роли
  - Роли зафиксированы в practices/practice_05/responsibilities.md.
  - Созданы агенты (subagent) в practices/practice_04/.opencode/agents: product-owner.md, sdd-facilitator.md, frontend-ui.md, frontend-logic.md, qa-automation.md.

- Хронология действий (с привязкой к ролям и инструментам)
  1) Исследование репозитория (SDD‑фасилитатор): поиск папок practice_04/practice_05 и чтение README. Инструменты: Glob, Read.
  2) Планирование (SDD‑фасилитатор): создан practices/practice_05/workplan.md. Инструменты: Apply Patch.
  3) Роли и ответственности (PO + SDD‑фасилитатор): создан practices/practice_05/responsibilities.md. Инструменты: Apply Patch.
  4) Подготовка агентов (SDD‑фасилитатор): добавлены 5 файлов агентов в .opencode/agents. Инструменты: Apply Patch.
  5) Проверка окружения (SDD‑фасилитатор): node --version, npm --version; попытка глобальной установки OpenSpec отклонена EACCES; переход на npx‑запуски. Инструменты: Bash.
  6) Инициализация OpenSpec (SDD‑фасилитатор): npx @fission-ai/openspec@1.14.1 init --profile core в practices/practice_04. Инструменты: Bash.
  7) Выбор фичи (PO): через вопрос ассистента выбрана «Сброс уровня (по умолчанию)». Инструменты: Question.
  8) Создание change (SDD‑фасилитатор): npx openspec new change reset-level-to-default; добавлен proposal.md; в .openspec.yaml отмечено skip_specs: true; validate успешен. Инструменты: Bash, Read, Apply Patch.
  9) Проектное правило OpenSpec (SDD‑фасилитатор): в openspec/config.yaml добавлено rules.design (Mermaid). Проверено через npx openspec instructions design, затем создан design.md с диаграммой. Инструменты: Apply Patch, Bash.
  10) Реализация фичи (Frontend UI + Frontend Logic):
      - index.html — добавлена кнопка «Сброс» в блоке переключателя.
      - src/components/level-switcher.js — добавлен обработчик reset, использующий существующий apply('Новичок').
      Инструменты: Apply Patch.
  11) Тестирование (QA):
      - Базовые тесты npm test — зелёные.
      - Добавлен новый тест tests/feature-a-reset-level.spec.ts.
      - Поднят локальный сервер: npx --yes serve -l 8080 . (фон).
      - Повторный прогон npm test — 3 passed.
      Инструменты: Apply Patch, Bash.
  12) Архивирование (SDD‑фасилитатор): npx openspec archive reset-level-to-default — успешно, specsUpdated: false. Инструменты: Bash.
  13) GitHub Spec Kit (SDD‑фасилитатор + UI + Логика): созданы specs‑ghsk/ui-spec.md, logic-spec.md, contract.md. Инструменты: Apply Patch.

- Использованные тулы/инструменты
  - Инструменты ассистента: Glob, Read, Apply Patch, Bash, Question, Skill (customize-opencode), Parallel tool runner.
  - CLI и экосистема: npx @fission-ai/openspec@1.14.1 (init, new, validate, instructions, archive), npm test (Playwright), npx serve (локальный сервер).
  - Языки/форматы: Markdown (спеки и агенты), YAML (OpenSpec config), Mermaid (диаграмма), TypeScript/JS (тесты/код UI).

- Распределение по агентам (кто выполнял какие задачи)
  - Product Owner: выбор фичи, формулировка условий приёмки, приёмка результата.
  - SDD‑фасилитатор: OpenSpec init/new/validate/instructions/archive, подготовка proposal/design, добавление правила Mermaid, организация GitHub Spec Kit документов.
  - Frontend UI: UI‑часть — кнопка «Сброс», доступность и интеграция.
  - Frontend Logic: обработчик сброса через существующий apply('Новичок'), без изменения архитектуры и данных.
  - QA/Automation: baseline тесты, добавление e2e‑теста сброса, финальный прогон и подтверждение зелёного статуса.

- Примечания
  - OpenSpec использован через npx из‑за ограничений прав на глобальную установку (EACCES).
  - Изменение помечено skip_specs: true, так как спецификационные требования системы не менялись — добавлено прикладное UI‑действие.
  - Сервер запущен в фоне для e2e‑тестов; остановка через Ctrl+C в соответствующем терминале при ручном запуске.
