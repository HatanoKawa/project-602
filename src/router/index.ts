import { createRouter, createWebHistory } from 'vue-router';
import IntroductionPage from "@/views/introduction/IntroductionPage.vue";
import GamePage from "@/views/GamePage.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Introduction',
      component: IntroductionPage,
    },
    {
      path: '/game',
      name: 'GamePage',
      component: GamePage,
    }
  ]
});

export default router;
