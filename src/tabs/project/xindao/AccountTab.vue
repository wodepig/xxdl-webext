<template>
  <div class="bg-base-100 border border-base-300 p-4 rounded-box">
    <div class="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
      <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span class="text-xl">👤</span>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-semibold mb-1">添加账号</h3>
        <p class="text-xs text-base-content/60">获取账号数据并提取用户名</p>
      </div>
    </div>

    <!-- 获取数据按钮 -->
    <button @click="getAccountData" :disabled="gettingAccount" class="btn btn-primary btn-sm w-full mb-4">
      <svg v-if="!gettingAccount" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span v-if="gettingAccount" class="loading loading-spinner loading-xs"></span>
      {{ gettingAccount ? '获取中...' : '获取账号数据' }}
    </button>

    <!-- 用户名展示区域 -->
    <div v-if="modelValue" class="mb-4">
      <div class="alert alert-success">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="font-bold text-sm">提取成功</h3>
          <div class="text-xs">用户名: <span class="font-mono font-bold text-primary">{{ modelValue.userName }}</span>
          </div>
          <div class="text-xs flex items-center gap-1">Token:
            <span class="font-mono font-bold text-primary" :title="modelValue.qsData.userToken">{{
              truncateToken(modelValue.qsData.userToken) }}</span>
            <button @click="copyToken(modelValue.qsData.userToken)"
              class="btn btn-ghost btn-xs btn-circle text-primary" title="复制 Token">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据预览区域（可折叠） -->
    <div v-if="modelValue" class="collapse collapse-arrow bg-base-200">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium">
        账号数据预览
      </div>
      <div class="collapse-content">
        <pre class="bg-base-300 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(modelValue, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Storage } from "@plasmohq/storage"
import { getLocalStorage, getSessionStorage, getCurrentTab } from "~/utils/common"
import { useXindaoToast } from "./toast"

/**
 * 添加账号 Tab
 * 从 localStorage.qs 与 sessionStorage.classData 提取账号数据，数据由父组件通过 v-model 持有
 */
defineProps<{
  /** 账号数据 */
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const toast = useXindaoToast()
const storage = new Storage()

/** 是否正在获取账号数据 */
const gettingAccount = ref(false)

/**
 * 截取 Token 显示：前 8 位 + ... + 后 4 位
 * @param token - 原始 Token
 */
function truncateToken(token: string): string {
  if (!token) return ''
  if (token.length <= 16) return token
  return `${token.slice(0, 8)}...${token.slice(-4)}`
}

/**
 * 复制 Token 到剪贴板
 * @param token - 待复制的 Token
 */
async function copyToken(token: string) {
  try {
    await navigator.clipboard.writeText(token)
    toast.show({ message: 'Token 已复制', type: 'success' })
  } catch (error) {
    toast.show({ message: '复制失败: ' + (error as Error).message, type: 'error' })
  }
}

/**
 * 获取账号数据
 */
async function getAccountData() {
  try {
    gettingAccount.value = true
    await getAccountBody()
    toast.show({ message: '账号数据获取成功', type: 'success' })
  } catch (error) {
    toast.show({ message: (error as Error).message, type: 'error' })
  } finally {
    gettingAccount.value = false
  }
}

/**
 * 组装添加账号的请求体
 */
async function getAccountBody() {
  const qsStr = await getLocalStorage('qs')
  if (!qsStr) {
    throw new Error("qs数据不存在, 尝试设置中清空内容重登");
  }

  const qsData = JSON.parse(qsStr)
  console.log('qsData', qsData);

  const classDataStr = await getSessionStorage('classData')
  if (!classDataStr) {
    throw new Error("classData数据不存在");
  }
  const tab = await getCurrentTab()
  if (!tab.url) {
    throw new Error("标签页 URL 为空");
  }
  const url = new URL(tab.url)

  const data = {
    accessKey: await storage.get('apiKey') || '',
    userName: qsData.userName,
    courseName: qsData.courseName,
    qsData: qsData,
    classData: JSON.parse(classDataStr),
    baseUrl: url.origin + '/'
  }
  console.log('请求数据:', data)

  emit('update:modelValue', data)
}

// 暴露给父组件，供页面挂载时自动获取
defineExpose({ fetchAccountData: getAccountData })
</script>
