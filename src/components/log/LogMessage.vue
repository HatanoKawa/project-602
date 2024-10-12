<script setup lang="ts">
import { type LogData, LogType } from "@/types/log-types";

const props = defineProps<{
  logData: LogData
}>();
</script>

<template>
  <div v-if="logData.logType === LogType.equipmentAttack">
    <span class="equipment-name">{{ logData.equipmentName }}</span>
    <span>对</span>
    <span class="enemy-name" v-for="(enemyName, enemyIndex) in logData.target" :key="enemyIndex">{{ enemyName }}</span>
    <span>造成了</span>
    <span class="damage-value">{{ logData.damage.toFixed(2) }}</span>
    <span>伤害</span>
  </div>
  <div v-else-if="logData.logType === LogType.elementalEffect">
    <span :style="{ color: logData.elementalEffectColor }">{{ logData.elementalEffectName }}</span>
    <span>效果对</span>
    <span class="enemy-name" v-for="(enemyName, enemyIndex) in logData.target" :key="enemyIndex">{{ enemyName }}</span>
    <span>造成了总计</span>
    <span class="damage-value">{{ logData.damage.toFixed(2) }}</span>
    <span>伤害</span>
  </div>
  <div v-else-if="logData.logType === LogType.enemyDie">
    <span class="enemy-name">{{ logData.enemyName }}</span>
    <span>被击败了</span>
  </div>
  <div v-else-if="logData.logType === LogType.gameStateChange">
    <span>{{ logData.text }}</span>
  </div>
  <div v-else>
    {{ logData }}
  </div>
</template>

<style scoped>
.equipment-name {
  color: darkgreen;
}

.damage-value {
  color: red;
}

.enemy-name {
  color: indianred;
}

span {
  margin-right: 4px;
}
</style>