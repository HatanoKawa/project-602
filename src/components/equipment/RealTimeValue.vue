<script setup lang="ts">
const props = defineProps<{
  realTimeValue: number;
  baseValue: number;
  reverse?: boolean;
}>();
</script>

<template>
  <span class="real-time-value-container" v-if="props.realTimeValue !== props.baseValue">
    <span
      :class="{
        'red': reverse ? realTimeValue > baseValue : realTimeValue < baseValue,
        'green': reverse ? realTimeValue < baseValue : realTimeValue > baseValue
      }"
    >
      {{ props.realTimeValue.toFixed(2) }}
    </span>
    <span>(</span>
    <span>{{ props.baseValue.toFixed(2) }}</span>
    <span>)</span>
  </span>
  <span v-else>{{ props.realTimeValue.toFixed(2) }}</span>
</template>

<style scoped>
.green {
  color: green;
}

.red {
  color: red;
}

.real-time-value-container {
  display: flex;
  align-items: center;
}
</style>