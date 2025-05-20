import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver, } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import autoRouter from 'unplugin-vue-router/vite'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    autoRouter({
      // extensions: ['index.vue'],
      dts: 'types/typed-router.d.ts',
    }),
    vue(),
    vueJsx(),
    vueDevTools(),
    UnoCSS(),
    AutoImport({
      dts: 'types/auto-imports.d.ts',
      imports: ['vue', '@vueuse/core'],
      dirs: ['src/hooks/**', 'src/utils/**'],
      eslintrc: { enabled: true, filepath: 'types/.eslintrc-auto-import.json' },
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      extensions: ['vue', 'tsx'],
      dts: 'types/components.d.ts',
      resolvers: [ElementPlusResolver()],
      include: [/\.vue$/, /\.vue\?vue/, /\.vue\.[tj]sx?\?vue/],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      // additionalData: `@use "@/style/var.scss" as *;`,
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: true,
    proxy: {
      '/dev-api': {
        changeOrigin: true, // 使用代理服务器的原始主机名称
        target: 'http://10.61.128.46:10010',
        rewrite: path => path.replace(/^\/dev-api/, ''),
      },
    },
  },
})
