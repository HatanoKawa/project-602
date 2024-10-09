<script setup lang="ts">
import { useEquipmentSystem } from "@/stores/equipment-system";

const equipmentStore = useEquipmentSystem()

const startDragChar = (e: DragEvent, rowIndex: number, colIndex: number) => {
  equipmentStore.currentOperatingCharIndex = [rowIndex, colIndex]
  console.warn(`startDragChar: [${rowIndex}, ${colIndex}], ${e?.dataTransfer?.getData('text')}`)
}

const dropChar = (e: DragEvent, rowIndex: number, colIndex: number) => {
  e.preventDefault()
  equipmentStore.exchangeChar(equipmentStore.currentOperatingCharIndex[0], equipmentStore.currentOperatingCharIndex[1], rowIndex, colIndex)
}
</script>

<template>
  <div id="equipment-list" style="flex: 1; height: 100%;">
    Equipment gain gauge
    {{ `${equipmentStore.charGainPoint} / ${equipmentStore.currentCharGainGaugeMax}` }}
    <button @click="equipmentStore.getNewChar()">Add</button>
    <div id="equipment-gain-gauge-container">
      <div
        id="equipment-gain-gauge-value"
        :style="{ width: `${equipmentStore.charGainPoint / equipmentStore.currentCharGainGaugeMax * 100}%` }"
      />
    </div>
    Equipment temporary storage area
    <div id="equipment-temporary-storage-area">
      <div
        class="equipment-cell"
        v-for="(item, index) in equipmentStore.charTempStorage"
        :key="index"
        :draggable="item ? 'true' : 'false'"
        :style="{ cursor: item ? 'move' : 'not-allowed' }"
        @dragstart="(e: DragEvent) => startDragChar(e, -1, index)"
      >
        {{ item || '-' }}
      </div>
    </div>
    Equipment area
    <div id="equipment-container">
      <template v-for="(row, rowIndex) in equipmentStore.charList" :key="rowIndex">
        <div
          v-for="(charSlotData, colIndex) in row"
          :key="colIndex"
          class="equipment-cell"
          draggable="true"
          @dragover.prevent
          @dragstart="(e: DragEvent) => startDragChar(e, rowIndex, colIndex)"
          @drop="(e: DragEvent) => dropChar(e, rowIndex, colIndex)"
        >
          {{ charSlotData.char || '-' }}
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
#equipment-list {
  padding: 4px;
  border: solid 1px darkgray;
}

#equipment-container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  width: 491px;
  height: 491px;
  background-color: grey;
  gap: 1px;
  padding: 1px;
  user-select: none;
}

#equipment-temporary-storage-area {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 491px;
  height: 50px;
  background-color: grey;
  gap: 1px;
  padding: 1px;
  user-select: none;
}

.equipment-cell {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

#equipment-gain-gauge-container {
  border: solid 1px grey;
  height: 16px;
}

#equipment-gain-gauge-value {
  background-color: green;
  height: 100%;
  transition: width .2s;
}
</style>