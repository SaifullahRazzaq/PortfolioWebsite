import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

// eslint-config-next 16 ships native flat config, so no FlatCompat shim.
const eslintConfig = [
  { ignores: ['legacy/**', '.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // react-three-fiber's whole performance model is mutating three.js objects
    // and refs inside useFrame, 60 times a second, without ever re-rendering.
    // The React Compiler's immutability rules are correct for render code and
    // exactly wrong here, so they are off for the 3D layer only — DOM
    // components keep the full ruleset.
    files: ['components/canvas/**/*.tsx', 'components/canvas/**/*.ts'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
    },
  },
];

export default eslintConfig;
