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
          <h1 class="text-lg font-bold">Shein</h1>
          <p class="text-xs text-base-content/60">shein.com</p>
        </div>
      </div>
      <HeaderActions />
    </div>

    <!-- 内容区域 -->
    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h2 class="card-title">Shein 操作页面</h2>
        <p class="text-base-content/70">此页面正在开发中...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { onMounted } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import { loadAndApplyTheme } from "~/composables/useTheme"

onMounted(async () => {
  // 加载并应用主题
  await loadAndApplyTheme()
})

function goBack() {
  window.history.back()
}
</script>
