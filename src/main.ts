import { createApp } from 'vue'
import directives from '@/directive'
import App from './App.vue'
import router from './router'
import '@/styles/index.scss'
import '@unocss/reset/tailwind.css'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:uno.css'

const app = createApp(App)

app
  .use(router)
  .use(directives)
  .mount('#app')

export default app
