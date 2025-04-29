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
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})

const loginForm = ref<FormInstance>()

async function handleLogin() {
  await loginForm.value?.validate()
  // 处理登录逻辑
}
</script>

<template>
  <div class="login-container">
    <!-- 粒子背景 -->
    <div class="particles-background" />

    <!-- 登录卡片 -->
    <el-card class="login-card">
      <h2 class="title">
        登录
      </h2>

      <el-form
        ref="loginForm"
        :model="form"
        :rules="rules"
        label-width="auto"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username" label="用户名">
          <el-input
            v-model="form.username"
            placeholder="Username"
            prefix-icon="el-icon-user"
          >
            <template #prefix>
              <i class="icon-hover el-icon-user" />
            </template>
          </el-input>
        </el-form-item>

        <el-form-item prop="password" label="密码">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Password"
            prefix-icon="el-icon-lock"
            show-password
          />
        </el-form-item>

        <el-button
          type="primary"
          class="login-btn"
          native-type="submit"
        >
          登录
          <i class="el-icon-arrow-right arrow-icon" />
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  height: 100vh;
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
  animation: particleFlow 20s linear infinite;
}

.login-card {
  width: 420px;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.title {
  text-align: center;
  font-family: 'Orbitron', sans-serif;
  letter-spacing: 2px;
}

.sub-title {
  color: #7a7a8c; // 保持副标题颜色
  text-align: center;
  margin: 10px 0 30px;
}

.login-btn {
  width: 100%;
  // background: linear-gradient(45deg, #48fff0, #2573d9); // 保持按钮背景色
  border: none;
  border-radius: 5px;
  color: #fff; // 保持按钮文字颜色
  font-weight: bold;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
</style>
