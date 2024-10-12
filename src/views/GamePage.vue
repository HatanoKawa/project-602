<script setup lang="ts">
import CharactersPanel from "@/components/character/CharactersPanel.vue";
import EquipmentsPanel from "@/components/equipment/EquipmentsPanel.vue";
import CharacterRecyclePanel from "@/components/character/CharacterRecyclePanel.vue";
import EnemyPanel from "@/components/enemy/EnemyPanel.vue";
import LogsPanel from "@/components/log/LogsPanel.vue";
</script>

<template>
  <div style="display: flex; height: 1000px;">
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
</template>

<style scoped>
.base-frame {
  border: solid 1px grey;
}
</style>