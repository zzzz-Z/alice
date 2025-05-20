<script setup lang="tsx">
import { Fold } from '@element-plus/icons-vue'
import { useToggle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import ThemeToggler from './components/theme-toggler.vue'

const router = useRouter()
const [collapse, toggle] = useToggle()
const options = computed(() => router.options.routes)
</script>

<template>
  <el-container class="page-container">
    <div :style="{ width: !collapse ? '255px' : '65px' }" class="aside">
      <div class="flex items-center h-50px px-10px">
        title
      </div>
      <el-menu router :collapse="collapse" class="router-menu">
        <el-menu-item v-for="(item, n) in options" :key="n" :index="item.path">
          {{ item?.children?.[0]?.meta?.title || item.path }}
        </el-menu-item>
      </el-menu>
    </div>
    <el-container>
      <el-header height="50px">
        <el-icon class="header-expand" @click="toggle()">
          <expand v-if="collapse" />
          <Fold v-else />
        </el-icon>
        <div class="header-right">
          <ThemeToggler />
        </div>
      </el-header>
      <el-main class="page-main">
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.page-container {
  width: 100vw;
  height: 100vh;
  padding: 0;
}

.el-header {
  align-items: center;
  justify-content: space-between;
  padding-left: 10px;
  display: flex;
}

.header-expand {
  height: 30px;
  font-size: 20px;
  width: 30px;
  cursor: pointer;
}

.page-main {
  background-color: var(--el-bg-color-page);
  padding: 10px;
  position: relative;
}

.router-menu:not(.el-menu--collapse) {
  width: 255px;
  height: 100%;
}

.aside {
  transition: width 0.2s ease;
  box-shadow: 0 4px 8px #0000004d;
  color: #fff;
  background-color: #2f3447;
}

.el-menu {
  border-right: none;
  background-color: #2f3447;
}

.el-menu-item {
  color: #fff;
}

.el-menu-item.is-active,
.el-menu-item:hover,
.el-menu__title.is-active,
.el-menu__title:hover,
.el-sub-menu__title.is-active,
.el-sub-menu__title:hover {
  background-color: #4165d7;
  color: #fff;
}
</style>
