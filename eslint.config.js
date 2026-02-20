import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'

export default [
  {
    ignores: ['dist/**'],
  },
  {
    plugins: {
      react,
      'react-hooks': hooks,
    },
    rules: {
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly'
      }
    },
    files: ['**/*.js', '**/*.jsx'],
  }
]
