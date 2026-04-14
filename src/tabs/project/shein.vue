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
        <div>
          <h1 class="text-lg font-bold">{{ projectConfig?.name || '希音Shein' }}</h1>
          <p class="text-xs text-base-content/60">{{ projectConfig?.matchUrl?.join(',') || 'shein.com' }}</p>
        </div>
      </div>
      <HeaderActions />
    </div>

    <!-- 功能内容区域 - Tab 标签页 -->
    <Tabs v-model="activeTab" :tabs="tabs" name="shein_tabs" custom-class="mb-4">
      <!-- 获取 Cookie Tab -->
      <template #cookie>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">🍪</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">获取 Cookie</h3>
              <p class="text-xs text-base-content/60">获取当前页面的 Cookie 数据</p>
            </div>
          </div>

          <!-- 获取 Cookie 按钮 -->
          <button @click="getCookieData" :disabled="gettingCookie" class="btn btn-secondary btn-sm w-full mb-4">
            <svg v-if="!gettingCookie" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span v-if="gettingCookie" class="loading loading-spinner loading-xs"></span>
            {{ gettingCookie ? '获取中...' : '获取 Cookie 数据' }}
          </button>

          <!-- Cookie 数据展示区域 -->
          <div v-if="cookieValue" class="mb-4">
            <div class="alert alert-success mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="flex-1">
                <h3 class="font-bold text-sm">获取成功</h3>
                <div class="text-xs">共 {{ cookieCount }} 个 Cookie</div>
              </div>
            </div>

            <!-- Cookie 内容预览 -->
            <div class="bg-base-200 p-3 rounded text-xs break-all mb-2 max-h-32 overflow-y-auto">
              {{ cookieValue }}
            </div>

            <!-- 复制按钮 -->
            <button @click="copyCookie" :disabled="copying" class="btn btn-primary btn-sm w-full">
              <svg v-if="!copying" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span v-if="copying" class="loading loading-spinner loading-xs"></span>
              {{ copied ? '已复制!' : '复制 Cookie' }}
            </button>
          </div>
        </div>
      </template>

      <!-- 使用方式 Tab -->
      <template #guide>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-info/5 border border-info/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">📖</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">使用方式</h3>
              <p class="text-xs text-base-content/60">操作步骤指南</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">1</span>
              <p class="text-sm text-base-content/80">登录 SHEIN 商家中心</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">2</span>
              <p class="text-sm text-base-content/80">进入需要操作的页面</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">3</span>
              <p class="text-sm text-base-content/80">点击"获取 Cookie 数据"按钮</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">4</span>
              <p class="text-sm text-base-content/80">复制 Cookie 用于后续操作</p>
            </div>
          </div>
        </div>
      </template>
    </Tabs>

    <!-- 发送到后端按钮（禁用状态） -->
    <button disabled class="btn btn-success w-full btn-disabled opacity-50 cursor-not-allowed">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      发送到后端（暂未开放）
    </button>

    <!-- Toast 提示 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { ref, computed, onMounted } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import Tabs from "~/components/Tabs.vue"
import Toast from "~/components/Toast.vue"
import { getCookies } from "~/utils/common"
import { loadAndApplyTheme } from "~/composables/useTheme"
import { supportedSites, matchProjectConf } from "~/utils/tab-utils"
import type { ProjectConf } from '~/types/project'

// Toast 引用
const toastRef = ref<InstanceType<typeof Toast>>()

// 项目配置
const projectConfig = ref<ProjectConf | null>(null)

// 当前激活的 Tab
const activeTab = ref('cookie')

// 页面加载时获取项目配置
onMounted(async () => {
  await loadAndApplyTheme()
  await loadProjectConfig()
})

/**
 * 加载项目配置
 * 通过匹配当前标签页获取对应的项目配置
 */
async function loadProjectConfig() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab) return

    // 查找匹配的项目配置
    for (const project of supportedSites) {
      try {
        if (matchProjectConf(tab, project)) {
          projectConfig.value = project
          console.log('[shein] 匹配到项目配置:', project)
          return
        }
      } catch {
        continue
      }
    }
  } catch (error) {
    console.error('[shein] 加载项目配置失败:', error)
  }
}

// Tab 配置
const tabs = computed(() => [
  { key: 'cookie', label: '🍪 获取 Cookie' },
  { key: 'guide', label: '📖 使用方式' }
])

// 状态
const gettingCookie = ref(false)
const copying = ref(false)
const copied = ref(false)

// 数据
const cookieValue = ref('')
const cookieCount = ref(0)

/**
 * 返回上一页
 */
function goBack() {
  window.history.back()
}

/**
 * 获取 Cookie 数据
 */
async function getCookieData() {
  try {
    gettingCookie.value = true
    cookieValue.value = ''

    const cookies = await getCookies()

    if (!cookies || cookies.length === 0) {
      throw new Error('未获取到 Cookie 数据')
    }

    // 将 cookie 数组格式化为 key=value;key=value 格式
    cookieValue.value = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
    cookieCount.value = cookies.length

    toastRef.value?.show({ message: `成功获取 ${cookies.length} 个 Cookie`, type: 'success' })
  } catch (error) {
    toastRef.value?.show({ message: error.message || '获取 Cookie 失败', type: 'error' })
  } finally {
    gettingCookie.value = false
  }
}

/**
 * 复制 Cookie 到剪贴板
 */
async function copyCookie() {
  if (!cookieValue.value) return

  try {
    copying.value = true
    await navigator.clipboard.writeText(cookieValue.value)
    copied.value = true
    toastRef.value?.show({ message: 'Cookie 已复制到剪贴板', type: 'success' })

    // 2秒后重置复制状态
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    toastRef.value?.show({ message: '复制失败，请手动复制', type: 'error' })
  } finally {
    copying.value = false
  }
}
</script>
