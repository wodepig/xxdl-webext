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
                <div class="text-xs flex items-center gap-1">Token:
                  <span class="font-mono font-bold text-primary" :title="accountData.qsData.userToken">{{
                    truncateToken(accountData.qsData.userToken) }}</span>
                  <button @click="copyToken(accountData.qsData.userToken)"
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

      <!-- 自动登录 Tab -->
      <template #login>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">🔑</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">自动登录</h3>
              <p class="text-xs text-base-content/60">打开网址并自动填充账号密码</p>
            </div>
          </div>

          <div class="space-y-3">
            <!-- 目标地址：主机 + 路径 -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-control">
                <label class="label py-1">
                  <span class="label-text text-xs">主机</span>
                </label>
                <input v-model="loginForm.host" type="text" placeholder="https://edu.seentao.com"
                  class="input input-bordered input-sm w-full" />
              </div>
              <div class="form-control">
                <label class="label py-1">
                  <span class="label-text text-xs">路径</span>
                </label>
                <input v-model="loginForm.path" type="text" placeholder="/runner_web/login"
                  class="input input-bordered input-sm w-full" />
              </div>
            </div>

            <!-- 元素 id -->
            <div class="grid grid-cols-2 gap-2">
              <div class="form-control">
                <label class="label py-1">
                  <span class="label-text text-xs">用户名元素 id</span>
                </label>
                <input v-model="loginForm.usernameId" type="text" placeholder="username"
                  class="input input-bordered input-sm w-full" />
              </div>
              <div class="form-control">
                <label class="label py-1">
                  <span class="label-text text-xs">密码元素 id</span>
                </label>
                <input v-model="loginForm.passwordId" type="text" placeholder="password"
                  class="input input-bordered input-sm w-full" />
              </div>
            </div>
            <p class="text-xs text-base-content/50 -mt-1">
              留空则自动查找页面中的用户名/密码输入框，也可填 #id 或 CSS 选择器
            </p>

            <!-- 账号 -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs">账号</span>
              </label>
              <input v-model="loginForm.username" type="text" placeholder="请输入账号"
                class="input input-bordered input-sm w-full" />
            </div>

            <!-- 密码 -->
            <div class="form-control">
              <label class="label py-1">
                <span class="label-text text-xs">密码</span>
              </label>
              <div class="relative">
                <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" placeholder="请输入密码"
                  class="input input-bordered input-sm w-full pr-10" />
                <button type="button" @click="showLoginPassword = !showLoginPassword"
                  class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle" title="显示/隐藏密码">
                  <svg v-if="!showLoginPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
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
            </div>

            <!-- 无痕 -->
            <label class="label cursor-pointer justify-start gap-2 py-1">
              <input v-model="loginForm.incognito" type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
              <span class="label-text text-xs">使用无痕窗口打开</span>
            </label>
            <p v-if="loginForm.incognito" class="text-xs text-base-content/50 -mt-1">
              需先在扩展详情页开启「在无痕模式下启用」，否则无法创建无痕窗口
            </p>

            <!-- 确定 -->
            <button @click="autoLogin" :disabled="logging" class="btn btn-primary btn-sm w-full">
              <svg v-if="!logging" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M5 13l4 4L19 7" />
              </svg>
              <span v-if="logging" class="loading loading-spinner loading-xs"></span>
              {{ logging ? '执行中...' : '确定' }}
            </button>

            <!-- 执行日志：固定单行，超出横向滚动并自动滚到最新 -->
            <div v-if="loginStatus" ref="loginLogRef"
              class="rounded-box border px-3 py-2 text-xs whitespace-nowrap overflow-x-auto"
              :class="loginStatusType === 'error' ? 'border-error/40 text-error' : loginStatusType === 'success' ? 'border-success/40 text-success' : 'border-info/40 text-info'">
              {{ loginStatus }}
            </div>

            <!-- 目标页面在后台打开，需要时手动切换过去 -->
            <template v-if="lastLoginTabId !== null">
              <button @click="focusLoginTab" class="btn btn-outline btn-sm w-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                切换到目标页面
              </button>
              <p class="text-xs text-base-content/50">
                目标页面在后台打开，不会中断当前窗口；点击上方按钮可切换过去
              </p>
            </template>
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

      <!-- 使用说明 Tab -->
      <template #guide>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-info/5 border border-info/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">📖</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">使用说明</h3>
              <p class="text-xs text-base-content/60">操作步骤指南</p>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">1</span>
              <p class="text-sm text-base-content/80">登录前去设置页面清空相关数据</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">2</span>
              <p class="text-sm text-base-content/80">执行登录</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">3</span>
              <p class="text-sm text-base-content/80">进入课程列表界面</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">4</span>
              <p class="text-sm text-base-content/80">获取并添加账号数据</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">5</span>
              <p class="text-sm text-base-content/80">进入分析云页面</p>
            </div>
            <div class="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
              <span class="badge badge-primary badge-sm">6</span>
              <p class="text-sm text-base-content/80">添加分析云数据</p>
            </div>
          </div>
        </div>
      </template>

      <!-- 设置 Tab -->
      <template #settings>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20 mb-4">
            <div class="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span class="text-xl">⚙️</span>
            </div>
            <div class="flex-1">
              <h3 class="text-sm font-semibold mb-1">设置</h3>
              <p class="text-xs text-base-content/60">管理浏览器存储数据</p>
            </div>
          </div>

          <!-- 清空 localStorage -->
          <button @click="clearLocalStorage" :disabled="clearingStorage" class="btn btn-warning btn-sm w-full mb-3">
            <svg v-if="!clearingStorage" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span v-if="clearingStorage" class="loading loading-spinner loading-xs"></span>
            {{ clearingStorage ? '清空中...' : '清空 localStorage' }}
          </button>

          <!-- 清空 Cookie -->
          <button @click="clearCookies" :disabled="clearingCookies" class="btn btn-warning btn-sm w-full mb-3">
            <svg v-if="!clearingCookies" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span v-if="clearingCookies" class="loading loading-spinner loading-xs"></span>
            {{ clearingCookies ? '清空中...' : '清空 Cookie' }}
          </button>

          <!-- 清空 sessionStorage -->
          <button @click="clearSessionStorage" :disabled="clearingSession" class="btn btn-warning btn-sm w-full">
            <svg v-if="!clearingSession" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span v-if="clearingSession" class="loading loading-spinner loading-xs"></span>
            {{ clearingSession ? '清空中...' : '清空 sessionStorage' }}
          </button>
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
import { ref, computed, reactive, onMounted, nextTick } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import Tabs from "~/components/Tabs.vue"

import Toast from "~/components/Toast.vue"
import { getCookies, getAllLocalStorage, getSessionStorage, getLocalStorage, getCurrentTab } from '~/utils/common'
import { Storage } from "@plasmohq/storage"
import { httpClient } from "~/utils/http-client"
import { supportedSites, matchProjectConf } from "~/utils/tab-utils"
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
  // 自动切换tab并获取数据
  const tab = await loadProjectConfig()
  // 预填自动登录的目标地址（拆分为主机 + 路径）
  if (tab?.url) {
    try {
      const current = new URL(tab.url)
      loginForm.host = current.origin
      loginForm.path = current.pathname + current.search + current.hash
    } catch {
      loginForm.host = tab.url
    }
  }
  if (tab?.url?.includes('/runner_web/student/index')) {
    activeTab.value = 'account'
    getAccountData()
  }
  if (tab?.url?.includes('/web/workbench/homepage')) {
    activeTab.value = 'cookie'
    getCookieData()
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

// 状态
const gettingAccount = ref(false)
const gettingCookie = ref(false)
const sending = ref(false)
const clearingStorage = ref(false)
const clearingCookies = ref(false)
const clearingSession = ref(false)

// ==================== 自动登录 ====================
/** 自动登录表单 */
const loginForm = reactive({
  /** 目标主机（含协议，如 https://edu.seentao.com） */
  host: 'https://edu.seentao.com',
  /** 目标路径（如 /runner_web/login） */
  path: '/runner_web/login',
  /** 账号 */
  username: '123456',
  /** 密码 */
  password: '123456',
  /** 用户名输入框元素 id（支持 #id 或 CSS 选择器，留空则自动查找） */
  usernameId: '#userName',
  /** 密码输入框元素 id（支持 #id 或 CSS 选择器，留空则自动查找） */
  passwordId: '#password',
  /** 是否使用无痕窗口打开 */
  incognito: false
})
/** 是否正在执行自动登录 */
const logging = ref(false)
/** 是否明文显示密码 */
const showLoginPassword = ref(false)
/** 执行结果提示（界面单行日志） */
const loginStatus = ref('')
/** 执行结果类型：success | error | info */
const loginStatusType = ref<'success' | 'error' | 'info'>('info')
/** 单行日志 DOM 引用（内容超出时自动滚动到最新） */
const loginLogRef = ref<HTMLElement | null>(null)
/** 最近一次自动登录打开的目标标签页 ID */
const lastLoginTabId = ref<number | null>(null)
/** 最近一次自动登录打开的目标窗口 ID（无痕窗口） */
const lastLoginWindowId = ref<number | null>(null)

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
 * 截取 Token 显示：前 8 位 + ... + 后 4 位
 */
function truncateToken(token: string): string {
  if (!token) return ''
  if (token.length <= 16) return token
  return `${token.slice(0, 8)}...${token.slice(-4)}`
}

/**
 * 复制 Token 到剪贴板
 */
async function copyToken(token: string) {
  try {
    await navigator.clipboard.writeText(token)
    toastRef.value?.show({ message: 'Token 已复制', type: 'success' })
  } catch (error) {
    toastRef.value?.show({ message: '复制失败: ' + error.message, type: 'error' })
  }
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
async function getAccountBody() {
  const qsStr = await getLocalStorage('qs')
  if (!qsStr) {
    throw new Error("qs数据不存在, 尝试设置中清空内容重登");
  }

  const qsData = JSON.parse(qsStr)
  console.log('qsData', qsData);
  // const classData = data.qs

  const classDataStr = await getSessionStorage('classData')
  if (!classDataStr) {
    throw new Error("classData数据不存在");
  }
  const tab = await getCurrentTab()
  const url = new URL(tab.url)

  accountData.value = {
    accessKey: await storage.get('apiKey') || '',
    userName: qsData.userName,
    courseName: qsData.courseName,
    qsData: qsData,
    classData: JSON.parse(classDataStr),
    baseUrl: url.origin + '/'
  }
  console.log('请求数据:', accountData.value);

}


/**
 * 获取 Cookie 数据
 */
async function getCookieData() {
  gettingCookie.value = true

  const ckData = await getCookies()
  if (!ckData) {
    throw new Error("Cookie 数据不存在");
  }
  console.log('ckData', ckData);
  // 将 cookie 数组格式化为 key=value;key=value 格式
  const ck = ckData.map(cookie => `${cookie.name}=${cookie.value}`).join(';')
  // 模拟延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
  const tab = await getCurrentTab()
  if (!tab.url) {
    throw new Error("标签页 URL 为空");
  }
  // 模拟 Cookie 数据
  cookieData.value = {
    type: 'cookie',
    pageTitle: tab.title,
    path: tab.url,
    cookie: ck,
  }

  gettingCookie.value = false
  toastRef.value?.show({ message: 'Cookie 数据获取成功', type: 'success' })
}

/**
 * 清空 localStorage
 * 通过发送消息给 content script 执行
 */
async function clearLocalStorage() {
  try {
    clearingStorage.value = true
    const tab = await getCurrentTab()
    if (!tab.id) throw new Error('标签页 ID 为空')

    const response = await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_LOCAL_STORAGE' })
    if (response.success) {
      toastRef.value?.show({ message: 'localStorage 已清空', type: 'success' })
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    toastRef.value?.show({ message: '清空 localStorage 失败: ' + error.message, type: 'error' })
  } finally {
    clearingStorage.value = false
  }
}

/**
 * 清空 Cookie
 */
async function clearCookies() {
  try {
    clearingCookies.value = true
    const tab = await getCurrentTab()
    if (!tab.url) throw new Error('标签页 URL 为空')

    const cookies = await chrome.cookies.getAll({ url: tab.url })
    for (const cookie of cookies) {
      await chrome.cookies.remove({
        url: tab.url,
        name: cookie.name
      })
    }
    toastRef.value?.show({ message: `已清空 ${cookies.length} 个 Cookie`, type: 'success' })
  } catch (error) {
    toastRef.value?.show({ message: '清空 Cookie 失败: ' + error.message, type: 'error' })
  } finally {
    clearingCookies.value = false
  }
}

/**
 * 清空 sessionStorage
 * 通过发送消息给 content script 执行
 */
async function clearSessionStorage() {
  try {
    clearingSession.value = true
    const tab = await getCurrentTab()
    if (!tab.id) throw new Error('标签页 ID 为空')

    const response = await chrome.tabs.sendMessage(tab.id, { type: 'CLEAR_SESSION_STORAGE' })
    if (response.success) {
      toastRef.value?.show({ message: 'sessionStorage 已清空', type: 'success' })
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    toastRef.value?.show({ message: '清空 sessionStorage 失败: ' + error.message, type: 'error' })
  } finally {
    clearingSession.value = false
  }
}

// ==================== 自动登录实现 ====================

/** 注入脚本入参 */
interface FillLoginPayload {
  usernameId: string
  passwordId: string
  username: string
  password: string
}

/** 注入脚本执行结果 */
interface FillLoginResult {
  userFound: boolean
  pwdFound: boolean
}

/** 打开页面后的目标信息 */
interface LoginTarget {
  /** 标签页 ID */
  tabId: number
  /** 窗口 ID（无痕窗口时用于重新聚焦） */
  windowId?: number
}

/**
 * 更新界面单行日志：同时打印到扩展控制台，并在内容超出时自动滚动到最新
 * @param message - 日志内容
 * @param type - 日志类型，决定颜色
 */
function setLoginStatus(message: string, type: 'success' | 'error' | 'info' = 'info') {
  loginStatus.value = message
  loginStatusType.value = type
  console.log('[自动登录]', message)
  nextTick(() => {
    const el = loginLogRef.value
    if (el) {
      el.scrollLeft = el.scrollWidth
    }
  })
}

/**
 * 延时等待
 * @param ms - 毫秒
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 拼接主机与路径，主机缺少协议时补全 https://
 * @param host - 主机（可含协议与端口）
 * @param path - 路径（可不带前导 /）
 * @returns 规范化后的完整网址
 */
function buildTargetUrl(host: string, path: string): string {
  let base = (host || '').trim()
  if (!base) {
    throw new Error('请输入主机地址')
  }
  if (!/^https?:\/\//i.test(base)) {
    base = 'https://' + base
  }

  let suffix = (path || '').trim()
  if (suffix && !suffix.startsWith('/')) {
    suffix = '/' + suffix
  }

  const url = base.replace(/\/+$/, '') + suffix
  try {
    new URL(url)
  } catch {
    throw new Error('网址格式不正确')
  }
  return url
}

/**
 * 打开目标网址
 * 注意：始终以「后台」方式打开，不抢占焦点
 * 扩展操作页可能运行在 action popup 中，一旦焦点被抢走，弹窗会立即被浏览器销毁
 * @param url - 目标网址
 * @param incognito - 是否使用无痕窗口
 * @returns 新标签页 ID 与所属窗口 ID
 */
async function openLoginTab(url: string, incognito: boolean): Promise<LoginTarget> {
  // 普通标签页
  if (!incognito) {
    console.log('[自动登录] 后台打开标签页:', url)
    const tab = await chrome.tabs.create({ url, active: false })
    if (!tab.id) {
      throw new Error('创建标签页失败')
    }
    console.log('[自动登录] 标签页已创建: tabId =', tab.id, ', windowId =', tab.windowId)
    return { tabId: tab.id, windowId: tab.windowId }
  }

  // 无痕窗口
  return openIncognitoTab(url)
}

/**
 * 在无痕窗口中打开目标网址
 * 注意：MV3 下 chrome.windows.create 的返回值可能为 null，不能依赖它
 * 因此这里用「窗口列表差集」定位新建的无痕窗口
 * @param url - 目标网址
 * @returns 新标签页 ID 与无痕窗口 ID
 */
async function openIncognitoTab(url: string): Promise<LoginTarget> {
  // 先确认扩展是否被允许在无痕模式下运行，避免创建失败后无从判断原因
  let allowed = true
  try {
    allowed = await chrome.extension.isAllowedIncognitoAccess()
  } catch (error) {
    console.warn('[自动登录] 无法检测无痕权限:', error)
  }
  console.log('[自动登录] 扩展无痕权限:', allowed)
  if (!allowed) {
    throw new Error('扩展未开启「在无痕模式下启用」，请在扩展详情页开启后重试')
  }

  // 记录创建前的无痕窗口，便于稍后定位新窗口
  const before = await chrome.windows.getAll({ populate: false })
  const beforeIds = before.filter(w => w.incognito && w.id !== undefined).map(w => w.id as number)

  console.log('[自动登录] 后台打开无痕窗口:', url)
  try {
    const created = await chrome.windows.create({ url, incognito: true, focused: false })
    const createdTabId = created?.tabs?.[0]?.id
    if (created?.id !== undefined && createdTabId) {
      console.log('[自动登录] 无痕窗口已创建(直接返回): tabId =', createdTabId, ', windowId =', created.id)
      return { tabId: createdTabId, windowId: created.id }
    }
    // 返回值为 null 或窗口内标签页尚未就绪，转入轮询
    console.warn('[自动登录] windows.create 未返回可用窗口:', created)
  } catch (error) {
    console.error('[自动登录] 无痕窗口创建失败:', error)
    throw new Error(`无痕窗口打开失败：${(error as Error).message}`)
  }

  // 轮询窗口列表，找到新建的无痕窗口及其标签页
  for (let i = 0; i < 25; i++) {
    const wins = await chrome.windows.getAll({ populate: true })
    const target = wins.find(w => w.incognito && w.id !== undefined && !beforeIds.includes(w.id))
    const tabId = target?.tabs?.[0]?.id
    if (target?.id !== undefined && tabId) {
      console.log('[自动登录] 无痕窗口已创建(轮询): tabId =', tabId, ', windowId =', target.id)
      return { tabId, windowId: target.id }
    }
    await sleep(200)
  }

  throw new Error('未能获取无痕窗口的标签页，请确认已在扩展详情页开启「在无痕模式下启用」')
}

/**
 * 等待标签页加载完成
 * @param tabId - 标签页 ID
 * @param timeout - 超时时间（毫秒）
 */
function waitTabComplete(tabId: number, timeout = 45000): Promise<void> {
  const startAt = Date.now()
  console.log('[自动登录] 等待页面加载完成: tabId =', tabId, ', 超时 =', timeout, 'ms')

  return new Promise((resolve, reject) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout>

    /**
     * 结束等待（只生效一次）
     * @param error - 有值时视为失败
     */
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      chrome.tabs.onUpdated.removeListener(listener)
      clearTimeout(timer)
      if (error) {
        console.warn('[自动登录] 等待页面加载结束(失败):', error.message, ', 耗时', Date.now() - startAt, 'ms')
        reject(error)
      } else {
        console.log('[自动登录] 页面加载完成, 耗时', Date.now() - startAt, 'ms')
        resolve()
      }
    }

    const listener = (id: number, info: chrome.tabs.TabChangeInfo) => {
      if (id !== tabId) return
      console.log('[自动登录] tab 状态更新: status =', info.status)
      if (info.status === 'complete') {
        finish()
      }
    }

    timer = setTimeout(() => finish(new Error('页面加载超时')), timeout)
    chrome.tabs.onUpdated.addListener(listener)

    // 监听器注册前可能已加载完成，主动查询一次
    chrome.tabs.get(tabId)
      .then(tab => {
        console.log('[自动登录] 当前标签页状态:', tab.status)
        if (tab.status === 'complete') finish()
      })
      .catch(() => finish(new Error('标签页已关闭')))
  })
}

/**
 * 在目标页面查找并填充用户名/密码输入框
 * 注意：该函数会被序列化后注入目标页面执行，不能引用外部作用域的变量
 * @param payload - 元素 id 与待填充的账号密码
 * @returns 是否找到用户名/密码输入框
 */
function injectFillLogin(payload: FillLoginPayload): FillLoginResult {
  /** 按元素 id（支持 #id 写法）或 CSS 选择器定位输入框 */
  const findInput = (raw: string): HTMLInputElement | null => {
    const value = (raw || '').trim()
    if (!value) return null

    const byId = document.getElementById(value.replace(/^#/, ''))
    if (byId instanceof HTMLInputElement) return byId

    try {
      const bySelector = document.querySelector(value)
      if (bySelector instanceof HTMLInputElement) return bySelector
    } catch {
      // 非法选择器，忽略
    }
    return null
  }

  /** 未指定 id 时自动查找第一个可用的文本输入框 */
  const findUserInput = (): HTMLInputElement | null => {
    const inputs = document.querySelectorAll('input')
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i]
      const type = (el.type || 'text').toLowerCase()
      if (el.disabled || el.readOnly) continue
      if (type === 'text' || type === 'email' || type === 'tel' || type === 'number') return el
    }
    return null
  }

  /** 未指定 id 时自动查找密码输入框 */
  const findPasswordInput = (): HTMLInputElement | null => {
    const el = document.querySelector('input[type="password"]')
    return el instanceof HTMLInputElement ? el : null
  }

  /** 赋值并触发事件，兼容 Vue/React 等受控组件 */
  const setValue = (el: HTMLInputElement, value: string) => {
    if (el.value === value) return
    try {
      el.focus()
    } catch {
      // 忽略聚焦失败
    }
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')
    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(el, value)
    } else {
      el.value = value
    }
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }))
  }

  const userInput = findInput(payload.usernameId) || (payload.usernameId.trim() ? null : findUserInput())
  const passwordInput = findInput(payload.passwordId) || (payload.passwordId.trim() ? null : findPasswordInput())

  if (userInput && payload.username) setValue(userInput, payload.username)
  if (passwordInput && payload.password) setValue(passwordInput, payload.password)

  return { userFound: !!userInput, pwdFound: !!passwordInput }
}

/**
 * 轮询注入脚本，等待输入框渲染完成后填充
 * @param tabId - 目标标签页 ID
 * @param maxAttempts - 最大重试次数
 * @returns 最后一次注入的执行结果
 */
async function fillLoginInputs(tabId: number, maxAttempts = 10): Promise<FillLoginResult> {
  const payload: FillLoginPayload = {
    usernameId: loginForm.usernameId.trim(),
    passwordId: loginForm.passwordId.trim(),
    username: loginForm.username,
    password: loginForm.password
  }

  console.log('[自动登录] 开始填充, 参数:', {
    tabId,
    maxAttempts,
    usernameId: payload.usernameId || '(自动查找)',
    passwordId: payload.passwordId || '(自动查找)',
    username: payload.username,
    password: payload.password ? `已填写(长度 ${payload.password.length})` : '未填写'
  })

  let result: FillLoginResult = { userFound: false, pwdFound: false }
  let lastInjectError = ''

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let current: FillLoginResult | undefined
    try {
      const injections = await chrome.scripting.executeScript({
        target: { tabId },
        func: injectFillLogin,
        args: [payload]
      })
      current = injections[0]?.result as FillLoginResult | undefined
      lastInjectError = ''
    } catch (error) {
      // 页面仍在加载、脚本上下文未就绪时会注入失败，记录下来继续重试
      lastInjectError = (error as Error).message
      const alive = await chrome.tabs.get(tabId).then(() => true).catch(() => false)
      console.warn('[自动登录] 第', attempt, '/', maxAttempts, '次注入失败:', lastInjectError, ', 标签页存在 =', alive)
      if (!alive) {
        throw new Error('目标标签页已关闭')
      }
      if (attempt < maxAttempts) {
        setLoginStatus(`查找输入框失败，重试 ${attempt}/${maxAttempts}`)
        await sleep(500)
      }
      continue
    }

    if (current) {
      result = current
      console.log('[自动登录] 第', attempt, '/', maxAttempts, '次注入结果: userFound =', current.userFound, ', pwdFound =', current.pwdFound)
      const usernameReady = !payload.username || current.userFound
      const passwordReady = !payload.password || current.pwdFound
      if (usernameReady && passwordReady) {
        console.log('[自动登录] 填充完成, 共尝试', attempt, '次')
        return result
      }
      if (attempt < maxAttempts) {
        setLoginStatus(`未找到输入框，重试 ${attempt}/${maxAttempts}`)
      }
    }
    await sleep(500)
  }

  console.warn('[自动登录] 重试次数用尽:', { maxAttempts, result, lastInjectError })
  if (lastInjectError && !result.userFound && !result.pwdFound) {
    throw new Error(`注入脚本失败：${lastInjectError}`)
  }
  return result
}

/**
 * 自动登录：打开网址并填充账号密码
 */
async function autoLogin() {
  if (logging.value) return

  loginStatus.value = ''
  console.log('[自动登录] ===== 开始执行 =====')
  console.log('[自动登录] 表单参数:', {
    host: loginForm.host,
    path: loginForm.path,
    usernameId: loginForm.usernameId || '(自动查找)',
    passwordId: loginForm.passwordId || '(自动查找)',
    username: loginForm.username,
    password: loginForm.password ? `已填写(长度 ${loginForm.password.length})` : '未填写',
    incognito: loginForm.incognito
  })

  try {
    const url = buildTargetUrl(loginForm.host, loginForm.path)
    console.log('[自动登录] 组装后的完整网址:', url)

    if (!loginForm.username && !loginForm.password) {
      throw new Error('请输入账号或密码')
    }

    logging.value = true
    setLoginStatus('正在打开页面...')

    const target = await openLoginTab(url, loginForm.incognito)
    lastLoginTabId.value = target.tabId
    lastLoginWindowId.value = target.windowId ?? null

    await waitTabComplete(target.tabId)

    setLoginStatus('正在填充账号密码...')
    const result = await fillLoginInputs(target.tabId)

    const filled: string[] = []
    if (result.userFound && loginForm.username) filled.push('账号')
    if (result.pwdFound && loginForm.password) filled.push('密码')

    if (!filled.length) {
      throw new Error('未找到用户名/密码输入框，请检查元素 id 或页面结构')
    }

    setLoginStatus(`已自动输入${filled.join('、')}，可在目标页面点击登录`, 'success')
    console.log('[自动登录] ===== 执行成功 ===== 已输入:', filled.join('、'))
    toastRef.value?.show({ message: `已自动输入${filled.join('、')}`, type: 'success', duration: 5000 })
  } catch (error) {
    setLoginStatus((error as Error).message || '自动登录失败', 'error')
    console.error('[自动登录] ===== 执行失败 =====', error)
    toastRef.value?.show({ message: loginStatus.value, type: 'error', duration: 5000 })
  } finally {
    logging.value = false
  }
}

/**
 * 切换到目标标签页（用户主动点击，切换后当前弹窗会被浏览器关闭）
 */
async function focusLoginTab() {
  if (lastLoginTabId.value === null) return

  console.log('[自动登录] 切换到目标标签页: tabId =', lastLoginTabId.value, ', windowId =', lastLoginWindowId.value)
  try {
    if (loginForm.incognito && lastLoginWindowId.value !== null) {
      await chrome.windows.update(lastLoginWindowId.value, { focused: true })
    }
    await chrome.tabs.update(lastLoginTabId.value, { active: true })
  } catch (error) {
    console.error('[自动登录] 切换标签页失败:', error)
    toastRef.value?.show({ message: '切换标签页失败: ' + (error as Error).message, type: 'error' })
  }
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
    // 这里应该调用实际的 API
    const result = await httpClient.post<{ code: number; msg: string; data: string | null }>(`${backendUrl}${uri}`,
      dataToSend
    )
    // 校验响应数据
    if (result.data.code === 200) {
      toastRef.value?.show({ message: `${isAccount ? '账号' : '分析云'}数据发送成功`, type: 'success' })

    } else {
      toastRef.value?.show({ message: `${isAccount ? '账号' : '分析云'}数据发送失败:${result.data.msg}`, type: 'error' })

    }
    // 模拟成功

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
