/**
 * Background Service Worker
 * 处理跨域 HTTP 请求代理
 */
// @ts-ignore
import { http, HttpResponse, HttpError } from "./utils/http"

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

/**
 * 监听来自其他页面的消息
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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
