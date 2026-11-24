#!/usr/bin/env python3
"""Serve all Quarto lab _site folders on fixed local ports (one durable process)."""
from __future__ import annotations

import functools
import http.server
import os
import signal
import socketserver
import sys
import threading
from pathlib import Path

GITHUB_ROOT = Path(__file__).resolve().parents[2]

LABS = (
    ("philosophy-lab", 4201),
    ("tech-lab", 4202),
    ("economic-lab", 4203),
    ("policy-lab", 4204),
    ("music-lab", 4205),
    ("research-lab", 4206),
)


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt: str, *args) -> None:  # noqa: A003
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def serve_directory(directory: Path, port: int) -> socketserver.ThreadingTCPServer:
    handler = functools.partial(QuietHandler, directory=str(directory))
    # Allow quick restart after crash
    socketserver.ThreadingTCPServer.allow_reuse_address = True
    httpd = socketserver.ThreadingTCPServer(("127.0.0.1", port), handler)
    httpd.daemon_threads = True
    return httpd


def main() -> int:
    servers: list[socketserver.ThreadingTCPServer] = []
    threads: list[threading.Thread] = []

    for name, port in LABS:
        site = GITHUB_ROOT / name / "_site"
        if not site.is_dir() or not (site / "index.html").is_file():
            print(f"MISSING {site} — run: (cd {GITHUB_ROOT / name} && quarto render)", file=sys.stderr)
            return 1
        httpd = serve_directory(site, port)
        servers.append(httpd)
        t = threading.Thread(target=httpd.serve_forever, name=f"lab-{port}", daemon=True)
        t.start()
        threads.append(t)
        print(f"OK {name} → http://127.0.0.1:{port}/")

    stop = threading.Event()

    def shutdown(*_args) -> None:
        stop.set()
        for httpd in servers:
            httpd.shutdown()

    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)

    print("lab static server running (ctrl-c to stop)", flush=True)
    try:
        while not stop.wait(3600):
            pass
    finally:
        for httpd in servers:
            try:
                httpd.server_close()
            except Exception:
                pass
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
