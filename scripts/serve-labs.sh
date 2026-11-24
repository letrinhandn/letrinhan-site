#!/usr/bin/env bash
# Alias: durable multi-port lab static server
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
exec python3 "$ROOT/scripts/lab_static_server.py"
