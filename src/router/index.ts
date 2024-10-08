import { createRouter, createWebHistory } from 'vue-router'
import Introduction from "@/views/Introduction.vue";
import GamePage from "@/views/GamePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Introduction',
      component: Introduction,
    },
    {
      path: '/game',
      name: 'GamePage',
      component: GamePage,
    }
  ]
})

export default router
