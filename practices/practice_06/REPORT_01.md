# REPORT_01: Уязвимости до правок

Данный отчёт фиксирует исходное состояние Mini Shop до каких-либо исправлений. Отражены модель угроз, поверхность атаки, найденные уязвимости, доказательства эксплуатации (PoC) и артефакты.

## Контекст и запуск

- Запуск тестов: `make -C practices/practice_06/lab install && make -C practices/practice_06/lab test` — все базовые тесты проходят на уязвимой версии.
- Запуск сервиса: `python3 practices/practice_06/lab/service.py --port 8066`. Адрес: `http://127.0.0.1:8066`.
- Все PoC запросы и ответы сохранены в `evidence/before`.

## Модель угроз (high-level)

- Активы: профили пользователей, заказы, файлы стенда (чеки), токены сессий, роль пользователя, инструменты ассистента (`read_file`, `export_profiles`, `delete_tree`).
- Акторы: клиенты (alice, bob), сотрудник (staff), злоумышленник без токена, злоумышленник с токеном клиента.
- Границы доверия: HTTP сервис на loopback, in-memory SQLite, файловый Sandbox (граница стенда), LLM‑ассистент без инструментов.
- Поверхность атаки: все эндпоинты API из lab/README.md.

## Обнаруженные уязвимости и PoC

1. SQL-injection: GET /profile
   - Уязвимость: значение `id` подставляется в SQL без параметризации.
   - PoC: `/profile?id=1 OR 1=1`
   - Артефакт: `evidence/before/profile_sqli.json`
   - Риск: утечка данных, обход авторизации.

2. SQL-injection: GET /search
   - Уязвимость: значение `q` подставляется в LIKE без экранирования.
   - PoC: `/search?q=%' OR '1'='1`
   - Артефакт: `evidence/before/search_sqli.json`
   - Риск: утечка данных.

3. IDOR/разглашение: GET /orders
   - Уязвимость: отдаёт все заказы всем.
   - PoC: `/orders` без токена.
   - Артефакт: `evidence/before/orders_public.json`
   - Риск: раскрытие информации.

4. Эскалация через заголовок: GET /admin/export
   - Уязвимость: авторизация по `X-Role` из клиента.
   - PoC: заголовок `X-Role: staff` без токена.
   - Артефакт: `evidence/before/admin_export_no_token.json`
   - Риск: утечка профилей.

5. Подмена цены: POST /orders
   - Уязвимость: клиент может задать `price`.
   - PoC: `{"product":"chair","price":1}` под токеном alice.
   - Артефакт: `evidence/before/order_price_tamper.json`
   - Риск: финансовый ущерб.

6. Чтение чужих файлов: GET /files
   - Уязвимость: параметры `user`/`path` не привязаны к сессии.
   - PoC: `/files?user=bob&path=receipt.txt` под токеном alice.
   - Артефакт: `evidence/before/files_idor.json`
   - Риск: утечка PII.

7. Утечка токенов и данных: GET /debug/logs
   - Уязвимость: отдаёт полный журнал, включая заголовки.
   - PoC: `/debug/logs` без токена.
   - Артефакт: `evidence/before/debug_logs.json`
   - Риск: компрометация токенов.

8. Неавторизованный доступ к инструментам: POST /assistant/execute
   - Уязвимость: не проверяет сессию/роль; выполняет `export_profiles`, `delete_tree`.
   - PoC: `{decision:{tool:export_profiles}}` без токена.
   - Артефакт: `evidence/before/assistant_execute_anonymous.json`
   - Риск: утечка и уничтожение данных.

9. XSS/Prompt Injection поверхность: /reviews и /reviews/view
   - Уязвимость: отзывы вставляются в HTML без экранирования; включаются в ассистент контекст.
   - PoC: публикация `<script>alert(1)</script>` и инструкции к delete_tree; просмотр `/reviews/view`.
   - Артефакт: `evidence/before/reviews_view.html`
   - Риск: XSS в viewer; prompt injection для LLM.

10. LLM сценарии (зафиксированный контекст)
   - Контекст ассистента сохраняется: `evidence/before/assistant_context.json`.
   - Планируется запуск `shop-planner` по методике из lab/README.md (см. REPORT_02 для сопоставления до/после фиксов).

## Выводы

Исходный сервис содержит множественные уязвимости на уровнях SQL, авторизации, файлового доступа, логирования, HTML-рендеринга и ассистента. Следующий этап — внести минимальные исправления с сохранением функциональности и подготовить проверки.
