<template>
  <!-- Toast 提示组件 - 居中显示在屏幕中间 -->
  <div v-if="state.show" class="toast toast-center toast-middle">
    <!-- 根据类型显示不同颜色的提示框 -->
    <div class="alert" :class="alertClass">
      <span>{{ state.message }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue"

/**
 * Toast 提示选项
 */
export interface ToastOptions {
  /** 提示消息内容 */
  message: string
  /** 
   * 提示类型
   * - info: 信息（蓝色）
   * - success: 成功（绿色）
   * - warning: 警告（黄色/橙色）
   * - error: 错误（红色）
   */
  type?: "info" | "success" | "warning" | "error"
  /** 显示时长（毫秒），默认 3000ms */
  duration?: number
}

// 内部状态
const state = reactive({
  show: false,
  message: "",
  type: "info" as ToastOptions["type"],
})

// 定时器 ID
let timeoutId: ReturnType<typeof setTimeout> | null = null

/**
 * 根据类型计算 alert 的 CSS 类名
 * DaisyUI 的 alert 类：alert-info, alert-success, alert-warning, alert-error
 */
const alertClass = computed(() => {
  const type = state.type || "info"
  return `alert-${type}`
})

/**
 * 显示 Toast 提示
 * @param options - Toast 配置选项
 * 
 * @example
 * ```typescript
 * // 显示成功提示
 * toastRef.value?.show({ message: '保存成功', type: 'success' })
 * 
 * // 显示错误提示，持续5秒
 * toastRef.value?.show({ message: '保存失败', type: 'error', duration: 5000 })
 * ```
 */
function show(options: ToastOptions) {
  const { message, type = "info", duration = 3000 } = options

  // 清除之前的定时器，避免多个提示冲突
  if (timeoutId) clearTimeout(timeoutId)

  // 设置状态
  state.show = true
  state.message = message
  state.type = type

  // 自动隐藏
  timeoutId = setTimeout(() => {
    state.show = false
  }, duration)
}

/**
 * 手动隐藏 Toast 提示
 */
function hide() {
  if (timeoutId) clearTimeout(timeoutId)
  state.show = false
}

// 暴露方法给父组件
defineExpose({ show, hide })
</script>
