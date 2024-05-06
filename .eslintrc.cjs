module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],

  plugins: ['node', 'import', '@typescript-eslint'],
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'newline-after-var': 'always',
    'newline-after-var': ['error', 'always'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        // 'newlines-between': 'always',
      },
    ],
  },
};
