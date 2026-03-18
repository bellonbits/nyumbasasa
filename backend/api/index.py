"""
Vercel serverless entrypoint for the NyumbaSasa FastAPI app.

Vercel's Python runtime expects a BaseHTTPRequestHandler subclass — it calls
issubclass(handler, BaseHTTPRequestHandler) at init time, so a Mangum instance
(which is not a class) crashes the runtime. We bridge ASGI → WSGI manually.
"""
import sys
import os

# Ensure project root is on sys.path so `app.*` imports resolve.
_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if _root not in sys.path:
    sys.path.insert(0, _root)

# Point Prisma to the pre-bundled query engine binary (avoids binary-download
# at cold-start and the /tmp write issues on Vercel Lambda).
os.environ.setdefault("PRISMA_QUERY_ENGINE_BINARY", "/var/task/bin/query-engine")

import asyncio
from io import BytesIO
from http.server import BaseHTTPRequestHandler

from app.main import app
from app.database import connect_db

# ── single event loop shared across warm invocations ─────────────────────────
_loop = asyncio.new_event_loop()
asyncio.set_event_loop(_loop)
_loop.run_until_complete(connect_db())


class handler(BaseHTTPRequestHandler):
    """WSGI-style handler that bridges each HTTP request to the ASGI app."""

    # ── HTTP verbs ────────────────────────────────────────────────────────────
    def do_GET(self):     self._run()
    def do_POST(self):    self._run()
    def do_PUT(self):     self._run()
    def do_PATCH(self):   self._run()
    def do_DELETE(self):  self._run()
    def do_OPTIONS(self): self._run()
    def do_HEAD(self):    self._run()

    def log_message(self, fmt, *args):
        pass  # silence default BaseHTTPRequestHandler access log

    # ── bridge ────────────────────────────────────────────────────────────────
    def _run(self):
        _loop.run_until_complete(self._asgi_bridge())

    async def _asgi_bridge(self):
        path = self.path
        query_string = b""
        if "?" in path:
            path, qs = path.split("?", 1)
            query_string = qs.encode("latin-1")

        headers_list = [
            (k.lower().encode("latin-1"), v.encode("latin-1"))
            for k, v in self.headers.items()
        ]

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length) if content_length else b""

        scope = {
            "type": "http",
            "asgi": {"version": "3.0"},
            "http_version": "1.1",
            "method": self.command.upper(),
            "headers": headers_list,
            "path": path,
            "raw_path": path.encode("latin-1"),
            "query_string": query_string,
            "root_path": "",
            "scheme": "https",
            "server": ("0.0.0.0", 443),
        }

        resp: dict = {"status": 500, "headers": []}
        body_out = BytesIO()

        async def receive():
            return {"type": "http.request", "body": body, "more_body": False}

        async def send(message):
            if message["type"] == "http.response.start":
                resp["status"] = message["status"]
                resp["headers"] = message.get("headers", [])
            elif message["type"] == "http.response.body":
                body_out.write(message.get("body", b""))

        await app(scope, receive, send)

        self.send_response(resp["status"])
        for k, v in resp["headers"]:
            self.send_header(
                k.decode("latin-1") if isinstance(k, bytes) else k,
                v.decode("latin-1") if isinstance(v, bytes) else v,
            )
        self.end_headers()
        self.wfile.write(body_out.getvalue())
