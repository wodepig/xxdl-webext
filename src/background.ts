/**
 * Background Service Worker
 * 处理跨域 HTTP 请求代理
 */
// @ts-ignore
import { http, HttpResponse, HttpError } from "./utils/http"

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
