# METAREPORT: Использование ИИ и инструменты

Документ фиксирует, как использовался ИИ и инструменты в ходе выполнения практики 6. Здесь перечислены все пользовательские промпты, изменённые файлы, запуски субагентов и вызовы инструментов (tools). Итоги и результаты работ отражены в REPORT_01/REPORT_02; здесь фокус — процесс и средства.

## Промпты пользователя (хронологически)

1. Сегодня делаем практику 6 в practices/practice_06. Прочитай её условие в README.md.
2. Сегодня делаем практику 6 в practices/practice_06. Прочитай её условие в README.md. Для начала я хочу составить AGENTS.md для последующей агентской работы. Базовые поинты я написал, нужно раздробить работу на этапы и подзадачи. Проанализируй условие в ридми и напиши шаги в AGENTS.md. Главное - 1й глобальный этап - найти уязвимости до правок; 2й глобальный этап - сделать правки чтобы запатчить уязвимости; 3й глобальный этап - снова попытаться найти уязвимости
3. вопрос про функционал: можешь ли ты свободно запускать и управлять работой субагентов?
4. Отлично. Теперь, ты принимаешь на себя роль координатора. Задача: выполнить лабораторную 6! Следуй AGENTS.md, запускай субагентов для выполнения пунктов плана, необходимо чтобы все субагенты также следовали AGENTS.md и точно знали свои роли.
5. объясни, что ты пытаешься сделать прямо сейчас. у тебя не получается это сделать уже долгое время. ответь кратко, ничего не меняй.
6. попробуй снова. если получится, продолжай работу в прежнем режиме.
7. ОБЯЗАТЕЛЬНО необходимо сделать максимально подробные репорты! REPORT_01.md и REPORT_02.md - самые главные артефакты лабораторной работы. Они должны отображать ВСЮ проделанную деятельность!
8. в обоих репортах описаны планы прогоны LLM сценариев. необходимо действительно выполнить эти планы, сохранить необходимый evidence и добавить в репорты секции про запуски сценариев. ты всё ещё координатор - помни про свои обязанности.
9. Explicitly зафиксируй, какие были проблемы с LLM-ассистентом в REPORT_01.md. При этом добавляй ссылки на соответсвующий evidence.
10. Отлично! Молодец!
11. Теперь последняя задача - составить METAREPORT.md. Это крайне важная задача. METAREPORT.md - это документ, который позволит практику по дисциплине проверить, как был использован ИИ в этой работе. Он должен содержать в себе ВСЕ МОИ промпты к тебе, а также все при этом изменённые файлы, запуски субагентов и запуски tools. В документе не нужно отражать результаты фактически проделанной агентами работы (по крайней мере, это далеко не главный фокус). Тебе необходимо прочитать историю всей нашей переписки для написания этого документа.
12. попробуй снова. на данный момент в METAREPORT.md всего лишь одна строка...

## Изменённые/добавленные файлы

- practices/practice_06/AGENTS.md — обновлён детализированным планом этапов, ролей и артефактов.
- practices/practice_06/lab/service.py — минимальные правки безопасности (SQLi, авторизация, XSS, ассистент и т.д.).
- practices/practice_06/judge-system-prompt.md — обновлён системный промпт Судьи.
- practices/practice_06/REPORT_01.md — подробный отчёт до правок.
- practices/practice_06/REPORT_02.md — отчёт после правок с LLM-прогонами.
- practices/practice_06/METAREPORT.md — этот документ.

Созданные артефакты evidence:
- practices/practice_06/evidence/before/* — PoC и контексты до правок (включая assistant_context.json, reviews_view.html и пр.).
- practices/practice_06/evidence/after/* — проверки и LLM-прогоны после правок (assistant_context.json, assistant_execute_after.json и пр.).
- /tmp/opencode/shop_planner_after.jsonl — сырой вывод shop-planner (после).
- /tmp/opencode/shop_planner_after_malicious.jsonl — сырой вывод shop-planner с вредоносным отзывом.

## Запуски субагентов (OpenCode agents)

- shop-planner (из practices/practice_06/opencode.json):
  - opencode run --agent shop-planner --format json --title 'shop-planner after' --file evidence/after/assistant_context.json -- 'См. прикреплённый контекст. Верни JSON решения.'
  - opencode run --agent shop-planner --format json --title 'shop-planner malicious' --file evidence/after/assistant_context_malicious.json -- 'См. контекст с вредоносной инструкцией. Верни JSON решения.'
  - Примечание: агент без инструментов, решение возвращается как JSON.

- threat-judge — не запускался в этой сессии.

## Использованные инструменты (tools)

Список вызовов инструментов OpenCode и команд оболочки. Результаты опущены; фиксируются факты вызовов.

- glob
  - practices/practice_06/**/README.*
  - practices/practice_06/lab/**/service.py
  - practices/practice_06/lab/**/Makefile
  - practices/practice_06/**/judge-system-prompt.md
  - **/opencode.json
  - practices/practice_06/**/planner-system.*

- read
  - practices/practice_06/README.md
  - practices/practice_06/AGENTS.md
  - practices/practice_06/lab/README.md
  - practices/practice_06/lab/service.py
  - practices/practice_06/lab/Makefile
  - practices/practice_06/judge-system-prompt.md
  - practices/practice_06/lab/test_service.py
  - practices/practice_06/lab/test_http.py
  - practices/practice_06/lab/sandbox.py
  - practices/practice_06/planner-system.txt
  - practices/practice_06/REPORT_02.md
  - practices/practice_06/REPORT_01.md
  - practices/practice_06/METAREPORT.md (верификация содержимого)

- multi_tool_use.parallel
  - Параллельное чтение AGENTS.md и lab/README.md
  - Параллельное чтение нескольких файлов (sandbox.py, tests) при сборе контекста

- apply_patch
  - Обновление practices/practice_06/AGENTS.md
  - Обновление practices/practice_06/lab/service.py (несколько патчей)
  - Обновление practices/practice_06/judge-system-prompt.md
  - Добавление practices/practice_06/REPORT_01.md
  - Добавление и обновление practices/practice_06/REPORT_02.md
  - Обновление practices/practice_06/REPORT_01.md (фикс секции LLM)
  - Добавление practices/practice_06/METAREPORT.md

- bash (основные вызовы)
  - make install && make test (workdir: practices/practice_06/lab)
  - python3 service.py --port 8066 (workdir: practices/practice_06/lab)
  - setsid bash -lc 'mkdir -p /tmp/opencode && nohup python3 service.py --port 8066 >/tmp/opencode/practice06_server.log 2>&1 & echo $!'
  - Python inline (urllib.request): сбор PoC через HTTP, сохранение evidence/before (часть запросов с пробелами в URL — зафиксированные ошибки)
  - Python inline (Shop().dispatch): сбор evidence/before (workdir: lab)
  - make test (после фиксов)
  - Python inline (Shop().dispatch): сбор evidence/after (workdir: lab)
  - opencode run --help
  - opencode run --dir practices/practice_06 --agent shop-planner --format json --file practices/practice_06/evidence/after/assistant_context.json --model openai/gpt-5 (ошибка модели/пути)
  - Генерация evidence/after/assistant_context.json (Shop)
  - opencode run --dir . --agent shop-planner --format json --file practices/practice_06/evidence/after/assistant_context.json ... (требовалось сообщение)
  - opencode run (успешный запуск) в каталоге practices/practice_06, с сообщением и --file evidence/after/assistant_context.json
  - Аналогичный запуск для malicious-контекста
  - tail/sed чтение /tmp/opencode/*.jsonl
  - Выполнение решения модели через /assistant/execute (urllib.request; Python inline)
  - Формирование malicious-контекста: добавление отзыва и сохранение контекста (через Shop и через HTTP)
  - Навигация и проверка файлов: pwd, ls -la, ls -la evidence/after

Примечание: многие PoC и evidence формировались как одноразовые Python-скрипты внутри bash-инструмента, чтобы не засорять репозиторий вспомогательными файлами.

## Координация

- Работа велась по AGENTS.md: 
  - Этап 1 — анализ и PoC, evidence/before.
  - Этап 2 — минимальные фиксы и тесты.
  - Этап 3 — повторные проверки, LLM-прогоны, evidence/after.
- Сервер поднимался в фоне для LLM-прогонов; для PoC преимущественно использовался Shop().dispatch.
