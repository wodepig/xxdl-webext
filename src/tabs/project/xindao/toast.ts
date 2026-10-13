/**
 * 新道云各 Tab 的 Toast 注入约定
 * Toast 实例由 index.vue 统一持有，子 Tab 通过 inject 获取，避免每个 Tab 各挂一个 Toast
 */
import { inject, type InjectionKey } from "vue"

/** Toast 提示选项（与 components/Toast.vue 的 ToastOptions 保持一致） */
export interface XindaoToastOptions {
  /** 提示消息内容 */
  message: string
  /** 提示类型：info | success | warning | error */
  type?: "info" | "success" | "warning" | "error"
  /** 显示时长（毫秒） */
  duration?: number
}

/** Toast 调用接口 */
export interface XindaoToast {
  show: (options: XindaoToastOptions) => void
}

/** 注入 key */
export const XINDAO_TOAST_KEY: InjectionKey<XindaoToast> = Symbol("xindao-toast")

/**
 * 获取父组件提供的 Toast
 * @returns Toast 调用对象；父组件未提供时为空实现，调用不会报错
 */
export function useXindaoToast(): XindaoToast {
  return inject(XINDAO_TOAST_KEY, { show: () => {} })
}
