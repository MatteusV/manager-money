import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'next',
      '@rocketseat/eslint-config/react',
    ],
    ignorePatterns: ['src/components/ui', 'src/hooks/user-toast.ts'],
  }),
]

export default eslintConfig
