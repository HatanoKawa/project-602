<script setup lang="ts">
import { useEnemyStore } from "@/stores/enemy";
import EnemySlotCard from "@/components/enemy/EnemySlotCard.vue";

const enemyStore = useEnemyStore();
</script>

<template>
  <div id="enemy-panel" class="base-frame">
    <div id="enemy-zone">
      <template v-for="(row, rowIndex) in enemyStore.mapSlotList" :key="rowIndex">
        <template v-for="(enemySlotData, colIndex) in row" :key="colIndex">
          <EnemySlotCard
            :slot-data="enemySlotData"
            :row-index="rowIndex"
            :col-index="colIndex"
          />
        </template>
      </template>
    </div>
    <div id="enemy-panel-status">
      <div class="label-value-container">
        <span>当前敌人属性倍率：</span>
        <span>100</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
#enemy-panel {
  display: flex;
  width: 1200px;
  height: 800px;
}

#enemy-zone {
  width: 1000px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 10px;
  padding: 10px;
  background-color: grey;
}

#enemy-panel-status {
  width: 200px;
  height: 100%;
}
</style>