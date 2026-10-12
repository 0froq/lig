"""Release/store preflight. Publishes no extension and never reads stored credentials."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import tomllib
import xml.etree.ElementTree as ET
import zipfile


def require(condition, message):
    if not condition:
        raise ValueError(message)


def command(*args, cwd=None):
    return subprocess.check_output(args, cwd=cwd, text=True).strip()


def output(**values):
    if path := os.environ.get('GITHUB_OUTPUT'):
        with open(path, 'a') as file:
            for key, value in values.items():
                file.write(f'{key}={value}\n')
    print(json.dumps(values))


def validate_tag(root, tag):
    manifest = json.loads((root / 'lig-build.json').read_text())
    version = manifest['packageVersion']
    require(re.fullmatch(r'\d+\.\d+\.\d+', version), 'Only stable numeric release versions are supported')
    require(tag == f'v{version}', f'Tag {tag!r} must equal v{version}')
    if manifest['port'] == 'vscode':
        package = json.loads((root / 'package.json').read_text())
        require((package['publisher'], package['name'], package['version']) == ('froQ', 'theme-lig', version), 'Wrong Marketplace identity/version')
    else:
        require(manifest['port'] == 'zed', 'Unsupported distribution')
        extension = tomllib.loads((root / 'extension.toml').read_text())
        require(extension['id'] == 'lig-theme', 'Zed store releases require the lig-theme identity')
        require(extension['version'] == version, 'Zed manifest version differs from release')
    return manifest


def validate_vsix(root, path, digest=None):
    if digest:
        require(digest == 'sha256:' + hashlib.sha256(path.read_bytes()).hexdigest(), 'Release VSIX digest mismatch')
    package = json.loads((root / 'package.json').read_text())
    with zipfile.ZipFile(path) as archive:
        require(len(archive.namelist()) == len(set(archive.namelist())), 'Duplicate VSIX entries')
        actual = json.loads(archive.read('extension/package.json'))
        require(actual == package, 'VSIX package metadata mismatch')
        identity = ET.fromstring(archive.read('extension.vsixmanifest')).find('.//{http://schemas.microsoft.com/developer/vsx-schema/2011}Identity')
        require(identity is not None, 'VSIX XML identity missing')
        require((identity.get('Publisher'), identity.get('Id'), identity.get('Version')) == (package['publisher'], package['name'], package['version']), 'VSIX XML identity mismatch')
        if icon := package.get('icon'):
            name = icon.removeprefix('./')
            require(archive.read('extension/' + name) == (root / name).read_bytes(), f'VSIX icon mismatch: {name}')
        for entry in package['contributes']['themes']:
            name = entry['path'].removeprefix('./')
            require(archive.read('extension/' + name) == (root / name).read_bytes(), f'VSIX theme mismatch: {name}')
        for name in ['README.md', 'LICENSE.md']:
            # vsce deliberately normalizes README.md to readme.md in VSIX archives.
            member = 'readme.md' if name == 'README.md' else name
            require(archive.read('extension/' + member) == (root / name).read_bytes(), f'VSIX payload mismatch: {name}')


def registry_status(index, submodule, version, commit):
    entry = index.get('lig-theme')
    if entry is None:
        return 'unregistered'
    require(entry['submodule'] == 'extensions/lig-theme', 'Unexpected registry submodule path')
    require(submodule.get('submodule_git_url') in ['https://github.com/0froq/zed-theme-LiG', 'https://github.com/0froq/zed-theme-LiG.git'], 'Registry entry belongs to another repository')
    registered = entry['version']
    require(re.fullmatch(r'\d+\.\d+\.\d+', registered), 'Unexpected registry version')
    current = tuple(map(int, registered.split('.')))
    target = tuple(map(int, version.split('.')))
    require(current <= target, f'Refusing registry downgrade from {registered} to {version}')
    if current == target:
        require(submodule['sha'] == commit, 'Registry version matches but release commit differs; bump the version')
        return 'current'
    return 'update'


def prepare(root, tag, directory, dry_run):
    manifest = validate_tag(root, tag)
    subprocess.run(['python3', str(root / 'scripts/verify.py')], cwd=root, check=True)
    repository = manifest['distributionRepository'].removeprefix('https://github.com/')
    release = json.loads(command('gh', 'release', 'view', tag, '--repo', repository, '--json', 'tagName,isDraft,isPrerelease,assets'))
    require(release['tagName'] == tag and not release['isPrerelease'], 'Not a stable release')
    require(dry_run or not release['isDraft'], 'Cannot publish a draft release')
    commit = command('git', 'rev-parse', 'HEAD', cwd=root)
    require(commit == command('git', 'rev-parse', f'{tag}^{{}}', cwd=root), 'Checkout is not the requested release tag')
    subprocess.run(['git', 'merge-base', '--is-ancestor', commit, 'origin/main'], cwd=root, check=True)
    version = manifest['packageVersion']
    directory.mkdir(parents=True, exist_ok=True)
    values = dict(version=version, tag=tag, commit=commit)
    if manifest['port'] == 'vscode':
        filename = f'theme-lig-{version}.vsix'
        path = directory / filename
        asset = next((asset for asset in release['assets'] if asset['name'] == filename), None)
        if asset:
            command('gh', 'release', 'download', tag, '--repo', repository, '--pattern', filename, '--dir', str(directory))
        else:
            subprocess.run(['npx', '--yes', '@vscode/vsce@3.6.2', 'package', '--no-dependencies', '--out', str(path)], cwd=root, check=True)
        validate_vsix(root, path, asset.get('digest') if asset else None)
        if not asset and not dry_run:
            command('gh', 'release', 'upload', tag, str(path), '--repo', repository)
        values['filename'] = filename
    else:
        (directory / 'registry-entry.toml').write_text(f'[lig-theme]\nsubmodule = "extensions/lig-theme"\nversion = "{version}"\n')
        (directory / 'release.json').write_text(json.dumps(dict(repository=repository, **values), indent=2) + '\n')
    output(**values)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='action', required=True)
    prepare_parser = sub.add_parser('prepare')
    prepare_parser.add_argument('--root', type=Path, required=True)
    prepare_parser.add_argument('--tag', required=True)
    prepare_parser.add_argument('--output', type=Path, required=True)
    prepare_parser.add_argument('--dry-run', action='store_true')
    registry_parser = sub.add_parser('registry')
    registry_parser.add_argument('--index', type=Path, required=True)
    registry_parser.add_argument('--submodule', type=Path, required=True)
    registry_parser.add_argument('--version', required=True)
    registry_parser.add_argument('--commit', required=True)
    args = parser.parse_args()
    if args.action == 'prepare':
        prepare(args.root.resolve(), args.tag, args.output.resolve(), args.dry_run)
    else:
        output(status=registry_status(tomllib.loads(args.index.read_text()), json.loads(args.submodule.read_text()), args.version, args.commit))


if __name__ == '__main__':
    main()
