<template>
  <div class="p-4 w-[470px]">
    <!-- 头部区域 -->
     <button class="btn btn-primary btn-sm"  @click="checkCurrentPage">进入项目操作页面</button>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">🍪 {{ t('extensionName') }}</h1>
      <div class="flex gap-2">
        <a href="/tabs/settings.html" class="btn btn-ghost btn-sm" :title="t('settingsTitle')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </a>
        <a href="/tabs/about.html" class="btn btn-ghost btn-sm" :title="t('aboutTitle')">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </a>
      </div>
    </div>

    <!-- 欢迎信息区域 -->
    <div class="card bg-base-100 shadow-sm mb-4">
      <div class="card-body">
        <h2 class="card-title text-lg">{{ t('welcomeTitle') }}</h2>
        <p class="text-sm text-base-content/70">{{ t('welcomeDesc') }}</p>
      </div>
    </div>
    <!-- 当前页面状态提示 -->
    <div class="card shadow-sm  mb-4" :class="currentProject ? 'bg-success/10 border-success/30' : 'bg-warning/10 border-warning/30'">
      <div class="card-body">
        <div class="flex items-center gap-2 mb-2">
          <svg v-if="currentProject" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="font-medium" :class="currentProject ? 'text-success' : 'text-warning'">
            {{ currentProject ? t('statusSupportedSite') : t('statusUnsupportedSite') }}
          </span>
        </div>
        <p v-if="currentProject" class="text-sm text-base-content/70 mb-3">
          {{ t('siteDetected', currentProject.name) }}
        </p>
        <p v-else class="text-sm text-base-content/70">
          {{ t('siteNotSupported') }}
        </p>
        <button v-if="currentProject" @click="enterAction" class="btn btn-success btn-sm w-full">
          {{ t('enterAction') }}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Tab 标签页 -->
    <Tabs v-model="activeTab" :tabs="tabs" name="popup_tabs">
      <template #usage>
        <div class="space-y-3">
          <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/50">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-primary font-bold text-sm">1</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold">{{ t('step1Title') }}</h3>
              <p class="text-xs text-base-content/60">{{ t('step1Desc') }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/50">
            <div class="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <span class="text-secondary font-bold text-sm">2</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold">{{ t('step2Title') }}</h3>
              <p class="text-xs text-base-content/60">{{ t('step2Desc') }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/50">
            <div class="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
              <span class="text-accent font-bold text-sm">3</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold">{{ t('step3Title') }}</h3>
              <p class="text-xs text-base-content/60">{{ t('step3Desc') }}</p>
            </div>
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-base-200/50">
            <div class="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
              <span class="text-success font-bold text-sm">4</span>
            </div>
            <div>
              <h3 class="text-sm font-semibold">{{ t('step4Title') }}</h3>
              <p class="text-xs text-base-content/60">{{ t('step4Desc') }}</p>
            </div>
          </div>
        </div>
      </template>

      <template #sites>
        <div class="space-y-3">
          <div v-for="project in supportedSites" :key="project.id"
            class="flex items-center justify-between p-3 rounded-lg border"
            :class="currentProject?.id === project.id ? 'bg-success/5 border-success/30' : 'bg-primary/5 border-primary/20'">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="currentProject?.id === project.id ? 'bg-success/10' : 'bg-primary/10'">
                <span class="text-lg">🌐</span>
              </div>
              <div>
                <h3 class="text-sm font-semibold">{{ project.matchUrl[0] }}</h3>
                <p class="text-xs text-base-content/60">{{ project.name }}</p>
              </div>
            </div>
            <span class="badge badge-sm"
              :class="currentProject?.id === project.id ? 'badge-success' : 'badge-primary'">
              {{ currentProject?.id === project.id ? t('statusActive') : t('statusSupported') }}
            </span>
          </div>

          <div class="flex items-center justify-between p-3 rounded-lg bg-base-200/50 border border-dashed border-base-content/20">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg bg-base-300 flex items-center justify-center">
                <span class="text-lg opacity-50">🔒</span>
              </div>
              <div>
                <h3 class="text-sm font-semibold text-base-content/50">{{ t('moreSites') }}</h3>
                <p class="text-xs text-base-content/40">{{ t('comingSoon') }}</p>
              </div>
            </div>
            <span class="badge badge-ghost badge-sm">{{ t('statusPending') }}</span>
          </div>
        </div>
      </template>

      <template #tips>
        <div class="space-y-3">
          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="h-6 w-6 shrink-0 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="font-bold">{{ t('tipQuickStart') }}</h3>
              <div class="text-xs">{{ t('tipQuickStartDesc') }}</div>
            </div>
          </div>

          <div class="alert alert-warning">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 class="font-bold">{{ t('tipNotice') }}</h3>
              <div class="text-xs">{{ t('tipNoticeDesc') }}</div>
            </div>
          </div>

          <div class="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 class="font-bold">{{ t('tipSecurity') }}</h3>
              <div class="text-xs">{{ t('tipSecurityDesc') }}</div>
            </div>
          </div>
        </div>
      </template>
    </Tabs>

  </div>
</template>

<style>
:host {
  display: block;
  width: 470px;
  min-height: 400px;
}
</style>

<script setup lang="ts">
import "./style.css"
import { ref, onMounted, computed } from "vue"
import { t } from "~/utils/i18n"
import Tabs from "~/components/Tabs.vue"
import { supportedSites, getMatchedProject, type ProjectConf } from "~/utils/tab-utils"
import type { ProjectConf as ProjectConfType } from "~/types/project"

/** 当前匹配的项目 */
const currentProject = ref<ProjectConfType | null>(null)
const activeTab = ref('usage')

const tabs = computed(() => [
  { key: 'usage', label: t('tabUsage') },
  { key: 'sites', label: t('tabSites') },
  { key: 'tips', label: t('tabTips') }
])

onMounted(async () => {
  await checkCurrentPage()
})

/**
 * 检查当前页面是否匹配支持的项目
 * 如果匹配，直接跳转到项目页面
 */
async function checkCurrentPage() {
  console.log('checkCurrentPage')
  currentProject.value = await getMatchedProject()
  if (currentProject.value) {
    console.log('currentProject.value', currentProject.value)
    window.location.href = `/tabs/project/${currentProject.value.fileName}.html`
    console.log('跳转完毕');
    
  }
}

/**
 * 进入项目操作页面
 */
function enterAction() {
  if (currentProject.value) {
    window.location.href = `/tabs/project/${currentProject.value.fileName}.html`
  }
}
</script>
