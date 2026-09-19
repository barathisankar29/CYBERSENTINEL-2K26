import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      jsxA11y.flatConfigs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2023,
      globals: globals.browser,
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      // The two well-established hooks rules — not eslint-plugin-react-hooks'
      // v7 "recommended" set, which bundles a large batch of React Compiler
      // rules (immutability/purity/gating/etc.) that don't apply to this
      // project (no React Compiler) and would be excessive noise here.
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // TypeScript already enforces prop typing; the PropTypes rule is for
      // plain-JS React and is noise in a TS-only codebase.
      'react/prop-types': 'off',

      // Match tsconfig's noUnusedLocals/noUnusedParameters intent, but as a
      // lint warning with an escape hatch for intentionally-unused args
      // (e.g. destructured but unused error handlers).
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // vite.config.ts runs under Node, not the browser.
    files: ['vite.config.ts'],
    languageOptions: {
      globals: globals.node,
    },
  },
)
