import eslintNextPlugin from '@next/eslint-plugin-next';
import wizardryConfig from 'eslint-config-wizardry';
import boundaries from 'eslint-plugin-boundaries';

const config = [
  ...wizardryConfig,
  {
    ignores: ['next-env.d.ts'],
  },
  {
    ignores: ['out/', 'dist/'],
    plugins: {
      '@next/next': eslintNextPlugin,
    },
    rules: {
      ...eslintNextPlugin.configs.recommended.rules,
      '@typescript-eslint/dot-notation': 'off',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Side effects
            ['^\\u0000', '^styles.+\\.s?css$'],
            // External packages
            ['^react', '^next', '^@?\\w', '^clsx'],
            // Store folder
            ['^redux/'],
            // FSD Layers
            ['^app', '^pages', '^widgets', '^features', '^entities', '^shared'],
            // Project root folder imports
            ['^@/', '^public'],
            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+module\\.s?css$'],
          ],
        },
      ],
    },
  },
  {
    plugins: {
      boundaries,
    },
    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/*' },
        { type: 'views', pattern: 'src/views/*' },
        { type: 'widgets', pattern: 'src/widgets/*' },
        { type: 'features', pattern: 'src/features/*' },
        { type: 'entities', pattern: 'src/entities/*' },
        { type: 'shared', pattern: 'src/shared/*' },
      ],
    },
    rules: {
      'boundaries/element-types': [
        'warn',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['views', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'views', allow: ['widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['features', 'entities', 'shared'] },
            { from: 'features', allow: ['entities', 'shared'] },
            { from: 'entities', allow: ['shared'] },
            { from: 'shared', allow: ['shared'] },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*Slice.ts'],
    rules: {
      'no-param-reassign': ['error', { props: true, ignorePropertyModificationsFor: ['state'] }],
    },
  },
  {
    files: ['**/*Api.ts'],
    rules: {
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/layout.tsx', '**/template.tsx', '**/providers/**/*.tsx'],
    rules: {
      'react/jsx-fragments': 'off',
    },
  },
];

export default config;
