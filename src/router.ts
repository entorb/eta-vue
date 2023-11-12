import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
// import MainEta from '@/components/MainEta.vue'
// import MainMultiTimer from '@/components/MainMultiTimer.vue'
// import MainInfo from '@/components/MainInfo.vue'
// Lazy loading of tabs to speed up initial loading
const MainEta = defineAsyncComponent(() => import('@/components/MainEta.vue'))
const MainMultiTimer = defineAsyncComponent(() => import('@/components/MainMultiTimer.vue'))
const MainInfo = defineAsyncComponent(() => import('@/components/MainInfo.vue'))

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/eta/',
      component: MainEta
    },
    {
      path: '/eta/eta',
      component: MainEta
    },
    {
      path: '/eta/multitimer',
      component: MainMultiTimer
    },
    {
      path: '/eta/info',
      component: MainInfo
    },
    { path: '/:pathMatch(.*)', component: MainEta }
  ]
})
