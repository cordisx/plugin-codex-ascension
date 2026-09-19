import { build } from 'esbuild';

await build({
  bundle: true,
  entryPoints: ['src/codex-ascension.ts'],
  external: ['@deepseek-ai/cordis', 'cordisx/contracts'],
  format: 'esm',
  metafile: true,
  outfile: 'dist/runtime/module.js',
  platform: 'browser',
  sourcemap: false,
  target: ['chrome120'],
});
