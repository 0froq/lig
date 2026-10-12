"""Import a checksum-verified canonical editor distribution. Requires Python 3.11+."""
import hashlib
import json
from pathlib import Path
import shutil
import sys

if len(sys.argv) != 2:
    raise SystemExit('Usage: python3 scripts/sync.py /path/to/lig/dist/ports/<distribution>')
root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]).resolve()
assert root != source, 'Source must differ from destination'
manifest = json.loads((source / 'lig-build.json').read_text())
previous = json.loads((root / 'lig-build.json').read_text())
assert manifest['port'] == previous['port'], 'Wrong port'
assert manifest['sourceRepository'] == 'https://github.com/0froq/lig'
assert manifest['distributionRepository'] == previous['distributionRepository'], 'Wrong repository'

def target(directory, name):
    path = (directory / name).resolve()
    assert path.is_relative_to(directory), f'Artifact outside distribution: {name}'
    return path

for name, checksum in manifest['files'].items():
    assert hashlib.sha256(target(source, name).read_bytes()).hexdigest() == checksum, name
    target(root, name)
obsolete = [target(root, name) for name in previous['files'] if name not in manifest['files']]
for path in obsolete:
    path.unlink(missing_ok=True)
for name in [*manifest['files'], 'lig-build.json']:
    destination = target(root, name)
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(target(source, name), destination)
print(f"Imported {manifest['port']} {manifest['packageVersion']} from {manifest['sourceRef']}")
