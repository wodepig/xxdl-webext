/**
 * Background Service Worker
 * 处理跨域 HTTP 请求代理
 */
// @ts-ignore
import { http, HttpResponse, HttpError } from "./utils/http"
import {
  PENDING_AUTO_LOGIN_KEY,
  AUTO_LOGIN_SOURCE_TAB_KEY,
  PROJECT_PAGE_PATH,
  type AutoLoginParams,
  type AutoLoginResultPayload
} from "./utils/auto-login"

/**
 * 获取当前标签页
 * @returns 当前标签页对象
 */
async function getCurrentTab(): Promise<chrome.tabs.Tab> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  if (!tab) {
    throw new Error("无法获取当前标签页")
  }
  return tab
}

/**
 * 获取当前标签页的所有 Cookie
 * 使用 chrome.cookies API 获取所有 cookie（包括 HttpOnly）
 * @returns Cookie 数组
 */
async function getCookies(): Promise<Array<{ name: string; value: string; domain?: string; httpOnly?: boolean; secure?: boolean; sameSite?: string }>> {
  const tab = await getCurrentTab()

  if (!tab.url) {
    throw new Error("标签页 URL 为空")
  }

  try {
    const url = new URL(tab.url)
    const hostname = url.hostname
    const parentDomain = hostname.split('.').slice(-2).join('.')

    // 获取当前页面相关的所有 cookie
    const [urlCookies, domainCookies, exactDomainCookies] = await Promise.all([
      chrome.cookies.getAll({ url: tab.url }),
      chrome.cookies.getAll({ domain: parentDomain }),
      chrome.cookies.getAll({ domain: hostname })
    ])

    // 合并并去重
    const cookieMap = new Map()
    ;[...urlCookies, ...domainCookies, ...exactDomainCookies].forEach(cookie => {
      cookieMap.set(`${cookie.name}@${cookie.domain}`, cookie)
    })

    const cookies = Array.from(cookieMap.values())

    // 返回简化的 cookie 信息
    return cookies.map(cookie => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite
    }))
  } catch (error) {
    console.error('[background] 获取 cookies 失败:', error)
    throw error
  }
}

/**
 * HTTP 请求消息类型
 */
interface HttpRequestMessage {
  type: 'HTTP_REQUEST'
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  body?: unknown
  headers?: Record<string, string>
}

/** 自动登录悬浮窗口尺寸 */
const AUTO_LOGIN_WINDOW_WIDTH = 500
const AUTO_LOGIN_WINDOW_HEIGHT = 680

/**
 * 计算悬浮窗口位置：贴在当前浏览器窗口右上角
 * @param createData - 窗口创建参数，会被就地修改
 */
async function applyFloatingPosition(createData: chrome.windows.CreateData): Promise<void> {
  try {
    const current = await chrome.windows.getLastFocused()
    if (current.left !== undefined && current.top !== undefined && current.width !== undefined) {
      createData.left = Math.max(0, current.left + current.width - AUTO_LOGIN_WINDOW_WIDTH - 24)
      createData.top = Math.max(0, current.top + 24)
    }
  } catch (error) {
    console.warn('[background] 计算悬浮窗口位置失败，使用默认位置:', error)
  }
}

/**
 * 通知操作页重新读取待执行参数
 * @param tabId - 操作页标签页 ID
 */
function notifyAutoLoginParams(tabId: number) {
  chrome.tabs.sendMessage(tabId, { type: 'AUTO_LOGIN_PARAMS' }).catch(() => {
    // 页面监听尚未挂载时忽略，页面挂载后会自行读取
  })
}

/**
 * 打开或激活自动登录悬浮窗口
 * 已是悬浮窗口则复用；若操作页开在普通标签页里，则迁移成悬浮窗口，不再留标签页
 */
async function openAutoLoginPage(): Promise<void> {
  const pageUrl = chrome.runtime.getURL(PROJECT_PAGE_PATH)
  const allTabs = await chrome.tabs.query({})
  const existing = allTabs.find(tab => tab.url?.startsWith(pageUrl))

  if (existing?.id !== undefined && existing.windowId !== undefined) {
    const win = await chrome.windows.get(existing.windowId).catch(() => null)

    // 已经是悬浮窗口：直接聚焦并刷新参数
    if (win?.type === 'popup') {
      console.log('[background] 复用已存在的悬浮窗口:', existing.id)
      await chrome.tabs.update(existing.id, { active: true })
      await chrome.windows.update(existing.windowId, { focused: true })
      notifyAutoLoginParams(existing.id)
      return
    }

    // 开在普通标签页里：迁移为悬浮窗口，而不是激活标签页
    console.log('[background] 将标签页迁移为悬浮窗口:', existing.id, ', 窗口类型 =', win?.type)
    const migrateData: chrome.windows.CreateData = {
      tabId: existing.id,
      type: 'popup',
      width: AUTO_LOGIN_WINDOW_WIDTH,
      height: AUTO_LOGIN_WINDOW_HEIGHT,
      focused: true
    }
    await applyFloatingPosition(migrateData)
    try {
      await chrome.windows.create(migrateData)
      notifyAutoLoginParams(existing.id)
      return
    } catch (error) {
      console.warn('[background] 迁移为悬浮窗口失败，改为新建:', error)
    }
  }

  // 不存在则新建悬浮窗口
  const url = `${pageUrl}?fileName=xindao&tab=login`
  const createData: chrome.windows.CreateData = {
    url,
    type: 'popup',
    width: AUTO_LOGIN_WINDOW_WIDTH,
    height: AUTO_LOGIN_WINDOW_HEIGHT,
    focused: true
  }
  await applyFloatingPosition(createData)
  console.log('[background] 打开自动登录悬浮窗口:', createData)
  await chrome.windows.create(createData)
}

/**
 * 把自动登录执行结果回传给发起请求的网页
 * @param payload - 执行结果
 */
async function forwardAutoLoginResult(payload: AutoLoginResultPayload): Promise<void> {
  const stored = await chrome.storage.local.get(AUTO_LOGIN_SOURCE_TAB_KEY)
  const tabId = stored[AUTO_LOGIN_SOURCE_TAB_KEY] as number | undefined

  // 结果只回传一次，避免手动执行时误发给上一次的网页
  await chrome.storage.local.remove(AUTO_LOGIN_SOURCE_TAB_KEY)

  if (tabId === undefined) {
    console.log('[background] 无请求来源标签页，跳过结果回传')
    return
  }

  try {
    await chrome.tabs.sendMessage(tabId, { type: 'AUTO_LOGIN_RESULT', payload })
    console.log('[background] 执行结果已回传:', tabId, payload)
  } catch (error) {
    console.warn('[background] 结果回传失败(网页可能已关闭):', error)
  }
}

/**
 * 监听来自其他页面的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 网页触发自动登录
  if (request.type === 'AUTO_LOGIN_REQUEST') {
    const payload = request.payload as AutoLoginParams
    const sourceTabId = sender.tab?.id
    console.log('[background] 收到自动登录请求, 来源标签页:', sourceTabId, payload)

    chrome.storage.local
      .set({
        [PENDING_AUTO_LOGIN_KEY]: payload,
        [AUTO_LOGIN_SOURCE_TAB_KEY]: sourceTabId
      })
      .then(() => openAutoLoginPage())
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true
  }

  // 操作页回传执行结果
  if (request.type === 'AUTO_LOGIN_RESULT') {
    forwardAutoLoginResult(request.payload as AutoLoginResultPayload)
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    return true
  }

  // 获取 Cookies（通过 background 脚本）
  if (request.type === 'GET_COOKIES_BG') {
    getCookies()
      .then(cookies => {
        sendResponse({ success: true, data: cookies })
      })
      .catch(error => {
        sendResponse({ success: false, error: error.message })
      })
    return true
  }

  // HTTP 请求代理
  if (request.type === 'HTTP_REQUEST') {
    const { method, url, body, headers } = request

    // 调用 http 工具发送请求
    const httpMethod = method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete'
    const httpFn = body
      ? http[httpMethod]<unknown>(url, body, headers)
      : http[httpMethod]<unknown>(url, headers)

    httpFn
      .then(result => {
        sendResponse({ success: true, data: result })
      })
      .catch((error: HttpError | Error) => {
        sendResponse({
          success: false,
          error: error instanceof HttpError ? error.message : error.message || 'Unknown error'
        })
      })

    // 返回 true 表示异步响应
    return true
  }

  // 获取 localStorage
  if (request.type === 'GET_LOCAL_STORAGE') {
    const { tabId, key } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: (k) => localStorage.getItem(k),
      args: [key]
    }).then(results => {
      sendResponse({ success: true, data: results[0]?.result })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }

  // 获取所有 localStorage
  if (request.type === 'GET_ALL_LOCAL_STORAGE') {
    const { tabId } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const data: Record<string, string> = {}
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key) {
            data[key] = localStorage.getItem(key) || ''
          }
        }
        return data
      }
    }).then(results => {
      sendResponse({ success: true, data: results[0]?.result })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }

  // 设置 localStorage
  if (request.type === 'SET_LOCAL_STORAGE') {
    const { tabId, key, value } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: (k, v) => localStorage.setItem(k, v),
      args: [key, value]
    }).then(() => {
      sendResponse({ success: true })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }

  // 获取 sessionStorage
  if (request.type === 'GET_SESSION_STORAGE') {
    const { tabId, key } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: (k) => sessionStorage.getItem(k),
      args: [key]
    }).then(results => {
      sendResponse({ success: true, data: results[0]?.result })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }

  // 获取所有 sessionStorage
  if (request.type === 'GET_ALL_SESSION_STORAGE') {
    const { tabId } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        const data: Record<string, string> = {}
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i)
          if (key) {
            data[key] = sessionStorage.getItem(key) || ''
          }
        }
        return data
      }
    }).then(results => {
      sendResponse({ success: true, data: results[0]?.result })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }

  // 设置 sessionStorage
  if (request.type === 'SET_SESSION_STORAGE') {
    const { tabId, key, value } = request
    chrome.scripting.executeScript({
      target: { tabId },
      func: (k, v) => sessionStorage.setItem(k, v),
      args: [key, value]
    }).then(() => {
      sendResponse({ success: true })
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
    return true
  }
})

/**
 * 导出 http 工具，供其他模块直接使用
 * 注意：只有 background 脚本内部使用才能绕过 CORS
 */
export { http, HttpError }
export type { HttpResponse }
export { http as default }
