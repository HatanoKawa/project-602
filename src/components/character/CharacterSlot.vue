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

const isBelongToEquipment = computed(() => {
  return props.slotData.belongTo.length > 0;
});
</script>

<template>
  <div class="char-slot" :class="{ 'belong-to-equipment': isBelongToEquipment, highlight: isHighlight }">
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

.belong-to-equipment {
  background-color: #ddd;
}

.highlight {
  background-color: #7695b2;
}
</style>