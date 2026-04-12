<template>
  <div class="p-4 w-[470px] min-h-[400px] bg-base-200">
    <!-- 头部区域 -->
    <div class="flex items-center gap-3 mb-4">
      <button @click="goBack" class="btn btn-ghost btn-sm btn-circle" :title="t('backToHome')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <div class="flex-1">
        <h1 class="text-lg font-bold">{{ siteName }}</h1>
        <p class="text-xs text-base-content/60">{{ siteDomain }}</p>
      </div>
    </div>

    <!-- 功能内容区域 - 由各网站具体操作页面填充 -->
    <div>
      <!-- 默认提示：这是一个模板框架 -->
      <div class="card bg-base-100 shadow-sm">
        <div class="card-body items-center text-center">
          <div class="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <span class="text-3xl">🧩</span>
          </div>
          <h3 class="card-title text-base">{{ t('actionTemplateTitle') }}</h3>
          <p class="text-sm text-base-content/70 mt-2" v-html="t('actionTemplateDesc')"></p>
          <div class="divider text-xs text-base-content/50">{{ t('examplePages') }}</div>
          <div class="space-y-2 w-full">
            <button class="btn btn-primary btn-sm w-full">
              <span class="mr-2">🌐</span> example.com {{ t('example') }}
            </button>
            <button class="btn btn-secondary btn-sm w-full">
              <span class="mr-2">🚀</span> another.com {{ t('example') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { ref, onMounted } from "vue"
import { t } from "~/utils/i18n"

const siteName = ref('网站名称')
const siteDomain = ref('domain.com')

onMounted(() => {
  // 从 URL 参数获取网站信息
  const urlParams = new URLSearchParams(window.location.search)
  const name = urlParams.get('name')
  const domain = urlParams.get('domain')
  
  if (name) siteName.value = name
  if (domain) siteDomain.value = domain
})

function goBack() {
  window.history.back()
}

// 获取设置信息
async function getSettings() {
  return new Promise<{ backendUrl: string; apiKey: string }>((resolve) => {
    chrome.storage.local.get(['backendUrl', 'apiKey'], (result) => {
      resolve({
        backendUrl: result.backendUrl as string || '',
        apiKey: result.apiKey as string || ''
      })
    })
  })
}

// 检查设置是否完整
async function checkSettings() {
  const settings = await getSettings()
  if (!settings.backendUrl || !settings.apiKey) {
    return {
      valid: false,
      message: t('settingsIncomplete')
    }
  }
  return { valid: true }
}

// 导出供子组件使用
defineExpose({
  siteName,
  siteDomain,
  getSettings,
  checkSettings
})
</script>
