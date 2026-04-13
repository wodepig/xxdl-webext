<template>
  <div class="p-4 w-[470px] min-h-[400px] bg-base-200">
    <!-- 头部区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="btn btn-ghost btn-sm btn-circle" :title="t('backToHome')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-lg font-bold">{{ t('settingsTitle') }}</h1>
      </div>
      <HeaderActions />
    </div>

    <!-- 后端地址配置 -->
    <div class="card bg-base-100 shadow-sm mb-4">
      <div class="card-body">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="card-title text-base">{{ t('backendConfigTitle') }}</h2>
            <p class="text-sm text-base-content/70">{{ t('backendConfigDesc') }}</p>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t('backendUrlLabel') }}</span>
          </label>
          <div class="flex items-center gap-2">
            <input type="url" v-model="backendUrl" :placeholder="t('backendUrlPlaceholder')"
              class="input input-bordered flex-1" />
            <!-- URL 后缀展示 -->
            <code class="text-xs bg-base-200 px-2 py-2 rounded text-primary whitespace-nowrap">{{ apiPath || '/api/extTest' }}</code>
          </div>
          <!-- <label class="label">
            <span class="label-text-alt text-base-content/50">{{ t('backendUrlHint') }}</span>
          </label> -->
        </div>

        <!-- API 路径配置（可折叠） -->
        <div class="mt-2">
          <button type="button" @click="showApiPathInput = !showApiPathInput" class="btn btn-ghost btn-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 transition-transform"
              :class="{ 'rotate-90': showApiPathInput }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            {{ showApiPathInput ? t('hideApiPathConfig') : t('showApiPathConfig') }}
          </button>

          <div v-if="showApiPathInput" class="mt-2 flex items-center gap-2">
            <span class="text-base-content/50">/</span>
            <input type="text" v-model="apiPathInput" placeholder="api/extTest"
              class="input input-bordered input-sm flex-1" />
            <button @click="saveApiPath" class="btn btn-primary btn-sm">{{ t('saveApiPath') }}</button>
            <button @click="resetApiPath" class="btn btn-ghost btn-sm">{{ t('resetToDefault') }}</button>
          </div>
        </div>

        <!-- 测试连接按钮和状态 -->
        <div class="flex items-center gap-2 mt-2">
          <button @click="testConnection" :disabled="testing" class="btn btn-outline btn-sm">
            <svg v-if="!testing" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span v-if="testing" class="loading loading-spinner loading-xs"></span>
            {{ testing ? t('testing') : t('testConnection') }}
          </button>
          <span v-if="connectionStatus" class="badge"
            :class="{ 'badge-success': connectionStatusType === 'success', 'badge-error': connectionStatusType === 'error' }">
            {{ connectionStatus }}
          </span>
        </div>
      </div>
    </div>

    <!-- 请求密钥配置 -->
    <div class="card bg-base-100 shadow-sm mb-4">
      <div class="card-body">
        <div class="flex items-start gap-3 mb-4">
          <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div class="flex-1">
            <h2 class="card-title text-base">{{ t('apiKeyConfigTitle') }}</h2>
            <p class="text-sm text-base-content/70">{{ t('apiKeyConfigDesc') }}</p>
          </div>
        </div>

        <div class="form-control">
          <label class="label">
            <span class="label-text">{{ t('apiKeyLabel') }}</span>
          </label>
          <div class="relative">
            <input :type="showKey ? 'text' : 'password'" v-model="apiKey" :placeholder="t('apiKeyPlaceholder')"
              class="input input-bordered w-full pr-10" />
            <button type="button" @click="toggleKeyVisibility"
              class="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle"
              :title="t('toggleKeyVisibility')">
              <svg v-if="!showKey" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </div>
          <label class="label">
            <span class="label-text-alt text-base-content/50">{{ t('apiKeyHint') }}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <button @click="saveSettings" class="btn btn-primary w-full">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
      </svg>
      {{ t('saveSettings') }}
    </button>

    <!-- Toast 提示 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
/**
 * 设置页面组件
 * 用于配置后端服务器地址、API 密钥和 API 路径
 * 保存前会自动测试连接，确保配置有效
 */
import "~/style.css"
import { ref, onMounted } from "vue"
import { Storage } from "@plasmohq/storage"
import { t } from "~/utils/i18n"
import Toast from "~/components/Toast.vue"
import HeaderActions from "~/components/HeaderActions.vue"
import { httpClient } from "~/utils/http-client"

// ==================== Storage 实例 ====================
/** Plasmo Storage 实例，用于跨上下文持久化存储 */
const storage = new Storage()

// ==================== 响应式数据 ====================
/** 后端服务器地址 */
const backendUrl = ref('')
/** API 认证密钥 */
const apiKey = ref('')
/** 当前配置的 API 路径（带 / 前缀） */
const apiPath = ref('')
/** API 路径输入框的值（不带 / 前缀） */
const apiPathInput = ref('')
/** 是否显示 API 路径配置面板 */
const showApiPathInput = ref(false)
/** 是否显示 API 密钥（明文/密文切换） */
const showKey = ref(false)
/** 是否正在测试连接中 */
const testing = ref(false)
/** 连接状态提示文本 */
const connectionStatus = ref('')
/** 连接状态类型：success | error */
const connectionStatusType = ref('')
/** Toast 组件引用 */
const toastRef = ref<InstanceType<typeof Toast>>()

// ==================== 常量 ====================
/** 默认 API 路径 */
const DEFAULT_API_PATH = '/api/extTest'

// ==================== 生命周期 ====================
onMounted(() => {
  loadSettings()
})

// ==================== 方法 ====================
/**
 * 从 Storage 加载保存的设置
 * 页面加载时自动调用
 */
async function loadSettings() {
  backendUrl.value = await storage.get('backendUrl') || ''
  apiKey.value = await storage.get('apiKey') || ''
  apiPath.value = await storage.get('apiPath') || ''
  // 去掉开头的 /，方便用户输入
  apiPathInput.value = apiPath.value.replace(/^\//, '')
}

/**
 * 切换 API 密钥显示/隐藏状态
 */
function toggleKeyVisibility() {
  showKey.value = !showKey.value
}

/**
 * 保存 API 路径配置
 * 自动添加 / 前缀，并关闭配置面板
 */
function saveApiPath() {
  let path = apiPathInput.value.trim()
  // 确保路径以 / 开头
  if (path && !path.startsWith('/')) {
    path = '/' + path
  }
  apiPath.value = path
  showApiPathInput.value = false
}

/**
 * 重置 API 路径为默认值
 */
function resetApiPath() {
  apiPathInput.value = DEFAULT_API_PATH.replace(/^\//, '')
  apiPath.value = DEFAULT_API_PATH
  showApiPathInput.value = false
}

/**
 * 获取完整的测试 URL
 * @param baseUrl - 后端基础地址
 * @returns 完整的测试接口地址
 */
function getTestUrl(baseUrl: string): string {
  const path = apiPath.value || DEFAULT_API_PATH
  // 处理 baseUrl 末尾是否有 /
  return baseUrl.endsWith('/') ? `${baseUrl}${path.replace(/^\//, '')}` : `${baseUrl}${path}`
}

/**
 * 测试后端连接
 * 验证后端地址和 API Key 是否有效
 * 结果会显示在连接状态 badge 中
 */
async function testConnection() {
  const url = backendUrl.value.trim()
  const key = apiKey.value.trim()

  // 基础验证
  if (!url) {
    connectionStatus.value = t('enterBackendUrl')
    connectionStatusType.value = 'error'
    return
  }

  if (!key) {
    connectionStatus.value = t('enterApiKey')
    connectionStatusType.value = 'error'
    return
  }

  // URL 格式验证
  try {
    new URL(url)
  } catch {
    connectionStatus.value = t('invalidUrl')
    connectionStatusType.value = 'error'
    return
  }

  testing.value = true
  connectionStatus.value = ''

  try {
    // 向后端发送测试连接请求（通过 Background 代理，绕过 CORS）
    const testUrl = url.endsWith('/') ? `${url}api/extTest` : `${url}/api/extTest`
    const result = await httpClient.post<{ code: number; msg: string; data: string | null }>(testUrl, {
      apiKey: key,
      deviceId: 'abc'
    })

    // 校验响应数据
    if (result.data.code === 200) {
      connectionStatus.value = result.data.msg || t('connectionSuccess')
      connectionStatusType.value = 'success'
    } else {
      connectionStatus.value = result.data.msg || t('connectionFailed')
      connectionStatusType.value = 'error'
    }
  } catch (error) {
    connectionStatus.value = t('connectionFailed')
    connectionStatusType.value = 'error'
  } finally {
    testing.value = false
  }
}

/**
 * 保存设置
 * 保存前会自动测试连接，只有连接成功才会保存
 * 使用 Toast 显示操作结果
 */
async function saveSettings() {
  const url = backendUrl.value.trim()
  const key = apiKey.value.trim()

  // 基础验证
  if (!url) {
    toastRef.value?.show({ message: t('enterBackendUrl'), type: 'warning' })
    return
  }

  if (!key) {
    toastRef.value?.show({ message: t('enterApiKey'), type: 'warning' })
    return
  }

  // URL 格式验证
  try {
    new URL(url)
  } catch {
    toastRef.value?.show({ message: t('invalidUrl'), type: 'error' })
    return
  }

  // 先测试连接，确保配置有效（通过 Background 代理，绕过 CORS）
  testing.value = true
  try {
    const testUrl = getTestUrl(url)
    const result = await httpClient.post<{ code: number; msg: string; data: string | null }>(testUrl, {
      apiKey: key,
      deviceId: 'abc'
    })

    if (result.data.code !== 200) {
      toastRef.value?.show({ message: result.data.msg || t('connectionFailed'), type: 'error' })
      return
    }
  } catch (error) {
    toastRef.value?.show({ message: t('connectionFailed'), type: 'error' })
    return
  } finally {
    testing.value = false
  }

  // 连接成功后保存设置到 Storage
  await storage.set('backendUrl', url)
  await storage.set('apiKey', key)
  await storage.set('apiPath', apiPath.value)

  toastRef.value?.show({ message: t('settingsSaved'), type: 'success' })
}

/**
 * 返回上一页
 */
function goBack() {
  window.history.back()
}
</script>
