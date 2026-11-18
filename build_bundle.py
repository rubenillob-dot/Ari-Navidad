#!/usr/bin/env python3
import re
import os

modules = [
    ('js/modules/snow.js', 'js/modules/snow.js'),
    ('js/modules/confetti.js', 'js/modules/confetti.js'),
    ('js/modules/audio.js', 'js/modules/audio.js'),
    ('js/modules/router.js', 'js/modules/router.js'),
    ('js/modules/twitch-chat.js', 'js/modules/twitch-chat.js'),
    ('js/modules/roulette.js', 'js/modules/roulette.js'),
    ('js/modules/minigame1.js', 'js/modules/minigame1.js'),
    ('js/modules/minigame2.js', 'js/modules/minigame2.js'),
    ('js/modules/minigame3.js', 'js/modules/minigame3.js'),
    ('js/modules/minigame4.js', 'js/modules/minigame4.js'),
    ('js/modules/minigame5.js', 'js/modules/minigame5.js'),
    ('js/main.js', 'js/main.js')
]

out = []
out.append("/**\n * Ari-Navidad Unified Production Bundle\n * Zero-dependency, file:// and http/https compatible.\n */\n(function() {\n\n")

for filepath, label in modules:
    out.append(f"\n// ==========================================\n// MODULE: {label}\n// ==========================================\n")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Remove imports (single line and multi-line)
    content = re.sub(r'import\s+[\s\S]*?from\s+[\'"][^\'"]+[\'"];?', '', content)

    # Replace export class
    content = re.sub(r'export\s+class\s+', 'class ', content)
    # Replace export const / let / var / function
    content = re.sub(r'export\s+(const|let|var|function)\s+', r'\1 ', content)
    # Replace export default
    content = re.sub(r'export\s+default\s+', '', content)
    # Replace named exports like export { ... };
    content = re.sub(r'export\s*\{[\s\S]*?\};?', '', content)

    out.append(content)
    out.append("\n")

out.append("\n})();\n")

with open('js/bundle.js', 'w', encoding='utf-8') as f:
    f.write(''.join(out))

print("Successfully built js/bundle.js")
