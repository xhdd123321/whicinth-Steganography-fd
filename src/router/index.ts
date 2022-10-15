import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/index.vue'), // 注意这里要带上 文件后缀.vue
  },
]

const router: Router = createRouter({
  history: createWebHistory(), // createWebHashHistory()
  routes: routes,
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop
          resolve({ left: 0, top })
        }
      }
    })
  },
})

router.beforeEach((to, from, next) => {})

router.afterEach((to, from) => {})

export default router
