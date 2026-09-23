"""Remote Ollama client (Bearer). Falls back to empty string on failure."""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request

from django.conf import settings

logger = logging.getLogger(__name__)


def ollama_configured() -> bool:
    return bool(
        settings.OLLAMA_ENABLED
        and settings.OLLAMA_URL
        and settings.OLLAMA_API_KEY
        and settings.LLAMA_MODEL
    )


def generate(prompt: str) -> str:
    """POST /api/generate — returns model text or ''."""
    if not ollama_configured() or not prompt.strip():
        return ''

    payload = json.dumps(
        {
            'model': settings.LLAMA_MODEL,
            'prompt': prompt,
            'stream': False,
            'options': {'temperature': 0.3},
        }
    ).encode('utf-8')
    url = f'{settings.OLLAMA_URL}/api/generate'
    request = urllib.request.Request(
        url,
        data=payload,
        headers={
            'Authorization': f'Bearer {settings.OLLAMA_API_KEY}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )
    try:
        with urllib.request.urlopen(request, timeout=settings.OLLAMA_TIMEOUT) as response:
            raw = json.loads(response.read().decode('utf-8'))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, OSError) as exc:
        logger.warning('Ollama generate failed: %s', exc)
        return ''

    text = str(raw.get('response') or '').strip()
    if not text:
        logger.warning('Ollama returned an empty response.')
    return text
