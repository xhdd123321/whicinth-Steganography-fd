import { createRouter, createWebHistory, Router, RouteRecordRaw } from 'vue-router'
import steg from '@/router/modules/steg'
import other from '@/router/modules/other'

const routes: RouteRecordRaw[] = [{ path: '/', redirect: 'steg' }, steg, other]

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

// router.beforeEach((to, from, next) => {
//   next()
// })

// router.afterEach((to, from) => {})

export default router
