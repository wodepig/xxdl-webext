<template>
  <div class="p-4 w-[470px] min-h-[400px] bg-base-200">
    <!-- 头部区域 -->
    <div class="flex items-center gap-3 mb-4">
      <button @click="goBack" class="btn btn-ghost btn-sm btn-circle" :title="t('backToHome')">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-lg font-bold">{{ t('aboutTitle') }}</h1>
    </div>

    <!-- 扩展信息卡片 -->
    <div class="card bg-base-100 shadow-sm mb-4">
      <div class="card-body items-center text-center">
        <div class="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 class="card-title text-xl">🍪 {{ t('extensionName') }}</h2>
        <div class="badge badge-primary mt-1">{{ t('version') }} 1.0.0</div>
      </div>
    </div>

    <!-- Tab 标签页：功能说明和使用帮助 -->
    <Tabs v-model="activeTab" :tabs="tabs" name="about_tabs" custom-class="mb-4">
      <template #features>
        <ul class="text-sm text-base-content/80 space-y-2">
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ t('featureCookie') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ t('featureLocalStorage') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ t('featureSessionStorage') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ t('featureSendToBackend') }}</span>
          </li>
          <li class="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-success mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{{ t('featureMultiSites') }}</span>
          </li>
        </ul>
      </template>

      <template #help>
        <div class="text-sm text-base-content/80 space-y-3">
          <div class="bg-base-200 p-3 rounded-lg">
            <p class="font-medium mb-1">{{ t('helpStep1Title') }}</p>
            <p class="text-xs text-base-content/60">{{ t('helpStep1Desc') }}</p>
          </div>
          <div class="bg-base-200 p-3 rounded-lg">
            <p class="font-medium mb-1">{{ t('helpStep2Title') }}</p>
            <p class="text-xs text-base-content/60">{{ t('helpStep2Desc') }}</p>
          </div>
          <div class="bg-base-200 p-3 rounded-lg">
            <p class="font-medium mb-1">{{ t('helpStep3Title') }}</p>
            <p class="text-xs text-base-content/60">{{ t('helpStep3Desc') }}</p>
          </div>
        </div>
      </template>
    </Tabs>

    <!-- 技术支持 -->
    <div class="card bg-base-100 shadow-sm">
      <div class="card-body">
        <h3 class="card-title text-base flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          {{ t('techSupport') }}
        </h3>
        <div class="text-sm text-base-content/70 mt-2 space-y-1">
          <p>{{ t('contactUs') }}</p>
          <div class="flex items-center gap-2 mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-xs">support@example.com</span>
          </div>
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <span class="text-xs">github.com/example/extension</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="text-center text-xs text-base-content/50 mt-6 pb-4">
      <p>{{ t('copyright') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { ref, computed } from "vue"
import { t } from "~/utils/i18n"
import Tabs from "~/components/Tabs.vue"

const activeTab = ref('features')

const tabs = computed(() => [
  { key: 'features', label: t('tabFeatures') },
  { key: 'help', label: t('tabHelp') }
])

function goBack() {
  window.history.back()
}
</script>
