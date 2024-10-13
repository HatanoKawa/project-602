<script setup lang="ts">
import CharactersPanel from "@/components/character/CharactersPanel.vue";
import EquipmentsPanel from "@/components/equipment/EquipmentsPanel.vue";
import CharacterRecyclePanel from "@/components/character/CharacterRecyclePanel.vue";
import EnemyPanel from "@/components/enemy/EnemyPanel.vue";
import LogsPanel from "@/components/log/LogsPanel.vue";
import { useGameCoreStore } from "@/stores/game-core";

const gameCoreStore = useGameCoreStore();
</script>

<template>


  <div style="display: flex; justify-content: center;">
    <button @click="gameCoreStore.startGame()">开始游戏</button>
    <button @click="gameCoreStore.pauseGame()">暂停游戏</button>
  </div>
  <div style="display: flex; justify-content: center;">
    <div style="display: flex; height: 1000px; width: 2100px;">
      <div style="height: 100%;">
        <EnemyPanel />
        <div style="display: flex; height: 200px;">
          <div id="avatar" class="base-frame" style="width: 200px;">
            QUINN RIVER
          </div>
          <LogsPanel />
        </div>
      </div>
      <div style="display: flex; flex-direction: column;">
        <CharactersPanel />
        <CharacterRecyclePanel />
      </div>
      <EquipmentsPanel />
    </div>
  </div>
</template>

<style scoped>
.base-frame {
  border: solid 1px grey;
}
</style>