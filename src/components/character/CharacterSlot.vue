<script setup lang="ts">
import { useEquipmentStore, type CharSlotData } from "@/stores/equipment";
import { computed } from "vue";

const props = defineProps<{
  slotData: CharSlotData
}>();

const equipmentStore = useEquipmentStore();

const isHighlight = computed(() => {
  if (!props.slotData.char) return false;
  return props.slotData.belongTo.some(id => equipmentStore.currentHighlightEquipmentId === id);
});

const backgroundColorDepth = computed(() => {
  return Math.min(props.slotData.belongTo.length, 5);
});

const backgroundColor = computed(() => {
  if (isHighlight.value) {
    return '#7695b2';
  }
  return `rgba(0, 0, 0, ${backgroundColorDepth.value * 0.1})`;
});
</script>

<template>
  <div class="char-slot" :style="{ backgroundColor: backgroundColor }">
    {{ slotData.char || '-' }}
  </div>
</template>

<style scoped>
.char-slot {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>