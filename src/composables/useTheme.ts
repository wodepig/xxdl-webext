import { Storage } from "@plasmohq/storage"

const storage = new Storage()

/**
 * 将主题应用到 document 的 data-theme 属性
 * @param theme - 主题名称
 */
export function applyTheme(theme: string) {
  document.documentElement.setAttribute('data-theme', theme)
}

/**
 * 从 storage 加载并应用主题
 * 应在应用启动时调用
 */
export async function loadAndApplyTheme() {
  const theme = await storage.get('theme') || 'light'
  applyTheme(theme)
  return theme
}

/**
 * 保存主题到 storage 并应用
 * @param theme - 主题名称
 */
export async function saveTheme(theme: string) {
  await storage.set('theme', theme)
  applyTheme(theme)
}
