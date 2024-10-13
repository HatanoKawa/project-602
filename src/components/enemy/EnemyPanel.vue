<script setup lang="ts">
import { useEnemyStore } from "@/stores/enemy";
import EnemySlotCard from "@/components/enemy/EnemySlotCard.vue";
import { computed } from "vue";
import { useLogStore } from "@/stores/log";

const enemyStore = useEnemyStore();
const logStore = useLogStore();

const enemyMultiplierStr = computed(() => {
  return `${(enemyStore.currentEnemyStateMultipliers * 100).toFixed(2)} %`;
});
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
      <div class="message-block">
        <div class="message-title">游戏状态</div>
        <div class="label-value-container">
          <span>敌人属性倍率：</span>
          <span>{{ enemyMultiplierStr }}</span>
        </div>
        <div class="label-value-container">
          <span>当前难度等级：</span>
          <span>{{ enemyStore.currentEnemyRank }}</span>
        </div>
      </div>
      <div class="message-block">
        <div class="message-title">伤害统计</div>
        <div class="label-value-container">
          <span>武器伤害：</span>
          <span>{{ logStore.damageAnalysis.weapon.toFixed(2) }}</span>
        </div>
        <div class="label-value-container">
          <span>点燃伤害：</span>
          <span>{{ logStore.damageAnalysis.elemental_Ignite.toFixed(2) }}</span>
        </div>
        <div class="label-value-container">
          <span>冰冻伤害：</span>
          <span>{{ logStore.damageAnalysis.elemental_Freeze.toFixed(2) }}</span>
        </div>
        <div class="label-value-container">
          <span>流血伤害：</span>
          <span>{{ logStore.damageAnalysis.elemental_Bleeding.toFixed(2) }}</span>
        </div>
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

.message-title {
  font-size: 20px;
  margin-bottom: 12px;
}

.message-block {
  margin: 12px;
  padding-bottom: 6px;
  border-bottom: solid 1px grey;
}
</style>