<template>
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
      <svg v-if="!clearingStorage" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      <span v-if="clearingStorage" class="loading loading-spinner loading-xs"></span>
      {{ clearingStorage ? '清空中...' : '清空 localStorage' }}
    </button>

    <!-- 清空 Cookie -->
    <button @click="clearCookies" :disabled="clearingCookies" class="btn btn-warning btn-sm w-full mb-3">
      <svg v-if="!clearingCookies" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
      <span v-if="clearingCookies" class="loading loading-spinner loading-xs"></span>
      {{ clearingCookies ? '清空中...' : '清空 Cookie' }}
    </button>

    <!-- 清空 sessionStorage -->
    <button @click="clearSessionStorage" :disabled="clearingSession" class="btn btn-warning btn-sm w-full">
      <svg v-if="!clearingSession" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <span v-if="clearingSession" class="loading loading-spinner loading-xs"></span>
      {{ clearingSession ? '清空中...' : '清空 sessionStorage' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { getCurrentTab } from "~/utils/common"
import { useXindaoToast } from "./toast"

/**
 * 设置 Tab
 * 清空当前站点的 localStorage / Cookie / sessionStorage
 */
const toast = useXindaoToast()

/** 是否正在清空 localStorage */
const clearingStorage = ref(false)
/** 是否正在清空 Cookie */
const clearingCookies = ref(false)
/** 是否正在清空 sessionStorage */
const clearingSession = ref(false)

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
      toast.show({ message: 'localStorage 已清空', type: 'success' })
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    toast.show({ message: '清空 localStorage 失败: ' + (error as Error).message, type: 'error' })
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
    toast.show({ message: `已清空 ${cookies.length} 个 Cookie`, type: 'success' })
  } catch (error) {
    toast.show({ message: '清空 Cookie 失败: ' + (error as Error).message, type: 'error' })
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
      toast.show({ message: 'sessionStorage 已清空', type: 'success' })
    } else {
      throw new Error(response.error)
    }
  } catch (error) {
    toast.show({ message: '清空 sessionStorage 失败: ' + (error as Error).message, type: 'error' })
  } finally {
    clearingSession.value = false
  }
}
</script>
