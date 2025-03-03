// import 'nprogress/nprogress.css'
import NProgress from 'nprogress'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from) => {
  if (to.path !== from.path) {
    NProgress.start()
  }
})

router.afterEach(() => {
  NProgress.done()
})

export default router
