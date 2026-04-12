/**
 * HTTP 客户端（用于非 Background 页面）
 * 通过 chrome.runtime.sendMessage 调用 Background 的 HTTP 工具
 * 可以绕过 CORS 限制
 */
// @ts-ignore
import type { HttpResponse } from "./http"

/**
 * HTTP 请求选项
 */
interface HttpRequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  url: string
  body?: unknown
  headers?: Record<string, string>
}

/**
 * 发送 HTTP 请求（通过 Background 代理）
 * @param options - 请求选项
 * @returns HTTP 响应
 */
async function sendRequest<T>(options: HttpRequestOptions): Promise<HttpResponse<T>> {
  const response = await chrome.runtime.sendMessage({
    type: 'HTTP_REQUEST',
    ...options
  })

  if (!response.success) {
    throw new Error(response.error)
  }

  return response.data as HttpResponse<T>
}

/**
 * HTTP 客户端对象
 * 提供与 http.ts 相同的 API，但通过 Background 发送请求
 */
export const httpClient = {
  get<T>(url: string, headers?: Record<string, string>) {
    return sendRequest<T>({ method: 'GET', url, headers })
  },

  post<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return sendRequest<T>({ method: 'POST', url, body, headers })
  },

  put<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return sendRequest<T>({ method: 'PUT', url, body, headers })
  },

  patch<T>(url: string, body?: unknown, headers?: Record<string, string>) {
    return sendRequest<T>({ method: 'PATCH', url, body, headers })
  },

  delete<T>(url: string, headers?: Record<string, string>) {
    return sendRequest<T>({ method: 'DELETE', url, headers })
  }
}

// 默认导出
export default httpClient
