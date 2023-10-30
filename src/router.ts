import { createRouter, createWebHistory } from 'vue-router'
import MainEta from '@/components/MainEta.vue'
import MainMultiTimer from '@/components/MainMultiTimer.vue'

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
    { path: '/:pathMatch(.*)', component: MainEta }
  ]
})
