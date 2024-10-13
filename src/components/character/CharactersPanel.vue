<script setup lang="ts">
import { useEquipmentStore } from "@/stores/equipment";
import CharacterSlot from "@/components/character/CharacterSlot.vue";
import { useGameCoreStore } from "@/stores/game-core";
import { computed } from "vue";

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

const xpGauge = computed(() => gameCoreStore.xpGauge);
const xpGaugeMax = computed(() => gameCoreStore.xpGaugeMax);
const xpGaugeRate = computed(() => xpGauge.value / xpGaugeMax.value * 100);
</script>

<template>
  <div id="char-list">
    <div>
      <span>当前等级：</span>
      <span>{{ gameCoreStore.level }}</span>
    </div>
    <div>
      <span>升级进度: </span>
      <span>{{ `${gameCoreStore.xpGauge} / ${gameCoreStore.xpGaugeMax}` }}</span>
    </div>
    <div id="xp-gauge-container">
      <div
        id="xp-gauge-bar"
        :style="{ width: `${ Math.min(xpGaugeRate, 100) }%` }"
      />
    </div>
    <div>
      汉字临时存储区
      <span v-show="equipmentStore.newCharToAddCount > 0">(+{{ equipmentStore.newCharToAddCount }})</span>
    </div>
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
    汉字表
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
  height: 740px;
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

#xp-gauge-container {
  border: solid 1px grey;
  height: 16px;
}

#xp-gauge-bar {
  background-color: green;
  height: 100%;
  transition: width .2s;
}
</style>