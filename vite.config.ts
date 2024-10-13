import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueDevTools from 'vite-plugin-vue-devtools';
import Markdown from 'unplugin-vue-markdown/vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/project-602/',
  plugins: [
    vue({include: [/\.vue$/, /\.md$/],}),
    vueJsx(),
    vueDevTools(),
    Markdown({ /* options */ }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
