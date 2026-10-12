"""Release identity, artifact tampering and registry ordering contracts; no UI tests."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import warnings
import zipfile

spec = importlib.util.spec_from_file_location('release', Path(__file__).parents[1] / 'release.py')
release = importlib.util.module_from_spec(spec)
spec.loader.exec_module(release)


class ReleaseTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.manifest = dict(port='vscode', packageVersion='0.2.1')
        self.package = dict(publisher='froQ', name='theme-lig', version='0.2.1', engines=dict(vscode='^1.107.0'), contributes=dict(themes=[dict(path=f'./themes/lig-{name}.json') for name in ['light', 'dark', 'light-paper', 'dark-paper']]))
        (self.root / 'themes').mkdir()
        for entry in self.package['contributes']['themes']:
            (self.root / entry['path']).write_text('{}')
        (self.root / 'README.md').write_text('LiG\n')
        (self.root / 'LICENSE.md').write_text('MIT\n')
        self.save()

    def save(self):
        (self.root / 'lig-build.json').write_text(json.dumps(self.manifest))
        (self.root / 'package.json').write_text(json.dumps(self.package))

    def vsix(self, replace=None, duplicate=False):
        path = self.root / 'test.vsix'
        payload = {'package.json': json.dumps(self.package), 'readme.md': 'LiG\n', 'LICENSE.md': 'MIT\n'}
        payload.update({entry['path'][2:]: '{}' for entry in self.package['contributes']['themes']})
        payload.update(replace or {})
        with zipfile.ZipFile(path, 'w') as archive:
            archive.writestr('extension.vsixmanifest', '<PackageManifest xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011"><Metadata><Identity Publisher="froQ" Id="theme-lig" Version="0.2.1" /></Metadata></PackageManifest>')
            for name, value in payload.items():
                archive.writestr('extension/' + name, value)
            if duplicate:
                with warnings.catch_warnings():
                    warnings.simplefilter('ignore', UserWarning)
                    archive.writestr('extension/package.json', json.dumps(self.package))
        return path

    def test_stable_tag_matches_package(self):
        self.assertEqual(release.validate_tag(self.root, 'v0.2.1'), self.manifest)

    def test_tag_version_and_identity_must_match(self):
        for tag in ['main', 'v0.2.0', 'v0.2.1-beta.1', '0.2.1']:
            with self.subTest(tag=tag), self.assertRaises(ValueError):
                release.validate_tag(self.root, tag)
        self.package['publisher'] = 'another-publisher'
        self.save()
        with self.assertRaises(ValueError):
            release.validate_tag(self.root, 'v0.2.1')

    def test_prerelease_package_refused(self):
        self.manifest['packageVersion'] = '0.2.1-beta.1'
        self.save()
        with self.assertRaises(ValueError):
            release.validate_tag(self.root, 'v0.2.1-beta.1')

    def test_zed_theme_identity(self):
        self.manifest.update(port='zed', packageVersion='0.1.2')
        self.save()
        for identity in ['lig', 'lig-theme']:
            (self.root / 'extension.toml').write_text(f'id = "{identity}"\nversion = "0.1.2"\n')
            if identity == 'lig':
                with self.assertRaises(ValueError):
                    release.validate_tag(self.root, 'v0.1.2')
            else:
                self.assertEqual(release.validate_tag(self.root, 'v0.1.2'), self.manifest)

    def test_vsix_content_and_digest_match(self):
        path = self.vsix()
        release.validate_vsix(self.root, path, 'sha256:' + hashlib.sha256(path.read_bytes()).hexdigest())
        with self.assertRaises(ValueError):
            release.validate_vsix(self.root, path, 'sha256:wrong')

    def test_vsix_tampered_themes_metadata_readme_refused(self):
        other = dict(self.package, publisher='someone-else')
        for replace in [{'themes/lig-dark.json': '{"tampered":true}'}, {'package.json': json.dumps(other)}, {'readme.md': 'Changed'}]:
            with self.subTest(replace=replace), self.assertRaises(ValueError):
                release.validate_vsix(self.root, self.vsix(replace))

    def test_duplicate_zip_paths_refused(self):
        with self.assertRaises(ValueError):
            release.validate_vsix(self.root, self.vsix(duplicate=True))

    def test_declared_icon_must_be_present_and_identical(self):
        self.package['icon'] = 'icon.png'
        (self.root / 'icon.png').write_bytes(b'canonical-png')
        self.save()
        with self.assertRaises(KeyError):
            release.validate_vsix(self.root, self.vsix())
        with self.assertRaises(ValueError):
            release.validate_vsix(self.root, self.vsix({'icon.png': b'tampered-png'}))
        release.validate_vsix(self.root, self.vsix({'icon.png': b'canonical-png'}))

    def test_extra_executable_metadata_refused(self):
        other = dict(self.package, main='malicious.js')
        with self.assertRaises(ValueError):
            release.validate_vsix(self.root, self.vsix({'package.json': json.dumps(other)}))

    def test_xml_identity_must_match_package(self):
        path = self.vsix()
        with zipfile.ZipFile(path) as archive:
            files = {name: archive.read(name) for name in archive.namelist()}
        files['extension.vsixmanifest'] = files['extension.vsixmanifest'].replace(b'Id="theme-lig"', b'Id="wrong"')
        with zipfile.ZipFile(path, 'w') as archive:
            for name, data in files.items():
                archive.writestr(name, data)
        with self.assertRaises(ValueError):
            release.validate_vsix(self.root, path)

    def test_draft_and_prerelease_rejected_before_packaging(self):
        for draft, prerelease in [(True, False), (False, True)]:
            data = dict(tagName='v0.2.1', isDraft=draft, isPrerelease=prerelease, assets=[])
            self.manifest['distributionRepository'] = 'https://github.com/0froq/vscode-theme-LiG'
            self.save()
            with patch.object(release.subprocess, 'run'), patch.object(release, 'command', return_value=json.dumps(data)) as command:
                with self.assertRaises(ValueError):
                    release.prepare(self.root, 'v0.2.1', self.root / 'out', False)
                self.assertEqual(command.call_count, 1)

    def test_registry_first_current_and_upgrade(self):
        submodule = dict(submodule_git_url='https://github.com/0froq/zed-theme-LiG', sha='a' * 40)
        self.assertEqual(release.registry_status({}, {}, '0.1.2', 'a' * 40), 'unregistered')
        index = {'lig-theme': dict(submodule='extensions/lig-theme', version='0.1.2')}
        self.assertEqual(release.registry_status(index, submodule, '0.1.2', 'a' * 40), 'current')
        self.assertEqual(release.registry_status(index, submodule, '0.1.3', 'b' * 40), 'update')
        for version, commit in [('0.1.1', 'a' * 40), ('0.1.2', 'b' * 40)]:
            with self.subTest(version=version), self.assertRaises(ValueError):
                release.registry_status(index, submodule, version, commit)
        submodule['submodule_git_url'] = 'https://github.com/someone/another'
        with self.assertRaises(ValueError):
            release.registry_status(index, submodule, '0.1.3', 'b' * 40)


if __name__ == '__main__':
    unittest.main()
