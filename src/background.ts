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
 * 监听来自其他页面的 HTTP 请求消息
 * 通过 Background 发送请求可以绕过 CORS 限制
 */
chrome.runtime.onMessage.addListener((
  request: HttpRequestMessage,
  sender,
  sendResponse: (response: { success: true; data: HttpResponse<unknown> } | { success: false; error: string }) => void
) => {
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
})

/**
 * 导出 http 工具，供其他模块直接使用
 * 注意：只有 background 脚本内部使用才能绕过 CORS
 */
export { http, HttpError }
export type { HttpResponse }
export { http as default }
