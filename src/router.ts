// import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHistory } from "vue-router"

// import MainEta from '@/components/MainEta.vue'
// Lazy loading of tabs to speed up initial loading
// here no defineAsyncComponent needed!
const MainEta = () => import("@/components/MainEta.vue")

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/eta/",
      component: MainEta,
    },
    {
      path: "/eta/eta",
      component: MainEta,
    },
    { path: "/:pathMatch(.*)", component: MainEta },
  ],
})
