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
          <p class="text-xs text-base-content/60">{{ projectConfig?.matchUrl?.join(',') || 'xindaoyun.com' }}</p>
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
            <svg v-if="!gettingAccount" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span v-if="gettingAccount" class="loading loading-spinner loading-xs"></span>
            {{ gettingAccount ? '获取中...' : '获取账号数据' }}
          </button>

          <!-- 用户名展示区域 -->
          <div v-if="accountData" class="mb-4">
            <div class="alert alert-success">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="font-bold text-sm">提取成功</h3>
                <div class="text-xs">用户名: <span class="font-mono font-bold text-primary">{{ accountData.userName
                    }}</span></div>
              </div>
            </div>
          </div>

          <!-- 数据预览区域（可折叠） -->
          <div v-if="accountData" class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" />
            <div class="collapse-title text-sm font-medium">
              账号数据预览
            </div>
            <div class="collapse-content">
              <pre
                class="bg-base-300 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(accountData, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </template>

      <!-- 分析云 Tab -->
      <template #cookie>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-secondary/5 border border-secondary/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">☁️</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">分析云</h3>
              <p class="text-xs text-base-content/60">获取 Cookie 数据用于分析</p>
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

          <!-- Cookie 数据预览区域（可折叠） -->
          <div v-if="cookieData" class="collapse collapse-arrow bg-base-200">
            <input type="checkbox" checked />
            <div class="collapse-title text-sm font-medium">
              Cookie 数据预览
            </div>
            <div class="collapse-content">
              <pre
                class="bg-base-300 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(cookieData, null, 2) }}</pre>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import Tabs from "~/components/Tabs.vue"

import Toast from "~/components/Toast.vue"
import { getCookies, getAllLocalStorage, getAllSessionStorage, getLocalStorage ,getCurrentTab} from '~/utils/common'
import { Storage } from "@plasmohq/storage"
import { httpClient } from "~/utils/http-client"
import { supportedSites, matchProjectConf} from "~/utils/tab-utils"
import type { ProjectConf } from '~/types/project'
import { loadAndApplyTheme } from "~/composables/useTheme"

// Storage 实例
const storage = new Storage()

// Toast 引用
const toastRef = ref<InstanceType<typeof Toast>>()

// 项目配置
const projectConfig = ref<ProjectConf | null>(null)

// 当前激活的 Tab
const activeTab = ref('account')

// 页面加载时获取项目配置
onMounted(async () => {
  // 加载并应用主题
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
          console.log('[xindao] 匹配到项目配置:', project)
          return
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
  { key: 'cookie', label: '☁️ 分析云' }
])

// 状态
const gettingAccount = ref(false)
const gettingCookie = ref(false)
const sending = ref(false)

// 数据
const accountData = ref<any>(null)
const cookieData = ref<any>(null)

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
 * 获取账号数据（模拟）
 */
async function getAccountData() {
  try {
    gettingAccount.value = true
    await getAccountBody()

    gettingAccount.value = false
    toastRef.value?.show({ message: '账号数据获取成功', type: 'success' })
  } catch (error) {
    gettingAccount.value = false
    toastRef.value?.show({ message: error.message, type: 'error' })
  }
  gettingAccount.value = false

}

// 获取添加账号的请求体
async function getAccountBody(){
const qsStr = await getLocalStorage('qs')
    if (!qsStr) {
      throw new Error("qs数据不存在");

    }
   
    const qsData =JSON.parse(qsStr)
     console.log('qsData', qsData);
    // const classData = data.qs

    const seesData = getAllSessionStorage()
    console.log('getAllSessionStorage', seesData);
    const tab = await getCurrentTab()
    console.log('tab', tab);
    const url = new URL(tab.url)
    
    accountData.value = {
      accessKey:await storage.get('apiKey') || '',
      userName: qsData.userName,
      courseName: qsData.courseName,
      qsData: qsData,
      classData: {},
      baseUrl: url.origin + '/'
    }
    console.log('请求数据:', accountData.value);

}


/**
 * 获取 Cookie 数据（模拟）
 */
async function getCookieData() {
  gettingCookie.value = true

  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟 Cookie 数据
  cookieData.value = {
    type: 'cookie',
    sessionId: 'sess_' + Math.random().toString(36).substr(2, 16),
    authToken: 'tk_' + Math.random().toString(36).substr(2, 32),
    userToken: 'ut_' + Math.random().toString(36).substr(2, 20),
    expiresIn: 3600,
    domain: 'xindaoyun.com',
    path: '/',
    secure: true,
    httpOnly: true
  }

  gettingCookie.value = false
  toastRef.value?.show({ message: 'Cookie 数据获取成功', type: 'success' })
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

  // 准备发送的数据
  const dataToSend = activeTab.value === 'account' ? accountData.value : cookieData.value
  if (!dataToSend) {
    toastRef.value?.show({ message: '请先获取数据', type: 'warning' })
    return
  }

  const uri = activeTab.value === 'account' ? '/api/plu/adduser' : '/api/plu/addFenxiYun'
  sending.value = true

  try {
    // 这里应该调用实际的 API
    const result = await httpClient.post<{ code: number; msg: string; data: string | null }>(`${backendUrl}${uri}`, 
      dataToSend
    )
    // 校验响应数据
    if (result.data.code === 200) {
    toastRef.value?.show({ message: `${activeTab.value === 'account' ? '账号' : '分析云'}数据发送成功`, type: 'success' })

    } else {
    toastRef.value?.show({ message: `${activeTab.value === 'account' ? '账号' : '分析云'}数据发送失败:${result.data.msg}` , type: 'error' })

    }
    // 模拟成功

    // 清空数据
    if (activeTab.value === 'account') {
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
