"""Validate distribution identity, checksums and native data; no UI checks."""
import hashlib
import json
from pathlib import Path
import tomllib

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / 'lig-build.json').read_text())
port = manifest['port']
repositories = {'vscode': 'vscode-theme-LiG', 'zed': 'zed-theme-LiG'}
assert manifest['distributionRepository'] == f"https://github.com/0froq/{repositories[port]}"
assert manifest['sourceRepository'] == 'https://github.com/0froq/lig'
assert manifest['variants'] == ['light', 'dark', 'light-paper', 'dark-paper']
for name, expected in manifest['files'].items():
    path = (root / name).resolve()
    assert path.is_relative_to(root), name
    assert hashlib.sha256(path.read_bytes()).hexdigest() == expected, name
if port == 'vscode':
    package = json.loads((root / 'package.json').read_text())
    assert package['publisher'] == 'froQ' and package['name'] == 'theme-lig'
    assert package['version'] == manifest['packageVersion']
    assert len(package['contributes']['themes']) == 4
    for entry, variant in zip(package['contributes']['themes'], manifest['variants']):
        assert entry['path'] == f'./themes/lig-{variant}.json'
        theme = json.loads((root / entry['path']).read_text())
        assert theme['name'] == entry['label']
        assert 'Soft' not in theme['name'] and 'Preview' not in theme['name']
        assert theme['type'] == ('dark' if variant.startswith('dark') else 'light')
        assert theme['semanticHighlighting']
        assert theme['semanticTokenColors']['string']['foreground'] != theme['colors']['editor.foreground']
else:
    package = tomllib.loads((root / 'extension.toml').read_text())
    assert package['id'] == 'lig' and package['version'] == manifest['packageVersion']
    assert package['repository'] == manifest['distributionRepository']
    for variant in manifest['variants']:
        family = json.loads((root / f'themes/lig-{variant}.json').read_text())
        assert len(family['themes']) == 1
        theme = family['themes'][0]
        assert theme['appearance'] == ('dark' if variant.startswith('dark') else 'light')
        assert theme['style']['syntax']['string']['color'] != theme['style']['editor.foreground']
print(f"Verified {port} {manifest['packageVersion']}: {len(manifest['files'])} payload checksums and four native variants")
