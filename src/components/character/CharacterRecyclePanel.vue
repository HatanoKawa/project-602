<script setup lang="ts">
import { useEquipmentStore } from "@/stores/equipment";

const equipmentStore = useEquipmentStore();
const startDragChar = (e: DragEvent, rowIndex: number, colIndex: number) => {
  equipmentStore.currentOperatingCharIndex = [rowIndex, colIndex];
};
</script>

<template>
  <div id="recycle-panel" class="base-frame" style="flex: 1;" @dragover.prevent>
    <div class="recycle-character-container" :class="{ 'can-recycle': equipmentStore.canRecycle }">
      <div
        class="char-cell"
        v-for="(item, index) in equipmentStore.recycleCharTempStorage"
        :key="index"
        :draggable="equipmentStore.canRecycle ? 'true' : 'false'"
        :style="{ cursor: equipmentStore.canRecycle ? 'move' : 'not-allowed' }"
        @dragstart="(e: DragEvent) => startDragChar(e, -2, index)"
      >
        {{ item || '-' }}
      </div>
    </div>
    <div class="recycle-zone-container">
      <div class="recycle-zone" @drop="equipmentStore.recycleChar(equipmentStore.currentOperatingCharIndex[0], equipmentStore.currentOperatingCharIndex[1])">
        <div class="recycle-zone-desc">将不需要的汉字拖动到这里来回收</div>
        <div style="font-size: 24px;">回收进度 {{ `${equipmentStore.recycleGauge}/${equipmentStore.RECYCLE_CHAR_MAX}` }}</div>
      </div>
    </div>
    <div class="button-container">
      <button
        :disabled="equipmentStore.canRefreshRecycleList ? null : 'true'"
        @click="equipmentStore.manuallyRefreshRecycleList()"
      >
        刷新待选汉字（-1回收进度）
      </button>
    </div>
  </div>
</template>

<style scoped>
.recycle-character-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 100px;
  opacity: 0.5;
}
.recycle-character-container.can-recycle {
  opacity: 1;
}

.recycle-zone-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
}

.recycle-zone {
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: solid 1px darkgray;
  background-color: #ddd;
  user-select: none;
}

.char-cell {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border: solid 1px grey;
}

.button-container {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.recycle-zone-desc {
  color: grey;
}
</style>