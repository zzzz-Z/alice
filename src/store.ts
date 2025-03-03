import type { RouteRecordRaw } from 'vue-router'
import { getAuth, getUser } from '@/api/user'
import router from '@/router'
import Progress from 'nprogress'

type R = RouteRecordRaw & {
  type: number
  _id: string
}

export const useStore = createGlobalState(() => {
  const modules = import.meta.glob('@/views/**/*.vue')

  const storage = useStorage('__by', { token: '' })

  const [dynamicRoutes, getDynamicRoutes] = useAsyncData(getAuth, {
    immediate: false,
    storage: 'dynamicRoutes',
  })

  const [userInfo, getUserInfo] = useAsyncData(getUser, {
    immediate: false,
    storage: 'userInfo',
  })

  const permissions = computed(() =>
    flatMapTree(dynamicRoutes.value)
      ?.filter(v => v.type === 3)
      .map(v => v.perms),
  )

  function addDynamicRoutes() {
    const routes = toRaw(dynamicRoutes.value)
    if (!routes?.length) {
      return
    }
    toRaw(createDynamicRoutes(routes))
      .forEach((r: RouteRecordRaw) => {
        router.addRoute(r)
      })
  }

  function createDynamicRoutes(dynamicRoutes: R[], level = 0): any {
    level++
    return dynamicRoutes
      .filter(route => route.type !== 3)
      .map(({ type, name, path, children, component, ...route }) => {
        const comp = modules[`@/views/${component}`]
        const meta = { id: route._id, type, title: name }
        return {
          path,
          meta,
          component: comp,
          children: children?.length
            ? createDynamicRoutes(children as R[], level)
            : level === 1 ? [{ path: '', component: comp, meta }] : [],
        }
      })
  }

  function flatMapTree(data: Params[]): Params[] {
    return data.flatMap?.(({ children, ...item }: Params) => {
      if (children && children.length > 0) {
        return [item, ...flatMapTree(children)]
      }
      else {
        return item
      }
    })
  }

  return {
    storage,
    userInfo,
    dynamicRoutes,
    Progress,
    permissions,
    getDynamicRoutes,
    getUserInfo,
    addDynamicRoutes,
  }
})
