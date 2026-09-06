import { defineConfig, globalIgnores } from 'eslint/config';
import sourcePolicy from '@cordisx/eslint-config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Build outputs and the same verified generated artifacts excluded by dprint.
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/coverage/**',
    '**/.cache/**',
    '.next/**',
    '.vinext/**',
    'out/**',
    '.wrangler/**',
    'outputs/**',
    'work/**',
    'next-env.d.ts',
    'plugin/src/assets/identity/generated.ts',
    'plugin/src/assets/portraits/generated.ts',
  ]),
  { files: ['**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'], extends: [sourcePolicy] },
]);

export default eslintConfig;
