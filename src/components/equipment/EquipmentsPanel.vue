<script setup lang="ts">
import { useEquipmentStore } from "@/stores/equipment-system";
import EquipmentCard from "@/components/equipment/EquipmentCard.vue";

const equipmentStore = useEquipmentStore();
</script>

<template>
  <div id="equipment-list" class="base-frame" style="width: 400px; overflow-y: auto; max-height: 1000px;">
    <div style="width: 100%;" @mouseleave="equipmentStore.unHighlightEquipment()">
      <EquipmentCard v-for="detailData in equipmentStore.equipmentList" :equipment-detail="detailData" :key="detailData.id" />
    </div>
  </div>
</template>

<style scoped>

</style>