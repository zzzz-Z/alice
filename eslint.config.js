import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  typescript: true,
  vue: true,
  lessOpinionated: true,
  plugins: [],
  rules: {
    'no-console': ['warn'],
    'style/semi': ['error', 'never'],
    'vue/no-v-text-v-html-on-component': 'off',
    'perfectionist/sort-imports': 'off',
    'vue/comma-dangle': 0,
    'style/comma-dangle': 0,
    'style/jsx-quotes': 'off',
    'import/order': 'off',
    'antfu/if-newline': 'off',
    'style/brace-style': 'off',
    'vue/define-macros-order': 'off',
    'vue/block-order': 'off',
    'vue/component-name-in-template-casing': 'off',
    'vue/require-default-prop': 'off',
  },
  formatters: {
    css: true,
    html: true
  }
})
