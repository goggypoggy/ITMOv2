# HISTORY

## Шаг 0: Инициализация
- Создан файл HISTORY.md для фиксации действий и результатов.
- План на этап 0–10: собрать характеристики устройства, версии инструментов; запустить `make install` и `make test` из `lab/`; обсудить и зафиксировать выбор модели.
- Ожидаю подтверждение на запуск диагностики окружения и тестов.

## Шаг 1: Диагностика окружения
- ОС и ядро (uname -a):
  Linux Gosha-PC 6.18.33.2-microsoft-standard-WSL2 #1 SMP PREEMPT_DYNAMIC Thu Jun 18 21:54:43 UTC 2026 x86_64 GNU/Linux
- Дистрибутив (/etc/os-release):
  Ubuntu 26.04 (Resolute Raccoon)
- CPU (lscpu): 12th Gen Intel(R) Core(TM) i7-12700F, 20 CPU(s), 10 cores/2 threads per core
- Память (free -h): 15Gi total, 14Gi available
- Диск (df -h /): 1007G total, 949G avail
- GPU (nvidia-smi): GeForce RTX 3060, 12GB VRAM, доступна в WSL; занято ~454MiB
- Ollama версия: 0.34.4
- OpenCode версия: 1.18.32
- Python версия: 3.14.4
- Ollama API /api/tags: модель qwen3.5:4b доступна; формат gguf; family qwen35; quantization Q4_K_M; context_length 262144

## Шаг 2: Проверка lab
- Команда: make install (из lab/) -> Standard library only: ready
- Команда: make test (из lab/) -> 3 tests OK (test_duplicate, test_empty, test_subscribe)

## Шаг 3: Локальный сервер — baseline
- Команды (из lab/):
  - mkdir -p results
  - ollama create itmo-local -f Modelfile -> создан профиль itmo-local (FROM qwen3.5:4b)
  - ollama run itmo-local "Объясни разницу между моделью и сервером двумя предложениями" -> факт ответа зафиксирован
  - curl --fail http://localhost:11434/api/tags -> показал itmo-local и qwen3.5:4b
  - python3 experiment.py --mode baseline --output results/baseline.json -> файл создан
- Файл результата: results/baseline.json (ответ, метрики, скорость декодирования ~72 ток/с)

## Шаг 4: System prompt (A/B)
- Команда (из lab/): python3 experiment.py --mode system --output results/system.json
- Файл результата: results/system.json (ответ: признано отсутствие данных; формат: короткий ответ + основание)
- Метрики: wall_seconds ~15.388; load_seconds ~13.796 (холодная загрузка); decode_tokens_per_second ~65.76

## Шаг 5: Одна настройка — план запусков
- Конфигурации: mode=system; температуры 0.8 (hot) и 0.2 (cool); seeds: 42, 43, 44
- Для каждой конфигурации: 3 прогретых повтора; уникальные файлы в lab/results/
- Имена файлов: hot{seed}_r{n}.json и cool{seed}_r{n}.json

## Шаг 6: Одна настройка — выполнение запусков
- Выполнены hot (0.8): hot42_r1..r3, hot43_r1..r3, hot44_r1..r3
- Выполнены cool (0.2): cool42_r1..r3, cool43_r1..r3, cool44_r1..r3
- Все ответы соответствуют system.txt: признано отсутствие сведений о CI, формат соблюдён

## Шаг 7: Локальная модель в OpenCode
- Команды (из lab/):
  - ollama create itmo-agent -f Modelfile.agent -> создан профиль itmo-agent
  - ollama show itmo-agent -> context length 262144; параметры num_ctx=65536
  - ollama run itmo-agent "Ответь: READY" -> READY
  - ollama ps -> itmo-agent: контекст 65536; размещение: 100% GPU
  - opencode run --dir demo --agent local-guide --model ollama/itmo-agent --format json "Прочитай README.md инструментом read. Назови команду тестирования со ссылкой на файл" > results/read-check.jsonl
- read-check.jsonl: содержит фактический вызов инструмента read для файла demo/README.md и ответ с указанием команды `make test` и ссылки на файл (README.md:6)
- Вопросы (5 запусков):
  - q1: команда тестирования — подтверждена read(README.md:6)
  - q2: пустое имя — read(service.py:5-6), read(test_service.py:13-15); bash-запуск тестов запрещён, только чтение
  - q3: unsubscribe отсутствует — read(service.py), read(test_service.py)
  - q4: CI — отдельный запуск завершился быстро без вывода (step-only), подтверждение отсутствия сведений зафиксировано ранее
  - q5: сохранность подписок — read(service.py:1), read(test_service.py:7); вывод: не сохраняются
  - make test (из lab/): 3 теста OK
