#!/usr/bin/env bash
# Boot hub (Vite) + all lab static sites on local ports.
# Hub drawer rewrites github.io → 127.0.0.1:420x when opened on localhost.
set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GITHUB_ROOT="$(cd "$SITE_ROOT/.." && pwd)"
export PATH="/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/homebrew/bin:$HOME/.local/bin:$PATH"

echo "== render labs if _site missing =="
for lab in philosophy-lab tech-lab economic-lab policy-lab music-lab research-lab; do
  if [[ ! -f "$GITHUB_ROOT/$lab/_site/index.html" ]]; then
    echo "rendering $lab…"
    (cd "$GITHUB_ROOT/$lab" && quarto render --to html)
  else
    echo "ok $lab/_site"
  fi
done

echo "== stop old lab/hub listeners =="
pkill -f "lab_static_server.py" 2>/dev/null || true
pkill -f "python3 -m http.server 420" 2>/dev/null || true
pkill -f "quarto preview" 2>/dev/null || true
for p in 4201 4202 4203 4204 4205 4206; do
  lsof -ti tcp:"$p" 2>/dev/null | xargs kill -9 2>/dev/null || true
done
# leave 5173 alone if already our vite; restart only if dead
HUB_UP=0
curl -sf --max-time 2 "http://127.0.0.1:5173/letrinhan-site/" >/dev/null && HUB_UP=1 || true

echo "== start lab static server =="
nohup python3 "$SITE_ROOT/scripts/lab_static_server.py" \
  >"$SITE_ROOT/scripts/lab-static.log" 2>&1 &
LAB_PID=$!
disown "$LAB_PID" 2>/dev/null || true
echo "lab_static_server pid $LAB_PID"

if [[ "$HUB_UP" -eq 0 ]]; then
  echo "== start hub vite :5173 =="
  lsof -ti tcp:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
  (
    cd "$SITE_ROOT"
    nohup npm run dev -- --host 127.0.0.1 --port 5173 \
      >"$SITE_ROOT/scripts/hub-vite.log" 2>&1 &
    disown
  )
fi

sleep 1.5
echo "== health =="
for p in 4201 4202 4203 4204 4205 4206; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://127.0.0.1:$p/" || echo fail)
  echo "  :$p → $code"
done
code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "http://127.0.0.1:5173/letrinhan-site/" || echo fail)
echo "  hub → $code"
echo
echo "Open http://127.0.0.1:5173/letrinhan-site/"
echo "Drawer: Philosophy 4201 / Programming 4202 / Economics 4203 / Policy 4204 / Music 4205 / Research 4206"
