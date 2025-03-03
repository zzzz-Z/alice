import antfu from '@antfu/eslint-config'

export default antfu({
  // unocss: true,
  plugins: [],
  lessOpinionated: true,
  rules: {
    'style/semi': ['error', 'never'],
    'perfectionist/sort-imports': 'off',
    'vue/comma-dangle': 0,
    'style/comma-dangle': 0
  },
  formatters: {
    /**
     * Format CSS, LESS, SCSS files, also the `<style>` blocks in Vue
     * By default uses Prettier
     */
    css: true,
    /**
     * Format HTML files
     * By default uses Prettier
     */
    html: true
  }
})
