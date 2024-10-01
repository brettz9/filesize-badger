import ashNazg from 'eslint-config-ash-nazg';

export default [
  {
    ignores: [
      'dist',
      'coverage',
      'test/results/**'
    ]
  },
  ...ashNazg(['sauron', 'node']),
  {
    files: ['*.md/*.js'],
    languageOptions: {
      globals: {
        rollupPluginFilesizeBadgerOptions: 'readonly',
        rollupPluginFilesizeBadger: 'readonly'
      }
    },
    rules: {
      'no-shadow': 0,
      'no-template-curly-in-string': 0,
      'import/unambiguous': 0,
      'import/no-anonymous-default-export': 0,
      // 'import/no-unresolved': ['error', {
      //   ignore: ['filesize-badger/dist/index.esm.js']
      // }],
      'n/no-missing-import': ['error', {
        allowModules: ['filesize-badger', 'rollup-plugin-filesize']
      }],
      'n/no-unpublished-import': ['error', {
        allowModules: ['rollup-plugin-filesize']
      }]
    }
  },
  {
    files: [
      'bin/**'
    ],
    rules: {
      'no-process-exit': 0,
      'node/exports-style': 0
    }
  },
  {
    files: ['test/fixtures/sample.js'],
    rules: {
      '@eslint-community/eslint-comments/require-description': 0
    }
  },
  {
    rules: {
      // Disable until may get `badge-up`, `es6-template-strings`, and
      //  `command-line-basics` deps. as modules
      'import/no-commonjs': 0
    }
  }
];
