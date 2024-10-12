<script setup lang="ts">
import { useLogStore } from "@/stores/log";
import LogMessage from "@/components/log/LogMessage.vue";
import { onMounted, ref } from "vue";

const logStore = useLogStore();

const logList = ref();
const scrollToBottom = () => {
  // scroll to bottom smoothly
  logList.value.scrollTo({
    top: logList.value.scrollHeight,
    behavior: "smooth"
  });
};

onMounted(() => {
  logStore.setScrollToBottomFn(scrollToBottom);
});
</script>

<template>
  <div id="status-panel" class="base-frame" style="flex: 1; overflow: auto;" ref="logList">
    <LogMessage v-for="(logData, logIndex) in logStore.logList" :key="logIndex" :logData="logData" />
  </div>
</template>

<style scoped>

</style>