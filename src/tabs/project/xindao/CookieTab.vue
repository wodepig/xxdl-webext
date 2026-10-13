<template>
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
      <svg v-if="!gettingCookie" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span v-if="gettingCookie" class="loading loading-spinner loading-xs"></span>
      {{ gettingCookie ? '获取中...' : '获取 Cookie 数据' }}
    </button>

    <!-- Cookie 数据预览区域（可折叠） -->
    <div v-if="modelValue" class="collapse collapse-arrow bg-base-200">
      <input type="checkbox" checked />
      <div class="collapse-title text-sm font-medium">
        Cookie 数据预览
      </div>
      <div class="collapse-content">
        <pre class="bg-base-300 p-3 rounded text-xs overflow-x-auto">{{ JSON.stringify(modelValue, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { getCookies, getCurrentTab } from "~/utils/common"
import { useXindaoToast } from "./toast"

/**
 * 分析云 Tab
 * 获取当前标签页 Cookie 并组装分析云数据，数据由父组件通过 v-model 持有
 */
defineProps<{
  /** 分析云数据 */
  modelValue: any
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const toast = useXindaoToast()

/** 是否正在获取 Cookie */
const gettingCookie = ref(false)

/**
 * 获取 Cookie 数据
 */
async function getCookieData() {
  try {
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

    emit('update:modelValue', {
      type: 'cookie',
      pageTitle: tab.title,
      path: tab.url,
      cookie: ck,
    })

    toast.show({ message: 'Cookie 数据获取成功', type: 'success' })
  } catch (error) {
    toast.show({ message: (error as Error).message, type: 'error' })
  } finally {
    gettingCookie.value = false
  }
}

// 暴露给父组件，供页面挂载时自动获取
defineExpose({ fetchCookieData: getCookieData })
</script>
