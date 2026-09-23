"""Gmail-safe HTML wrapper — MediaCBD forest / paper palette."""

from __future__ import annotations

import html
import re

_URL_RE = re.compile(r'(https?://[^\s<]+)')
_BULLET_RE = re.compile(r'^[•\-]\s+')


def escape_and_link(text: str) -> str:
    escaped = html.escape(text, quote=True)
    return _URL_RE.sub(
        r'<a href="\1" style="color:#b86b2e;text-decoration:underline;">\1</a>',
        escaped,
    )


def body_to_html_blocks(body: str) -> str:
    chunks: list[str] = []
    for raw_block in re.split(r'\n\s*\n', body.strip()):
        lines = [ln for ln in raw_block.split('\n')]
        stripped = [ln.strip() for ln in lines if ln.strip()]
        if stripped and all(_BULLET_RE.match(ln) for ln in stripped):
            items = ''.join(
                f'<li style="margin:0 0 8px;">{escape_and_link(_BULLET_RE.sub("", ln))}</li>'
                for ln in stripped
            )
            chunks.append(
                f'<ul style="margin:0 0 18px;padding-left:20px;color:#3d5246;">{items}</ul>'
            )
            continue
        inner = '<br>'.join(escape_and_link(ln) for ln in lines)
        chunks.append(
            f'<p style="margin:0 0 16px;line-height:1.65;color:#13261c;font-size:16px;">{inner}</p>'
        )
    return ''.join(chunks)


def wrap_html(*, subject: str, body: str, media_name: str, media_url: str) -> str:
    content = body_to_html_blocks(body)
    title = html.escape(subject)
    brand = html.escape(media_name)
    href = html.escape(media_url, quote=True)
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
</head>
<body style="margin:0;padding:0;background:#e8efe6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#e8efe6;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;width:100%;background:#fcfdfb;border:1px solid #d5e0d4;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background:#0f281c;padding:22px 28px;">
              <p style="margin:0 0 4px;font-family:Georgia,Times,serif;font-size:22px;letter-spacing:0.04em;color:#f5f8f3;">{brand}</p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8fad87;">Radar CBD France–Europe · annuaire partenaires</p>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 28px 8px;font-family:Arial,Helvetica,sans-serif;">
              {content}
            </td>
          </tr>
          <tr>
            <td style="padding:8px 28px 28px;font-family:Arial,Helvetica,sans-serif;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background:#f3e6d8;border-left:3px solid #b86b2e;padding:12px 14px;color:#3d5246;font-size:13px;">
                    Fiche partenaire MediaCBD — pas un classement, pas de garantie de trafic.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="background:#f5f8f3;border-top:1px solid #d5e0d4;padding:16px 28px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#5f7f6d;">
              <a href="{href}" style="color:#1a3d2e;font-weight:bold;text-decoration:none;">{brand}</a>
              · <a href="{href}" style="color:#5f7f6d;">{href}</a><br>
              Pour ne plus recevoir de propositions, répondez STOP.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""
