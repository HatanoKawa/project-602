<script setup lang="ts">
import { useEquipmentStore } from "@/stores/equipment";
import CharacterSlot from "@/components/character/CharacterSlot.vue";
import { useGameCoreStore } from "@/stores/game-core";

const gameCoreStore = useGameCoreStore();
const equipmentStore = useEquipmentStore();

const startDragChar = (e: DragEvent, rowIndex: number, colIndex: number) => {
  equipmentStore.currentOperatingCharIndex = [rowIndex, colIndex];
  console.warn(`startDragChar: [${rowIndex}, ${colIndex}], ${e?.dataTransfer?.getData('text')}`);
};

const dropChar = (e: DragEvent, rowIndex: number, colIndex: number) => {
  e.preventDefault();
  equipmentStore.exchangeChar(equipmentStore.currentOperatingCharIndex[0], equipmentStore.currentOperatingCharIndex[1], rowIndex, colIndex);
};
</script>

<template>
  <div id="char-list">
    <div>
      <span>当前等级：</span>
      <span>{{ gameCoreStore.level }}</span>
      <button v-show="gameCoreStore.debugMode" @click="equipmentStore.addRandomNewChar()">Add</button>
    </div>
    <div>
      <span>升级进度: </span>
      <span>{{ `${gameCoreStore.xpGauge} / ${gameCoreStore.xpGaugeMax}` }}</span>
    </div>
    <div id="char-gain-gauge-container">
      <div
        id="char-gain-gauge-value"
        :style="{ width: `${ gameCoreStore.xpGauge / gameCoreStore.xpGaugeMax * 100 }%` }"
      />
    </div>
    Equipment temporary storage area
    <div id="char-temporary-storage-area">
      <div
        class="char-cell"
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
    <div id="char-container">
      <template v-for="(row, rowIndex) in equipmentStore.charSlotList" :key="rowIndex">
        <div
          v-for="(charSlotData, colIndex) in row"
          :key="colIndex"
          class="char-cell"
          :draggable="charSlotData.char ? 'true' : 'false'"
          @dragover.prevent
          @dragstart="(e: DragEvent) => startDragChar(e, rowIndex, colIndex)"
          @drop="(e: DragEvent) => dropChar(e, rowIndex, colIndex)"
        >
          <!--{{ charSlotData.char || '-' }}-->
          <CharacterSlot :slot-data="charSlotData" />
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
#char-list {
  height: 640px;
  padding: 4px;
  border: solid 1px darkgray;
}

#char-container {
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

#char-temporary-storage-area {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  width: 491px;
  height: 50px;
  background-color: grey;
  gap: 1px;
  padding: 1px;
  user-select: none;
}

.char-cell {
  width: 48px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
}

#char-gain-gauge-container {
  border: solid 1px grey;
  height: 16px;
}

#char-gain-gauge-value {
  background-color: green;
  height: 100%;
  transition: width .2s;
}
</style>