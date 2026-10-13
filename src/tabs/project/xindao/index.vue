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
          <h1 class="text-lg font-bold">{{ projectConfig?.name || '新道云' }}</h1>
          <p class="text-xs text-base-content/60">{{ projectConfig?.matchUrl?.join(',').substring(0, 20) + '......' ||
            'xindaoyun.com' }}</p>
        </div>
      </div>
      <HeaderActions />
    </div>

    <!-- 项目描述 -->
    <div v-if="projectConfig?.description" class="alert alert-info mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span class="text-sm">{{ projectConfig.description }}</span>
    </div>

    <!-- 功能内容区域 - Tab 标签页 -->
    <Tabs v-model="activeTab" :tabs="tabs" name="xindaoyun_tabs" custom-class="mb-4">
      <!-- 添加账号 Tab -->
      <template #account>
        <AccountTab ref="accountTabRef" v-model="accountData" />
      </template>

      <!-- 自动登录 Tab -->
      <template #login>
        <LoginTab />
      </template>

      <!-- 分析云 Tab -->
      <template #cookie>
        <CookieTab ref="cookieTabRef" v-model="cookieData" />
      </template>

      <!-- 使用说明 Tab -->
      <template #guide>
        <GuideTab />
      </template>

      <!-- 设置 Tab -->
      <template #settings>
        <SettingsTab />
      </template>
    </Tabs>

    <!-- 发送到后端按钮 -->
    <button @click="sendToBackend" :disabled="!canSend || sending" class="btn btn-success w-full">
      <svg v-if="!sending" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
      <span v-if="sending" class="loading loading-spinner loading-sm"></span>
      {{ sending ? '发送中...' : '发送到后端' }}
    </button>

    <!-- Toast 提示 -->
    <Toast ref="toastRef" />
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { ref, computed, onMounted, provide } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import Tabs from "~/components/Tabs.vue"
import Toast from "~/components/Toast.vue"
import { Storage } from "@plasmohq/storage"
import { httpClient } from "~/utils/http-client"
import { supportedSites, matchProjectConf } from "~/utils/tab-utils"
import type { ProjectConf } from '~/types/project'
import { loadAndApplyTheme } from "~/composables/useTheme"
import AccountTab from "./AccountTab.vue"
import LoginTab from "./LoginTab.vue"
import CookieTab from "./CookieTab.vue"
import GuideTab from "./GuideTab.vue"
import SettingsTab from "./SettingsTab.vue"
import { XINDAO_TOAST_KEY } from "./toast"

/**
 * 新道云项目主页面
 * 负责头部信息、Tab 容器、跨 Tab 的数据（账号/分析云）与统一的 Toast、发送到后端
 */

// Storage 实例
const storage = new Storage()

// Toast 引用
const toastRef = ref<InstanceType<typeof Toast>>()

// 项目配置
const projectConfig = ref<ProjectConf | null>(null)

// 当前激活的 Tab
const activeTab = ref('account')

// 子 Tab 引用，用于页面挂载时自动获取数据
const accountTabRef = ref<InstanceType<typeof AccountTab> | null>(null)
const cookieTabRef = ref<InstanceType<typeof CookieTab> | null>(null)

// 数据（由子 Tab 通过 v-model 写入，发送后在此清空）
const accountData = ref<any>(null)
const cookieData = ref<any>(null)

// 是否正在发送
const sending = ref(false)

// 把统一的 Toast 提供给各 Tab 子组件
provide(XINDAO_TOAST_KEY, {
  show: (options) => toastRef.value?.show(options)
})

// 页面加载时获取项目配置
onMounted(async () => {
  // 加载并应用主题
  await loadAndApplyTheme()
  // 自动切换 tab 并获取数据
  const tab = await loadProjectConfig()
  if (tab?.url?.includes('/runner_web/student/index')) {
    activeTab.value = 'account'
    accountTabRef.value?.fetchAccountData()
  }
  if (tab?.url?.includes('/web/workbench/homepage')) {
    activeTab.value = 'cookie'
    cookieTabRef.value?.fetchCookieData()
  }
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
          console.log('[xindao] 匹配到项目配置:', project)
          return tab
        }
      } catch {
        continue
      }
    }
  } catch (error) {
    console.error('[xindao] 加载项目配置失败:', error)
  }
}

// Tab 配置
const tabs = computed(() => [
  { key: 'account', label: '➕ 添加账号' },
  { key: 'login', label: '🔑 自动登录' },
  { key: 'cookie', label: '☁️ 分析云' },
  { key: 'guide', label: '📖 说明' },
  { key: 'settings', label: '⚙️ 设置' }
])

// 是否可以发送
const canSend = computed(() => {
  return accountData.value !== null || cookieData.value !== null
})

/**
 * 返回上一页
 */
function goBack() {
  window.history.back()
}

/**
 * 发送到后端
 */
async function sendToBackend() {
  // 获取设置
  const backendUrl = await storage.get('backendUrl') as string
  const apiKey = await storage.get('apiKey') as string

  if (!backendUrl || !apiKey) {
    toastRef.value?.show({ message: '请先配置后端地址和密钥', type: 'warning' })
    return
  }

  // 只有账号/分析云 Tab 才有可发送的数据
  const isAccount = activeTab.value === 'account'
  if (!isAccount && activeTab.value !== 'cookie') {
    toastRef.value?.show({ message: '当前页面没有可发送的数据', type: 'warning' })
    return
  }

  // 准备发送的数据
  const dataToSend = isAccount ? accountData.value : cookieData.value
  if (!dataToSend) {
    toastRef.value?.show({ message: '请先获取数据', type: 'warning' })
    return
  }

  const uri = isAccount ? '/api/plu/adduser' : '/api/plu/addFenxiYun'
  sending.value = true

  try {
    const result = await httpClient.post<{ code: number; msg: string; data: string | null }>(`${backendUrl}${uri}`,
      dataToSend
    )
    // 校验响应数据
    if (result.data.code === 200) {
      toastRef.value?.show({ message: `${isAccount ? '账号' : '分析云'}数据发送成功`, type: 'success' })
    } else {
      toastRef.value?.show({ message: `${isAccount ? '账号' : '分析云'}数据发送失败:${result.data.msg}`, type: 'error' })
    }

    // 清空数据
    if (isAccount) {
      accountData.value = null
    } else {
      cookieData.value = null
    }
  } catch (error) {
    toastRef.value?.show({ message: '发送失败，请检查网络或配置', type: 'error' })
  } finally {
    sending.value = false
  }
}
</script>
