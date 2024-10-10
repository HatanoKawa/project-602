<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useGameCoreStore } from "@/stores/game-core";

const gameCoreStore = useGameCoreStore();
</script>

<template>

  <div style="width: 100%; display: flex; justify-content: center;">
    <RouterLink to="/">Introduction</RouterLink>
    <RouterLink to="/game">Game</RouterLink>

    <button @click="gameCoreStore.startGame()">Start Game</button>
    <button @click="gameCoreStore.pauseGame()">Pause Game</button>
  </div>

  <RouterView v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </RouterView>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
