<script setup lang="ts">
import type { MapSlotData } from "@/stores/enemy";
import { computed, watchEffect } from "vue";

const props = defineProps<{
  slotData: MapSlotData;
  rowIndex: number;
  colIndex: number;
}>();

const isEmpty = computed(() => !props.slotData.enemy);
const currentEnemyHp = computed(() => props.slotData.enemy?.health);
const currentEnemyHpMax = computed(() => props.slotData.enemy?.healthMax);
const currentEnemyTableData = computed(() => props.slotData.enemy?.tableData);
</script>

<template>
  <div class="enemy-slot-card" :class="{ 'is-empty': isEmpty }">
    {{ props.slotData.enemy }}
  </div>
</template>

<style scoped>
.enemy-slot-card {
  width: 188px;
  height: 188px;
  background-color: white;
}

.enemy-slot-card.is-empty {
  background-color: #aaa;
}
</style>