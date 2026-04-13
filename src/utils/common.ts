// @ts-ignore
import type { Cookie } from "chrome"

/**
 * 获取当前活动标签页
 * @returns 当前活动标签页
 * @throws 如果标签页为空则抛出错误
 */
export async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) {
    throw new Error("标签页为空")
  }
  return tab
}

/**
 * 从当前标签页的 localStorage 中获取指定 key 的值
 * @param key - localStorage 的 key
 * @returns 对应的值，如果不存在返回 null
 */
export async function getLocalStorage(key: string): Promise<string | null> {
  console.log('[common] 从 localStorage 获取:', key)

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'GET_LOCAL_STORAGE',
    tabId: tab.id!,
    key
  })

  if (!response.success) {
    throw new Error(`获取 localStorage 键 ${key} 失败: ${response.error}`)
  }

  console.log('[common] localStorage 获取结果:', key, response.data)
  return response.data
}

/**
 * 获取当前标签页 localStorage 的所有内容
 * @returns localStorage 的所有键值对
 */
export async function getAllLocalStorage(): Promise<Record<string, string>> {
  console.log('[common] 获取所有 localStorage')

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'GET_ALL_LOCAL_STORAGE',
    tabId: tab.id!
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  console.log('[common] 所有 localStorage:', response.data)
  return response.data
}

/**
 * 在当前标签页的 localStorage 中设置值
 * @param key - localStorage 的 key
 * @param value - 要设置的值
 */
export async function setLocalStorage(key: string, value: string): Promise<void> {
  console.log('[common] 设置 localStorage:', key, value)

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'SET_LOCAL_STORAGE',
    tabId: tab.id!,
    key,
    value
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  console.log('[common] localStorage 设置成功:', key)
}

/**
 * 从当前标签页的 sessionStorage 中获取指定 key 的值
 * @param key - sessionStorage 的 key
 * @returns 对应的值，如果不存在返回 null
 */
export async function getSessionStorage(key: string): Promise<string | null> {
  console.log('[common] 从 sessionStorage 获取:', key)

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'GET_SESSION_STORAGE',
    tabId: tab.id!,
    key
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  console.log('[common] sessionStorage 获取结果:', key, response.data)
  return response.data
}

/**
 * 获取当前标签页 sessionStorage 的所有内容
 * @returns sessionStorage 的所有键值对
 */
export async function getAllSessionStorage(): Promise<Record<string, string>> {
  console.log('[common] 获取所有 sessionStorage')

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'GET_ALL_SESSION_STORAGE',
    tabId: tab.id!
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  console.log('[common] 所有 sessionStorage:', response.data)
  return response.data
}

/**
 * 在当前标签页的 sessionStorage 中设置值
 * @param key - sessionStorage 的 key
 * @param value - 要设置的值
 */
export async function setSessionStorage(key: string, value: string): Promise<void> {
  console.log('[common] 设置 sessionStorage:', key, value)

  const tab = await getCurrentTab()

  const response = await chrome.runtime.sendMessage({
    type: 'SET_SESSION_STORAGE',
    tabId: tab.id!,
    key,
    value
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  console.log('[common] sessionStorage 设置成功:', key)
}

/**
 * 获取当前标签页的所有 Cookie
 * @returns Cookie 数组
 */
export async function getCookies(): Promise<Cookie[]> {
  console.log('[common] 获取当前标签页 cookies')

  const tab = await getCurrentTab()

  if (!tab.url) {
    throw new Error("标签页 URL 为空")
  }

  try {
    const cookies = await chrome.cookies.getAll({ url: tab.url })
    console.log('[common] 当前标签页 cookies:', cookies)
    return cookies
  } catch (error) {
    console.error('[common] 获取 cookies 失败:', error)
    throw error
  }
}

/**
 * 获取指定名称的 Cookie
 * @param name - Cookie 名称
 * @returns Cookie 对象，如果不存在则返回 null
 */
export async function getCookieByName(name: string): Promise<Cookie | null> {
  const cookies = await getCookies()
  return cookies.find(cookie => cookie.name === name) || null
}

/**
 * 获取指定域名的所有 Cookie
 * @param domain - 域名
 * @returns Cookie 数组
 */
export async function getCookiesByDomain(domain: string): Promise<Cookie[]> {
  console.log('[common] 获取域名 cookies:', domain)

  try {
    const cookies = await chrome.cookies.getAll({ domain })
    console.log('[common] 域名 cookies:', cookies)
    return cookies
  } catch (error) {
    console.error('[common] 获取域名 cookies 失败:', error)
    throw error
  }
}
