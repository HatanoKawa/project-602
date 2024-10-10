<script setup lang="ts">
import { useEquipmentStore, type CharSlotData } from "@/stores/equipment-system";
import { computed } from "vue";

const props = defineProps<{
  slotData: CharSlotData
}>();

const equipmentStore = useEquipmentStore();

const isHighlight = computed(() => {
  if (!props.slotData.char) return false;
  return props.slotData.belongTo.some(id => equipmentStore.currentHighlightEquipmentId === id);
});
</script>

<template>
  <div class="char-slot" :class="{ highlight: isHighlight }">
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

.highlight {
  background-color: #ddd;
}
</style>