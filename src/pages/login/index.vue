<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance } from 'element-plus'

interface LoginForm {
  username: string
  password: string
}

const form = reactive<LoginForm>({
  username: '',
  password: '',
})

const rules = reactive({
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Please input password', trigger: 'blur' },
  ],
})

const loginForm = ref<FormInstance>()

const handleLogin = async () => {
  await loginForm.value?.validate()
  // 处理登录逻辑
}

const handleHover = (event: MouseEvent) => {
  const btn = event.target as HTMLElement
  btn.style.transform = `translateX(${Math.random() * 10 - 5}px) translateY(${Math.random() * 10 - 5}px)`
}
</script>

<template>
  <div class="login-container">
    <!-- 粒子背景 -->
    <div class="particles-background" />

    <!-- 登录卡片 -->
    <el-card class="login-card">
      <div class="glow-effect" />

      <h2 class="title">
        SYSTEM LOGIN
      </h2>
      <div class="sub-title">
        Welcome to Future Platform
      </div>

      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="form.username"
            placeholder="Username"
            prefix-icon="el-icon-user"
            class="cyber-input"
          >
            <template #prefix>
              <i class="icon-hover el-icon-user" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
            show-password
            class="cyber-input"
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          native-type="submit"
          @mouseenter="handleHover"
        >
          ACCESS SYSTEM
          <i class="el-icon-arrow-right arrow-icon" />
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  background: linear-gradient(45deg, #0a0a2e, #1a1a4a); // 保持暗色背景
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.particles-background {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,...') repeat; /* 粒子背景SVG代码 */
  animation: particleFlow 20s linear infinite;
}

.login-card {
  width: 420px;
  background: rgba(16, 18, 37, 0.9); // 保持暗色卡片背景
  border: 1px solid rgba(72, 255, 240, 0.2); // 保持边框颜色
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(0deg, transparent, #48fff0, #48fff0);
    animation: animate 6s linear infinite;
  }
}

.glow-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(72, 255, 240, 0.4), transparent);
  animation: glowSlide 3s infinite;
}

.title {
  color: #48fff0; // 保持标题颜色
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(72, 255, 240, 0.5);
}

.sub-title {
  color: #7a7a8c; // 保持副标题颜色
  text-align: center;
  margin: 10px 0 30px;
}

.cyber-input {
  :deep(.el-input__inner) {
    background: rgba(16, 18, 37, 0.3); // 输入框背景色调整为暗色
    border: 1px solid rgba(72, 255, 240, 0.1); // 输入框边框颜色调整为暗色
    color: #48fff0; // 保持文字颜色不变
    transition: all 0.3s ease;

    &:hover {
      border-color: rgba(72, 255, 240, 0.3); // 悬停时的边框颜色调整为暗色
      box-shadow: 0 0 10px rgba(72, 255, 240, 0.1); // 悬停时的阴影调整为暗色
    }

    &:focus {
      background: rgba(72, 255, 240, 0.1); // 聚焦时的背景色调整为暗色
    }
  }
}

.login-btn {
  width: 100%;
  background: linear-gradient(45deg, #48fff0, #2573d9); // 保持按钮背景色
  border: none;
  border-radius: 5px;
  color: #fff; // 保持按钮文字颜色
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(72, 255, 240, 0.4); // 保持悬停时的阴影
  }
}

.arrow-icon {
  transition: transform 0.3s ease;
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes glowSlide {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

@keyframes particleFlow {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 100% 100%;
  }
}
</style>
