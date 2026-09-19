import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const hostContracts = import.meta.resolve('cordisx/contracts');
const { runtimeManifestV1 } = await import(new URL('./launcher/plugin-package.js', hostContracts));
const { JsonPackageManifestV2Resolver } = await import(new URL('./launcher/packages/manifest.js', hostContracts));

const packageManifest = JSON.parse(await readFile('cordisx-package.json', 'utf8'));
const runtimeBytes = await readFile('runtime-manifest.json');
const runtimeManifest = JSON.parse(runtimeBytes);
const packageJson = JSON.parse(await readFile('package.json', 'utf8'));
const builtPlugin = await import(new URL('../dist/codex-ascension.js', import.meta.url));

assert.equal(packageManifest.id, runtimeManifest.id);
assert.equal(packageManifest.version, packageJson.version);
assert.equal(packageManifest.entry, packageJson.main);
assert.equal(packageManifest.runtimeManifest.schema, runtimeManifest.$schema);
assert.equal(
  packageManifest.runtimeManifest.digest,
  `sha256:${createHash('sha256').update(runtimeBytes).digest('hex')}`,
);
assert.deepEqual(runtimeManifest.capabilities, []);
assert.deepEqual(builtPlugin.manifest, runtimeManifest);

const runtimeSource = await readFile(packageManifest.entry, 'utf8');
assert.doesNotMatch(runtimeSource, /from\s+['"]@deepseek-ai\/schemastery['"]/u);
assert.match(runtimeSource, /from\s+['"]cordisx\/contracts['"]/u);

const resolver = new JsonPackageManifestV2Resolver({
  runtimeValidators: {
    [runtimeManifest.$schema]: value => runtimeManifestV1(value, runtimeManifest.id),
  },
});
const resolved = await resolver.resolve(process.cwd());
assert.equal(resolved.packageManifest.pluginId, packageManifest.id);
assert.equal(resolved.packageManifest.version, packageManifest.version);
assert.deepEqual(resolved.runtimeManifest, runtimeManifest);

const temporary = await mkdtemp(join(tmpdir(), 'codex-ascension-pack-'));
try {
  const packed = spawnSync('npm', ['pack', '--json', '--pack-destination', temporary], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  assert.equal(packed.status, 0, packed.stdout);
  const [metadata] = JSON.parse(packed.stdout);
  const files = new Set(metadata.files.map(file => file.path));
  for (
    const required of [
      'README.md',
      'README.zh-Hans.md',
      'cordisx-package.json',
      'runtime-manifest.json',
      packageManifest.entry.slice(2),
    ]
  ) assert.ok(files.has(required), `package is missing ${required}`);
} finally {
  await rm(temporary, { force: true, recursive: true });
}
