<template>
  <div class="w-[470px] min-h-[400px] bg-base-200">
    <!-- 动态加载项目组件 -->
    <component :is="currentComponent" v-if="currentComponent" />

    <!-- 加载中状态 -->
    <div v-else-if="loading" class="flex items-center justify-center min-h-[400px] p-4">
      <div class="text-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-base-content/70">正在加载...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="flex items-center justify-center min-h-[400px] p-4">
      <div class="text-center">
        <div class="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span class="text-3xl">⚠️</span>
        </div>
        <h3 class="text-lg font-bold">加载失败</h3>
        <p class="text-sm text-base-content/70 mt-2">无法找到对应的项目页面</p>
        <button @click="goBack" class="btn btn-primary btn-sm mt-4">
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from "vue"
import type { Component } from "vue"
// 静态导入所有项目组件
import Base from "./project/Base.vue"
import Xindao from "./project/xindao.vue"
import Example from "./project/example.vue"
import Shein from "./project/shein.vue"
import Bilibili from "./project/bilibili.vue"

/**
 * 项目页面动态加载组件
 * 根据 fileName 参数动态加载 project/ 目录下的对应组件
 */

/** 组件映射表 */
const componentMap: Record<string, Component> = {
  'Base': Base,
  'base': Base,
  'xindao': Xindao,
  'shein': Shein,
  'bilibili': Bilibili,
  'example': Example
}

/** 当前加载的组件 */
const currentComponent = shallowRef<Component | null>(null)
/** 加载状态 */
const loading = ref(true)

onMounted(async () => {
  console.log('[Project] 页面挂载，开始加载组件')
  console.log('[Project] 可用组件:', Object.keys(componentMap))

  // 获取 URL 参数
  const urlParams = new URLSearchParams(window.location.search)
  const fileName = urlParams.get('fileName') || 'Base'
  console.log('[Project] 目标组件文件名:', fileName)

  try {
    // 从映射表中获取组件
    console.log('[Project] 开始加载组件:', fileName)
    const component = loadProjectComponent(fileName)
    console.log('[Project] 组件加载成功:', fileName, component)
    currentComponent.value = component
  } catch (error) {
    console.error('[Project] 加载组件失败:', fileName, error)
    // 加载失败时尝试加载 Base 组件
    try {
      console.log('[Project] 尝试加载 Base 组件作为回退')
      const baseComponent = loadProjectComponent('Base')
      console.log('[Project] Base 组件加载成功')
      currentComponent.value = baseComponent
    } catch (baseError) {
      console.error('[Project] Base 组件也加载失败:', baseError)
      // Base 也加载失败，显示错误状态
      currentComponent.value = null
    }
  } finally {
    console.log('[Project] 加载完成，loading 设置为 false')
    loading.value = false
  }
})

/**
 * 获取项目组件
 * @param fileName - 组件文件名（不含扩展名）
 * @returns 组件
 */
function loadProjectComponent(fileName: string): Component {
  console.log('[Project] loadProjectComponent 被调用，文件名:', fileName)
  const component = componentMap[fileName]
  if (!component) {
    console.error('[Project] 未找到组件:', fileName, '可用组件:', Object.keys(componentMap))
    throw new Error(`未找到组件: ${fileName}`)
  }
  console.log('[Project] 组件找到:', fileName, component)
  return component
}

/**
 * 返回上一页
 */
function goBack() {
  window.history.back()
}
</script>
