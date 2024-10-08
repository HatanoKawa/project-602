<script setup lang="ts">
import EquipmentsPanel from "@/components/EquipmentsPanel.vue";
</script>

<template>
  <div style="display: flex;">
    <div style="height: 1000px;">
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
      <EquipmentsPanel />
      <div id="recycle-panel" class="base-frame" style="flex: 1;">
        recycle
      </div>
    </div>
    <div id="equipment-list" class="base-frame" style="width: 400px;">
      equipment-list
    </div>
  </div>
</template>

<style scoped>
.base-frame {
  border: solid 1px grey;
}
</style>