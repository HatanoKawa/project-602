<script setup lang="ts">
import CharactersPanel from "@/components/character/CharactersPanel.vue";
import EquipmentsPanel from "@/components/equipment/EquipmentsPanel.vue";
import CharacterRecyclePanel from "@/components/character/CharacterRecyclePanel.vue";
</script>

<template>
  <div style="display: flex; height: 1000px;">
    <div style="height: 100%;">
      <div id="game-scene" class="base-frame" style="width: 1200px; height: 800px;">
        scene
      </div>
      <div style="display: flex; height: 200px;">
        <div id="avatar" class="base-frame" style="width: 200px;">
          QUINN RIVER
        </div>
        <div id="status-panel" class="base-frame" style="flex: 1;">
          status here
        </div>
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