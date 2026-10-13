import type { PlasmoCSConfig } from "plasmo"
import {
  AUTO_LOGIN_MESSAGE_TYPE,
  AUTO_LOGIN_RESULT_TYPE,
  AUTO_LOGIN_ALLOWED_HOSTS,
  type AutoLoginParams
} from "../utils/auto-login"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
}

/**
 * 当前域名是否在自动登录白名单内
 */
function isAllowedHost(): boolean {
  return AUTO_LOGIN_ALLOWED_HOSTS.includes(location.hostname)
}

// 监听网页通过 window.postMessage 发起的自动登录请求
window.addEventListener("message", (event: MessageEvent) => {
  // 只接受本窗口发出的消息
  if (event.source !== window) return

  const data = event.data
  if (!data || typeof data !== "object" || data.type !== AUTO_LOGIN_MESSAGE_TYPE) return

  if (!isAllowedHost()) {
    console.warn("[xxdl] 当前域名不在自动登录白名单中，已忽略:", location.hostname)
    return
  }

  console.log("[xxdl] 收到网页自动登录请求:", data.payload)
  chrome.runtime.sendMessage({
    type: "AUTO_LOGIN_REQUEST",
    payload: data.payload as AutoLoginParams
  }).catch((error) => {
    console.warn("[xxdl] 转发自动登录请求失败:", error)
  })
})

// 监听来自 popup/扩展页面的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CLEAR_LOCAL_STORAGE') {
    try {
      localStorage.clear()
      sendResponse({ success: true, data: 'localStorage cleared' })
    } catch (error) {
      sendResponse({ success: false, error: error.message })
    }
    return true
  }

  if (request.type === 'CLEAR_SESSION_STORAGE') {
    try {
      sessionStorage.clear()
      sendResponse({ success: true, data: 'sessionStorage cleared' })
    } catch (error) {
      sendResponse({ success: false, error: error.message })
    }
    return true
  }

  if (request.type === 'GET_COOKIES') {
    try {
      // 通过 document.cookie 获取 cookie
      const cookieString = document.cookie
      // 返回原始 cookie 字符串，保留所有字符
      sendResponse({ success: true, data: cookieString })
    } catch (error) {
      sendResponse({ success: false, error: error.message })
    }
    return true
  }

  // 把自动登录执行结果转发给网页
  if (request.type === 'AUTO_LOGIN_RESULT') {
    console.log("[xxdl] 自动登录执行结果:", request.payload)
    window.postMessage({ type: AUTO_LOGIN_RESULT_TYPE, payload: request.payload }, "*")
    sendResponse({ success: true })
    return true
  }

  return true
})
