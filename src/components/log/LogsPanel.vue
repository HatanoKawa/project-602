<script setup lang="ts">
import { useLogStore } from "@/stores/log";
import LogMessage from "@/components/log/LogMessage.vue";
import { ref, watchEffect } from "vue";
import type { LogData } from "@/types/log-types";

const logStore = useLogStore();

const logList = ref();
const scrollToBottom = () => {
  // scroll to bottom smoothly
  logList.value.scrollTo({
    top: logList.value.scrollHeight,
    behavior: "smooth"
  });
};

// onMounted(() => {
//   logStore.setScrollToBottomFn(scrollToBottom);
// });

const currentShowLogList = ref<LogData[]>([]);
const updateShowLogList = () => {
  currentShowLogList.value.push(...logStore.logListToAdd.splice(0, logStore.logListToAdd.length));
  setTimeout(() => {
    scrollToBottom();
  }, 0);
};

watchEffect((onCleanup) => {
  let intervalId = setInterval(() => {
    updateShowLogList();
  }, 1000);
  onCleanup(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <div id="status-panel" class="base-frame" style="flex: 1; overflow: auto;" ref="logList">
    <LogMessage v-for="(logData, logIndex) in currentShowLogList" :key="logIndex" :logData="logData" />
  </div>
</template>

<style scoped>
</style>