<template>
  <div class="flex gap-2">
    <!-- 固定为悬浮窗口按钮 -->
    <button
      class="btn btn-ghost btn-sm"
      :title="t('pinFloating', '固定为悬浮窗口（不会自动隐藏）')"
      @click="pinFloating"
    >
      <!-- 图钉图标 -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
        <path
          d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"
        />
      </svg>
    </button>

    <!-- 主题切换按钮 -->
    <button
      class="btn btn-ghost btn-sm"
      :title="currentTheme === 'dark' ? '切换到白天模式' : '切换到夜晚模式'"
      @click="toggleTheme"
    >
      <!-- 太阳图标（白天模式显示） -->
      <svg
        v-if="currentTheme !== 'dark'"
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      <!-- 月亮图标（夜晚模式显示） -->
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>

    <!-- 设置按钮 -->
    <a href="/tabs/settings.html" class="btn btn-ghost btn-sm" :title="t('settingsTitle')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </a>

    <!-- 关于按钮 -->
    <a href="/tabs/about.html" class="btn btn-ghost btn-sm" :title="t('aboutTitle')">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Storage } from "@plasmohq/storage"
import { t } from "~/utils/i18n"
import { applyTheme } from "~/composables/useTheme"

/**
 * 头部功能区组件
 * 包含固定悬浮窗口、主题切换、设置和关于按钮
 */

/** 悬浮窗口尺寸（侧边栏不可用时的回退方案） */
const FLOATING_WIDTH = 480
const FLOATING_HEIGHT = 680

// Storage 实例
const storage = new Storage()

/** 当前主题 */
const currentTheme = ref('light')

/** 当前窗口 ID（打开侧边栏用） */
const currentWindowId = ref<number | undefined>(undefined)

onMounted(async () => {
  // 从 storage 读取主题设置
  const savedTheme = await storage.get('theme') || 'light'
  currentTheme.value = savedTheme

  // 预取窗口 ID：sidePanel.open 必须在用户手势中同步发起，不能临时 await
  try {
    const win = await chrome.windows.getCurrent()
    currentWindowId.value = win.id
  } catch (error) {
    console.warn('[header] 获取当前窗口失败:', error)
  }
})

/**
 * 固定当前面板：优先钉到浏览器侧边栏
 * 侧边栏常驻在浏览器右侧，切换标签、点击页面都不会消失
 * 若浏览器不支持侧边栏，则回退为独立悬浮窗口
 */
function pinFloating() {
  if (chrome.sidePanel?.open) {
    console.log('[header] 固定到侧边栏, windowId =', currentWindowId.value)
    // 必须在用户手势中同步发起，因此这里不做 await
    chrome.sidePanel
      .open(currentWindowId.value !== undefined ? { windowId: currentWindowId.value } : {})
      .then(() => console.log('[header] 侧边栏已打开'))
      .catch(error => {
        console.warn('[header] 打开侧边栏失败，回退为悬浮窗口:', error)
        openFloatingWindow()
      })
    return
  }

  console.warn('[header] 当前浏览器不支持侧边栏，回退为悬浮窗口')
  openFloatingWindow()
}

/**
 * 独立悬浮窗口（侧边栏不可用时的回退方案）
 * popup 类型窗口失焦不会自动关闭
 */
async function openFloatingWindow() {
  try {
    const url = window.location.href
    console.log('[header] 固定为悬浮窗口:', url)

    // 已存在同一页面的悬浮窗口则直接聚焦，避免重复开窗
    const tabs = await chrome.tabs.query({})
    const existing = tabs.find(tab => tab.url === url)
    if (existing?.id !== undefined && existing.windowId !== undefined) {
      const win = await chrome.windows.get(existing.windowId).catch(() => null)
      if (win?.type === 'popup') {
        console.log('[header] 复用已存在的悬浮窗口:', existing.id)
        await chrome.tabs.update(existing.id, { active: true })
        await chrome.windows.update(existing.windowId, { focused: true })
        return
      }
    }

    const createData: chrome.windows.CreateData = {
      url,
      type: 'popup',
      width: FLOATING_WIDTH,
      height: FLOATING_HEIGHT,
      focused: true
    }

    // 贴在当前浏览器窗口右上角，形成悬浮面板的观感
    try {
      const current = await chrome.windows.getLastFocused()
      if (current.left !== undefined && current.top !== undefined && current.width !== undefined) {
        createData.left = Math.max(0, current.left + current.width - FLOATING_WIDTH - 24)
        createData.top = Math.max(0, current.top + 24)
      }
    } catch {
      // 定位失败时使用系统默认位置
    }

    await chrome.windows.create(createData)
  } catch (error) {
    console.error('[header] 打开悬浮窗口失败:', error)
  }
}

/**
 * 切换主题
 * 在 light 和 dark 之间切换
 */
async function toggleTheme() {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  currentTheme.value = newTheme
  await storage.set('theme', newTheme)
  applyTheme(newTheme)
}
</script>
