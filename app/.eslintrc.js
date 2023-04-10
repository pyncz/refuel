module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  extends: [
    '../.eslintrc.js',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    '@antfu',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    'curly': [
      'error',
      'all',
    ],
    '@typescript-eslint/brace-style': 'off',
    'brace-style': [
      'error',
      '1tbs',
    ],
    'import/no-anonymous-default-export': 'off',
    'react/jsx-max-props-per-line': ['error', {
      maximum: { single: 3, multi: 1 },
    }],
    '@next/next/no-html-link-for-pages': ['error', 'app/src/pages/'],
    'react/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
    'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    'react/jsx-indent': [
      'error',
      2,
      { indentLogicalExpressions: true },
    ],
    'react/jsx-indent-props': ['error', 2],
    'react/sort-comp': ['error', {
      order: [
        'static-methods',
        'lifecycle',
        'everything-else',
        'render',
      ],
    }],
  },
}
