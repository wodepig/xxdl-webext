import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: false
}

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
      // const cookies = cookieString.split(';').filter(s => s.trim()).map(cookie => {
      //   const [name, ...valueParts] = cookie.trim().split('=')
      //   return {
      //     name: name.trim(),
      //     value: valueParts.join('=').trim(),
      //     domain: window.location.hostname
      //   }
      // })
      sendResponse({ success: true, data: cookieString })
    } catch (error) {
      sendResponse({ success: false, error: error.message })
    }
    return true
  }

  return true
})
