<script setup lang="ts">
import type { MapSlotData } from "@/stores/enemy";
import { computed, watchEffect } from "vue";

const props = defineProps<{
  slotData: MapSlotData;
  rowIndex: number;
  colIndex: number;
}>();

const HP_GAUGE_COLOR = {
  full: 'green',
  almostFull: 'yellowgreen',
  half: 'yellow',
  danger: 'red',
};

const getHpGaugeColor = (rate: number) => {
  if (rate >= 0.9) return HP_GAUGE_COLOR.full;
  if (rate >= 0.75) return HP_GAUGE_COLOR.almostFull;
  if (rate >= 0.3) return HP_GAUGE_COLOR.half;
  return HP_GAUGE_COLOR.danger;
};

const isEmpty = computed(() => !props.slotData.enemy);
const currentEnemyData = computed(() => props.slotData.enemy);

const currentEnemyName = computed(() => currentEnemyData.value?.tableData.name);

const currentEnemyHp = computed(() => currentEnemyData.value?.health || 0);
const currentEnemyHpMax = computed(() => currentEnemyData.value?.healthMax || 1);
const currentEnemyHpRate = computed(() => currentEnemyHp.value / currentEnemyHpMax.value * 100);

const currentEnemyGauge_Fire = computed(() => currentEnemyData.value?.elementalGauge_Fire || 0);
const currentEnemyGaugeMax_Fire = computed(() => currentEnemyData.value?.tableData.elementalGaugeMax_Fire || 1);
const currentEnemyGaugeRate_Fire = computed(() => currentEnemyGauge_Fire.value / currentEnemyGaugeMax_Fire.value * 100);

const currentEnemyGauge_Ice = computed(() => currentEnemyData.value?.elementalGauge_Ice || 0);
const currentEnemyGaugeMax_Ice = computed(() => currentEnemyData.value?.tableData.elementalGaugeMax_Ice || 1);
const currentEnemyGaugeRate_Ice = computed(() => currentEnemyGauge_Ice.value / currentEnemyGaugeMax_Ice.value * 100);

const currentEnemyGauge_Bleeding = computed(() => currentEnemyData.value?.elementalGauge_Bleeding || 0);
const currentEnemyGaugeMax_Bleeding = computed(() => currentEnemyData.value?.tableData.elementalGaugeMax_Bleeding || 1);
const currentEnemyGaugeRate_Bleeding = computed(() => currentEnemyGauge_Bleeding.value / currentEnemyGaugeMax_Bleeding.value * 100);

const currentEnemyTableData = computed(() => props.slotData.enemy?.tableData);
const currentHpGaugeColor = computed(() => getHpGaugeColor(currentEnemyHpRate.value));
</script>

<template>
  <div class="enemy-slot-card" :class="{ 'is-empty': isEmpty }">
    <div class="enemy-name">{{ currentEnemyName }}</div>
    <div v-show="!isEmpty">
      <div class="gauge-container">
        <div
          class="gauge-bar"
          :style="{
          width: `${currentEnemyHpRate}%`,
            backgroundColor: currentHpGaugeColor,
          }"
        />
        <div class="gauge-text">HP： {{ currentEnemyHp.toFixed(2) }}/{{ currentEnemyHpMax.toFixed(2) }}</div>
      </div>
      <div class="gauge-container">
        <div
          class="gauge-bar"
          :style="{
          width: `${currentEnemyGaugeRate_Fire}%`,
            backgroundColor: currentHpGaugeColor,
          }"
        />
        <div class="gauge-text">灼烧： {{ currentEnemyGauge_Fire }}/{{ currentEnemyGaugeMax_Fire }}</div>
      </div>
      <div class="gauge-container">
        <div
          class="gauge-bar"
          :style="{
          width: `${currentEnemyGaugeRate_Ice}%`,
            backgroundColor: currentHpGaugeColor,
          }"
        />
        <div class="gauge-text">冰冻： {{ currentEnemyGauge_Ice }}/{{ currentEnemyGaugeMax_Ice }}</div>
      </div>
      <div class="gauge-container">
        <div
          class="gauge-bar"
          :style="{
          width: `${currentEnemyGaugeRate_Bleeding}%`,
            backgroundColor: currentHpGaugeColor,
          }"
        />
        <div class="gauge-text">流血： {{ currentEnemyGauge_Bleeding }}/{{ currentEnemyGaugeMax_Bleeding }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enemy-slot-card {
  width: 188px;
  height: 188px;
  background-color: white;
  padding: 12px;
}

.enemy-slot-card.is-empty {
  background-color: #aaa;
}

.enemy-name {
  font-size: 24px;
  text-align: center;
}

.gauge-container {
  width: 100%;
  height: 24px;
  background-color: #ddd;
  border-radius: 4px;
  margin-top: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  user-select: none;
}

.gauge-bar {
  height: 100%;
  border-radius: 4px;
  position: absolute;
  top: 0;
  left: 0;
  transition: width 0.5s;
  opacity: 0.5;
}

.gauge-text {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>