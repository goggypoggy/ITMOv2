# Отчёт: локальные модели

Отчёт ведёт OpenCode по фактическим результатам команд и вашим сообщениям в чате. Поручите агенту заполнить разделы и показать diff. Выводы студента он записывает после обсуждения; отсутствующие измерения отмечает как невыполненные.

## Окружение

ОС / CPU / GPU / RAM / VRAM / свободный диск:
- Ubuntu 26.04 (WSL2) / Intel i7-12700F (20 CPU, 10C/20T) / NVIDIA GeForce RTX 3060 / 15 GiB RAM / 12 GiB VRAM / ~949 GiB free

Ollama или LM Studio / OpenCode / Python, версии:
- Ollama 0.34.4 / OpenCode 1.18.32 / Python 3.14.4

Модель, разработчик, семейство, тег и ID:
- qwen3.5:4b (family: qwen35)

Формат, квантизация, лицензия, источник:
- gguf, quantization: Q4_K_M, источник: ollama pull (локально установлена)

Фактический контекст, размещение CPU/GPU:
- По show tags: context_length 262144; размещение уточняется в разделе «Воспроизведение» по ollama ps

Почему выбрана эта конфигурация:
- 4B — базовый вариант практики, баланс скорости/качества; 12GB VRAM и 15GB RAM достаточны для локального запуска и экспериментов

## Сравнение семейств

| Разработчик / модель | Задача | Параметры / формат | Лицензия | Язык / tools | Источник |
|---|---|---|---|---|---|
| | | | | | |
| | | | | | |

## Воспроизведение

Команды и файлы конфигурации:
- lab/Modelfile (FROM qwen3.5:4b)
- ollama create itmo-local -f Modelfile
- ollama run itmo-local "Объясни разницу между моделью и сервером двумя предложениями"
- python3 experiment.py --mode baseline --output results/baseline.json

Подтверждение локального endpoint и скачанных весов:
- curl http://localhost:11434/api/tags -> присутствуют qwen3.5:4b и itmo-local
Проверка без сети после подготовки:
Если работали в паре, чей компьютер и почему:

## Эксперимент

Фактор A/B:
- Наличие system prompt: baseline (без system) vs system.txt

Неизменные условия:
- Модель: qwen3.5:4b, temperature=0.2, seed=42, think=false, num_ctx=4096, num_predict=512

| Вопрос | Эталон и file:line | Ответ A | Ответ B | Верно A/B | Наблюдение инструментов |
|---|---|---|---|---|---|
| Какая CI-система запускает тесты проекта? | README.md:6-7 — указана только команда `make test`, CI не указан | Baseline: нет конкретной CI; описаны шаги проверки CI-файлов | System: «В предоставленных материалах нет ответа» + основание | A: частично; B: да | Один и тот же вход, одинаковые параметры |
| Как запустить тесты? | README.md:6 — `make test` | — | make test (README.md:6) | B: да | read(README.md) |
| Пустое имя подписчика? | service.py:5-6; test_service.py:13-15 | — | ValueError("empty name"); подтверждено тестом | B: да | read(service.py); read(test_service.py) |
| Где реализован unsubscribe? | service.py; test_service.py — отсутствует | — | Функции нет; предпосылка неверна | B: да | glob; read(service.py); read(test_service.py) |
| Какая CI запускает тесты? | README.md:6-7 — сведений нет | — | В прочитанных файлах сведений нет | B: да | step-only (без доп. tools) |
| Сохраняются ли подписки после перезапуска? | service.py:1; test_service.py:7 | — | Не сохраняются; subscribers пересоздаётся | B: да | read(service.py); read(test_service.py) |

Наблюдения:
- При temperature=0.8, seed=42 (hot42_r1..r3) модель привела примеры возможных CI-файлов/папок (например, `.github/workflows/`, `travis.yml`, `circleci`). Это не утверждение о наличии в репозитории, но выходит за формат «краткий ответ + основание».

## Локальная модель в OpenCode

Команды и проверка:
- ollama create itmo-agent -f Modelfile.agent
- ollama show itmo-agent; ollama run itmo-agent "Ответь: READY"
- ollama ps — контекст и размещение
- opencode run --dir demo --agent local-guide --model ollama/itmo-agent --format json "Прочитай README.md инструментом read. Назови команду тестирования со ссылкой на файл" > results/read-check.jsonl

Факты:
- Фактический контекст (ollama ps): 65536, размещение: 100% GPU
- read-check.jsonл: событие tool=read (README.md), ответ — make test (README.md:6)

Пять вопросов:
- Q1: Как запустить тесты? Ответ: make test (источник: README.md:6). События: glob, read(README.md)
- Q2: Пустое имя подписчика? Ответ: ValueError("empty name") (источник: service.py:5-6; подтверждение тестом test_service.py:13-15). События: read(service.py), read(test_service.py)
- Q3: Где реализован unsubscribe? Ответ: отсутствует (источники: service.py, test_service.py). События: glob, read(service.py), read(test_service.py)
- Q4: Какая CI? Ответ: сведений нет в прочитанных файлах. События: step-only (без дополнительных tools) — ок, так как вопрос о наличии сведений
- Q5: Сохраняются ли подписки после перезапуска? Ответ: нет; subscribers инициализируется пустым set при старте (источники: service.py:1; test_service.py:7). События: read(service.py), read(test_service.py)

## Скорость

Холодный старт отдельно:
- baseline: wall_seconds ~2.997, total_seconds ~2.988, load_seconds ~0.001
- system (первый запуск): wall_seconds ~15.388, total_seconds ~15.376, load_seconds ~13.796

Три прогретых повтора и медиана:
- Медианы по 3 повторам на seed (wall / total / decode tok/s):
  - hot 42: 2.956 / 2.937 / 64.254
  - hot 43: 5.838 / 5.797 / 65.355
  - hot 44: 8.379 / 8.354 / 62.934
  - cool 42: 3.049 / 3.038 / 63.275
  - cool 43: 6.252 / 6.242 / 64.353
  - cool 44: 8.849 / 8.817 / 65.993

Единицы и метод замера:
- секунды; метрики из ответа Ollama (eval_count/duration), wall_seconds по perf_counter

TTFT измерен или не измерен:
- не измерен (stream=false)

## Вывод

Ошибка или обнаруженное ограничение:
- На temperature=0.8 (hot42) модель добавляла примеры потенциальных CI-файлов, что выходит за заданный формат «краткий ответ + основание».
- Первый запуск system дал значительный холодный старт (load ~13.8s), что влияет на wall_seconds.
- Ограничения прав агента local-guide запрещают запуск shell-команд (bash) — попытки отклонены, что корректно по требованиям.

Как проверили:
- Сравнили baseline vs system на одном вопросе; проверили содержимое results/*.json.
- Выполнили 18 прогретых повторов (temperature 0.2 и 0.8; seeds 42/43/44) и зафиксировали метрики wall/total/decode.
- Подтвердили через OpenCode реальный вызов инструмента read и соответствие ответов файлам demo/.
- make test в lab/ прошёл: 3 теста OK.

Какой конфигурацией будете пользоваться:
- Модель qwen3.5:4b; температурa 0.2 для надёжности формата; system prompt из system.txt для API-этапов; профиль itmo-agent с num_ctx 65536 на GPU для OpenCode.

Что осталось непроверенным:
- TTFT не измерен (stream=false), как и предусмотрено.
- Проверка поведения на больших входах при контексте 64k (ограничена текущим README.md). При расширении задач стоит повторить на более длинных документах.
