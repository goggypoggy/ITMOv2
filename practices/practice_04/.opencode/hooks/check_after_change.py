#!/usr/bin/env python3
"""
Hook: runs project tests after agent-applied changes.
Runs `npm test` in the project root (two levels up from this file: .opencode/hooks/.. -> project).
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path


def main() -> int:
    # Determine project root relative to this hook file
    hook_path = Path(__file__).resolve()
    # .../.opencode/hooks/check_after_change.py -> project root is parents[2]
    project_root = hook_path.parents[2]

    print("[hook] Running npm test in:", project_root)
    try:
        # Capture output so we can downgrade "No tests found" to success
        proc = subprocess.run(
            ["npm", "test"],
            cwd=str(project_root),
            check=False,
            capture_output=True,
            text=True,
        )
        if proc.stdout:
            sys.stdout.write(proc.stdout)
        if proc.stderr:
            sys.stderr.write(proc.stderr)
        # Treat absence of tests as a neutral, successful run to avoid noisy failures early on
        combined = (proc.stdout or "") + (proc.stderr or "")
        if "No tests found" in combined:
            print("[hook] No tests found; treating as success for now.")
            return 0
        print(f"[hook] npm test exited with code {proc.returncode}")
        return proc.returncode
    except FileNotFoundError:
        print("[hook] npm is not available in PATH. Skipping tests.", file=sys.stderr)
        return 0
    except Exception as e:
        print(f"[hook] Unexpected error: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
