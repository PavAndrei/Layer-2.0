import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const publicApiImportRestrictions = [
  {
    group: [
      './api/*',
      './helpers/*',
      './model/*',
      './ui/*',
      '../api/*',
      '../helpers/*',
      '../model/*',
      '../ui/*',
    ],
    message:
      'Use the folder public api instead, for example "./ui" or "../model".',
  },
  {
    regex: '^(\\.\\.?/)+features/[^/]+/(?![^/]+-page$).+',
    message:
      'Import feature internals through the feature public api or import page files only.',
  },
  {
    regex: '^(\\.\\.?/)+entities/[^/]+/(?!index$).+',
    message: 'Import entity internals through the entity public api.',
  },
]

const appImportRestriction = {
  regex: '^(\\.\\.?/)+app(/.*)?$',
  message: 'Features and shared code must not import from the app layer.',
}

const featuresImportRestriction = {
  regex: '^(\\.\\.?/)+features(/.*)?$',
  message: 'Lower layers must not import from the features layer.',
}

const featureSiblingImportRestriction = {
  regex: '^\\.\\./\\.\\./[^./][^/]*(/.*)?$',
  message:
    'Feature model/ui/api code must not import other features. Compose features in page files instead.',
}

const entitiesImportRestriction = {
  regex: '^(\\.\\.?/)+entities(/.*)?$',
  message: 'Shared code must not import from the entities layer.',
}

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-restricted-imports': [
        'error',
        {
          patterns: publicApiImportRestrictions,
        },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [...publicApiImportRestrictions, appImportRestriction],
        },
      ],
    },
  },
  {
    files: [
      'src/features/*/api/**/*.{ts,tsx}',
      'src/features/*/model/**/*.{ts,tsx}',
      'src/features/*/ui/**/*.{ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...publicApiImportRestrictions,
            appImportRestriction,
            featureSiblingImportRestriction,
          ],
        },
      ],
    },
  },
  {
    files: ['src/entities/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...publicApiImportRestrictions,
            appImportRestriction,
            featuresImportRestriction,
          ],
        },
      ],
    },
  },
  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            ...publicApiImportRestrictions,
            appImportRestriction,
            featuresImportRestriction,
            entitiesImportRestriction,
          ],
        },
      ],
    },
  },
)
