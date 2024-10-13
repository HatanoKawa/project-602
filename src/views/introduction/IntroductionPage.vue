<script setup lang="ts">
import IntroductionMarkdown from './introduction.md'
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="markdown-container">
    <div class="markdown-content">
      <introduction-markdown />
    </div>
    <div style="display: flex; justify-content: center; margin: 48px 0;">
      <RouterLink to="/game">转到游戏demo页面→</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.markdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.markdown-content {
  width: 60%;
  min-width: 1000px;
}

:deep(code) {
  background-color: #f1f1f1;
  padding: .15em .5em;
  border-radius: 4px;
  color: #476582;
  transition: color .5s, background-color .5s;
}

:deep(code.language-text) {
  display: block;
  padding: 12px;
  border-radius: 4px;
}
</style>