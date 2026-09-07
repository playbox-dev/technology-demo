#!/usr/bin/env python3
"""Rebuild the self-contained Studio embed without changing the canonical demo.

Run from any directory with Python 3. The original nine scripts retain their
order and contents, inside one lexical scope executed after the body markup.
Remote videos and source/case links retain their original URLs.
"""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
DEMO = ROOT / "src"
OUTPUT = ROOT / "index.html"
EXPECTED_SCRIPTS = [
    "data.js", "spatial.js", "alignment-core.js", "football-aligned.js",
    "racing-aligned.js", "spaces-aligned.js", "retail-aligned.js",
    "work-aligned.js", "app.js",
]

OVERRIDES = """
/* The embed owns the Technology heading; Studio owns width and outer spacing. */
#pb-five.technology{max-width:none;width:100%;padding:0;margin:0}
#pb-five .embed-notes{display:flex;justify-content:flex-end;border-top:1px solid var(--line);margin-top:16px;padding-top:8px}
#pb-five .embed-notes .demo-notes{padding-top:0}
@media(max-width:620px){#pb-five .embed-notes{justify-content:flex-start}}
"""

# These facades are local to this bundle. An opaque/sandboxed iframe may reject
# replaceState; that must never abort scene initialization or a scene switch.
# Reading or writing parent location/history is intentionally unnecessary.
PRELUDE = """(() => {
'use strict';
const location = {get hash(){try{return window.location.hash || '';}catch{return '';}}};
const history = {replaceState(...args){try{window.history.replaceState(...args);}catch{/* Hash is optional in a sandboxed Studio iframe. */}}};
"""


def build():
    original = (DEMO / "index.html").read_text(encoding="utf-8")
    names = re.findall(r'<script src="\./([^"]+)" defer></script>', original)
    if names != EXPECTED_SCRIPTS:
        raise ValueError(f"Review changed script order before bundling: {names}")
    body = re.search(r"<body>([\s\S]*?)</body>", original).group(1)
    assert body.count('<header class="section-header">') == 1, "Keep the new Technology heading inside the embed."
    assert '<h1>Our Technology</h1>' in body and 'class="research-link"' in body
    body, n = re.subn(
        r'<footer class="next-section">\s*<div><h2>Case Study</h2>[\s\S]*?</div></div>',
        '<footer class="embed-notes">', body, count=1,
    )
    assert n == 1, "The next native Studio section must not be duplicated."
    assert 'id="scene-note"' in body and 'id="source-credit"' in body
    assert body.count('data-scene=') == 5 and 'id="scene-announcement"' in body
    css = (DEMO / "styles.css").read_text(encoding="utf-8") + OVERRIDES
    if re.search(r"</style", css, re.IGNORECASE):
        raise ValueError("Unexpected style terminator in CSS")
    scripts = []
    for name in names:
        js = (DEMO / name).read_text(encoding="utf-8")
        # Prevent the HTML parser from treating string content as a closing tag.
        js = re.sub(r"</script", r"<\\/script", js, flags=re.IGNORECASE)
        scripts.append(f"\n/* Source: {name} */\n{js}\n;")
    javascript = PRELUDE + "\n".join(scripts) + "\n})();\n"
    html = f'''<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Technology demo — playbox</title>
  <style>{css}</style>
</head>
<body>{body}
<!-- Run after the markup, without relying on DOMContentLoaded in an embed. -->
<script>{javascript}</script>
</body>
</html>
'''
    OUTPUT.write_text(html, encoding="utf-8")
    print(f"{OUTPUT}\n{len(html):,} characters; {len(html.encode('utf-8')):,} bytes")
    return html, javascript


if __name__ == "__main__":
    build()
