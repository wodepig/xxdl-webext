<template>
  <div class="flex gap-2">
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
 * 包含主题切换、设置和关于按钮
 */

// Storage 实例
const storage = new Storage()

/** 当前主题 */
const currentTheme = ref('light')

onMounted(async () => {
  // 从 storage 读取主题设置
  const savedTheme = await storage.get('theme') || 'light'
  currentTheme.value = savedTheme
})

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
