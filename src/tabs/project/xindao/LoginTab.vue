<template>
  <div class="bg-base-100 border border-base-300 p-4 rounded-box">
    <div class="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20 mb-4">
      <div class="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
        <span class="text-xl">🔑</span>
      </div>
      <div class="flex-1">
        <h3 class="text-sm font-semibold mb-1">自动登录</h3>
        <p class="text-xs text-base-content/60">打开网址并自动填充账号密码</p>
      </div>
    </div>

    <div class="space-y-3">
      <!-- 目标地址：主机 + 路径 -->
      <div class="grid grid-cols-2 gap-2">
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text text-xs">主机</span>
            <span class="label-text-alt flex items-center gap-1">
              <button type="button" class="btn btn-xs px-2" title="使用 http 协议"
                :class="hostProtocol === 'http' ? 'btn-primary' : 'btn-ghost'"
                @click="switchProtocol('http')">http</button>
              <button type="button" class="btn btn-xs px-2" title="使用 https 协议"
                :class="hostProtocol === 'https' ? 'btn-primary' : 'btn-ghost'"
                @click="switchProtocol('https')">https</button>
            </span>
          </label>
          <input v-model="loginForm.host" type="text" placeholder="https://edu.seentao.com"
            class="input input-bordered input-sm w-full" />
        </div>
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text text-xs">路径</span>
          </label>
          <input v-model="loginForm.path" type="text" placeholder="/runner_web/login"
            class="input input-bordered input-sm w-full" />
        </div>
      </div>

      <!-- 元素 id -->
      <div class="grid grid-cols-2 gap-2">
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text text-xs">用户名元素 id</span>
          </label>
          <input v-model="loginForm.usernameId" type="text" placeholder="username"
            class="input input-bordered input-sm w-full" />
        </div>
        <div class="form-control">
          <label class="label py-1">
            <span class="label-text text-xs">密码元素 id</span>
          </label>
          <input v-model="loginForm.passwordId" type="text" placeholder="password"
            class="input input-bordered input-sm w-full" />
        </div>
      </div>
      <p class="text-xs text-base-content/50 -mt-1">
        留空则自动查找页面中的用户名/密码输入框，也可填 #id 或 CSS 选择器
      </p>

      <!-- 账号 -->
      <div class="form-control">
        <label class="label py-1">
          <span class="label-text text-xs">账号</span>
        </label>
        <input v-model="loginForm.username" type="text" placeholder="请输入账号"
          class="input input-bordered input-sm w-full" />
      </div>

      <!-- 密码 -->
      <div class="form-control">
        <label class="label py-1">
          <span class="label-text text-xs">密码</span>
        </label>
        <div class="relative">
          <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" placeholder="请输入密码"
            class="input input-bordered input-sm w-full pr-10" />
          <button type="button" @click="showLoginPassword = !showLoginPassword"
            class="absolute right-1 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs btn-circle" title="显示/隐藏密码">
            <svg v-if="!showLoginPassword" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          </button>
        </div>
      </div>

      <!-- 无痕 -->
      <label class="label cursor-pointer justify-start gap-2 py-1">
        <input v-model="loginForm.incognito" type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
        <span class="label-text text-xs">使用无痕窗口打开</span>
      </label>
      <p v-if="loginForm.incognito" class="text-xs text-base-content/50 -mt-1">
        需先在扩展详情页开启「在无痕模式下启用」，否则无法创建无痕窗口
      </p>

      <!-- 确定 -->
      <button @click="autoLogin" :disabled="logging" class="btn btn-primary btn-sm w-full">
        <svg v-if="!logging" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <span v-if="logging" class="loading loading-spinner loading-xs"></span>
        {{ logging ? '执行中...' : '确定' }}
      </button>

      <!-- 执行日志：固定单行，超出横向滚动并自动滚到最新 -->
      <div v-if="loginStatus" ref="loginLogRef"
        class="rounded-box border px-3 py-2 text-xs whitespace-nowrap overflow-x-auto"
        :class="loginStatusType === 'error' ? 'border-error/40 text-error' : loginStatusType === 'success' ? 'border-success/40 text-success' : 'border-info/40 text-info'">
        {{ loginStatus }}
      </div>

      <!-- 目标页面在后台打开，需要时手动切换过去 -->
      <template v-if="lastLoginTabId !== null">
        <button @click="focusLoginTab" class="btn btn-outline btn-sm w-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          切换到目标页面
        </button>
        <p class="text-xs text-base-content/50">
          目标页面在后台打开，不会中断当前窗口；点击上方按钮可切换过去
        </p>
      </template>
    </div>

    <!-- 前端调用方式 -->
    <div class="collapse collapse-arrow bg-base-200 mt-3">
      <input type="checkbox" />
      <div class="collapse-title text-sm font-medium">前端调用方式</div>
      <div class="collapse-content space-y-2">
        <p class="text-xs text-base-content/70">
          在白名单域名（见 <code class="font-mono">utils/auto-login.ts</code>）的页面中执行：
        </p>
        <pre class="bg-base-300 p-3 rounded text-xs overflow-x-auto">{{ callExample }}</pre>
        <p class="text-xs text-base-content/70">参数说明：</p>
        <ul class="text-xs text-base-content/70 space-y-1">
          <li><code class="font-mono text-primary">host</code>：目标主机，<span class="text-warning">必须带 http:// 或 https://</span>；<code class="font-mono text-primary">path</code>：目标路径</li>
          <li><code class="font-mono text-primary">username</code> / <code class="font-mono text-primary">password</code>：账号与密码</li>
          <li><code class="font-mono text-primary">usernameId</code> / <code class="font-mono text-primary">passwordId</code>：输入框元素 id，留空自动查找</li>
          <li><code class="font-mono text-primary">incognito</code>：是否用无痕窗口打开，默认 false</li>
          <li><code class="font-mono text-primary">autoConfirm</code>：是否自动点击确定，默认 false（只回填参数）</li>
        </ul>
        <p class="text-xs text-base-content/70">
          可选：监听 <code class="font-mono text-primary">XXDL_SEENTAO_AUTO_LOGIN_RESULT</code> 获取执行结果（success / message）。
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted, onUnmounted } from "vue"
import { PENDING_AUTO_LOGIN_KEY, type AutoLoginParams } from "~/utils/auto-login"

/**
 * 自动登录 Tab
 * 打开目标网址（可选无痕窗口）并自动填充账号密码
 */

/** 注入脚本入参 */
interface FillLoginPayload {
  usernameId: string
  passwordId: string
  username: string
  password: string
}

/** 注入脚本执行结果 */
interface FillLoginResult {
  userFound: boolean
  pwdFound: boolean
}

/** 打开页面后的目标信息 */
interface LoginTarget {
  /** 标签页 ID */
  tabId: number
  /** 窗口 ID（无痕窗口时用于重新聚焦） */
  windowId?: number
}

/** 自动登录表单 */
const loginForm = reactive({
  /** 目标主机（含协议，如 https://edu.seentao.com） */
  host: 'https://edu.seentao.com',
  /** 目标路径（如 /runner_web/login） */
  path: '/runner_web/login',
  /** 账号 */
  username: '123456',
  /** 密码 */
  password: '123456',
  /** 用户名输入框元素 id（支持 #id 或 CSS 选择器，留空则自动查找） */
  usernameId: '#userName',
  /** 密码输入框元素 id（支持 #id 或 CSS 选择器，留空则自动查找） */
  passwordId: '#password',
  /** 是否使用无痕窗口打开 */
  incognito: false
})

/** 前端调用示例（展示在折叠面板中） */
const callExample = `window.postMessage({
  type: 'XXDL_SEENTAO_AUTO_LOGIN',
  payload: {
    host: 'https://edu.seentao.com',
    path: '/runner_web/login',
    username: 'zhangsan',
    password: '123456',
    usernameId: '#userName',
    passwordId: '#password',
    incognito: false,
    autoConfirm: true
  }
}, '*')`

/** 是否正在执行自动登录 */
const logging = ref(false)
/** 是否明文显示密码 */
const showLoginPassword = ref(false)
/** 执行结果提示（界面单行日志） */
const loginStatus = ref('')
/** 执行结果类型：success | error | info */
const loginStatusType = ref<'success' | 'error' | 'info'>('info')
/** 单行日志 DOM 引用（内容超出时自动滚动到最新） */
const loginLogRef = ref<HTMLElement | null>(null)
/** 最近一次自动登录打开的目标标签页 ID */
const lastLoginTabId = ref<number | null>(null)
/** 最近一次自动登录打开的目标窗口 ID（无痕窗口） */
const lastLoginWindowId = ref<number | null>(null)

/** 是否由网页调用触发（决定是否把结果回传网页） */
const invokedFromWeb = ref(false)

// 挂载后读取网页传入的参数，并监听 background 的通知
onMounted(() => {
  chrome.runtime.onMessage.addListener(handleRuntimeMessage)
  consumePendingAutoLogin()
})

onUnmounted(() => {
  chrome.runtime.onMessage.removeListener(handleRuntimeMessage)
})

/**
 * 监听扩展内部消息（background 通知读取参数）
 * @param request - 消息体
 */
function handleRuntimeMessage(request: any) {
  if (request?.type === 'AUTO_LOGIN_PARAMS') {
    console.log('[自动登录] 收到 background 通知，重新读取参数')
    consumePendingAutoLogin()
  }
}

/**
 * 读取并消费 background 暂存的自动登录参数
 */
async function consumePendingAutoLogin() {
  const stored = await chrome.storage.local.get(PENDING_AUTO_LOGIN_KEY)
  const params = stored[PENDING_AUTO_LOGIN_KEY] as AutoLoginParams | undefined
  if (!params) return

  // 立即清除，避免刷新页面时重复执行
  await chrome.storage.local.remove(PENDING_AUTO_LOGIN_KEY)
  await applyAutoLoginParams(params)
}

/**
 * 用网页传入的参数回填表单并展示，按需自动执行
 * @param params - 网页传入的自动登录参数
 */
async function applyAutoLoginParams(params: AutoLoginParams) {
  console.log('[自动登录] 应用网页传入的参数:', params)

  if (typeof params.host === 'string') loginForm.host = params.host
  if (typeof params.path === 'string') loginForm.path = params.path
  if (typeof params.username === 'string') loginForm.username = params.username
  if (typeof params.password === 'string') loginForm.password = params.password
  if (typeof params.usernameId === 'string') loginForm.usernameId = params.usernameId
  if (typeof params.passwordId === 'string') loginForm.passwordId = params.passwordId
  if (typeof params.incognito === 'boolean') loginForm.incognito = params.incognito

  invokedFromWeb.value = true

  if (params.autoConfirm) {
    setLoginStatus('已接收网页参数，自动执行中...')
    // 稍等片刻，让表单先渲染出来
    await sleep(300)
    autoLogin()
  } else {
    setLoginStatus('已载入网页传入的参数，点击「确定」开始执行')
  }
}

/**
 * 把执行结果回传给发起请求的网页
 * @param success - 是否成功
 * @param message - 结果说明
 */
async function reportResult(success: boolean, message: string) {
  if (!invokedFromWeb.value) return
  try {
    await chrome.runtime.sendMessage({ type: 'AUTO_LOGIN_RESULT', payload: { success, message } })
    console.log('[自动登录] 结果已回传:', success, message)
  } catch (error) {
    console.warn('[自动登录] 结果回传失败:', error)
  }
}

/**
 * 更新界面单行日志：同时打印到扩展控制台，并在内容超出时自动滚动到最新
 * @param message - 日志内容
 * @param type - 日志类型，决定颜色
 */
function setLoginStatus(message: string, type: 'success' | 'error' | 'info' = 'info') {
  loginStatus.value = message
  loginStatusType.value = type
  console.log('[自动登录]', message)
  nextTick(() => {
    const el = loginLogRef.value
    if (el) {
      el.scrollLeft = el.scrollWidth
    }
  })
}

/**
 * 延时等待
 * @param ms - 毫秒
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/** 主机当前协议：http / https，未填写协议时为空串 */
const hostProtocol = computed(() => {
  const matched = loginForm.host.trim().match(/^(https?):\/\//i)
  return matched ? matched[1].toLowerCase() : ''
})

/**
 * 切换主机协议（只改前缀，不动主机与端口）
 * @param protocol - http 或 https
 */
function switchProtocol(protocol: 'http' | 'https') {
  const rest = loginForm.host.trim().replace(/^https?:\/\//i, '')
  loginForm.host = `${protocol}://${rest}`
}

/**
 * 拼接主机与路径
 * 主机必须显式带上 http:// 或 https://，不做默认协议补全
 * @param host - 主机（必须含协议，可含端口）
 * @param path - 路径（可不带前导 /）
 * @returns 规范化后的完整网址
 */
function buildTargetUrl(host: string, path: string): string {
  const base = (host || '').trim()
  if (!base) {
    throw new Error('请输入主机地址')
  }
  if (!/^https?:\/\//i.test(base)) {
    throw new Error('主机地址需以 http:// 或 https:// 开头')
  }

  let suffix = (path || '').trim()
  if (suffix && !suffix.startsWith('/')) {
    suffix = '/' + suffix
  }

  const url = base.replace(/\/+$/, '') + suffix
  try {
    new URL(url)
  } catch {
    throw new Error('网址格式不正确')
  }
  return url
}

/**
 * 打开目标网址
 * 注意：始终以「后台」方式打开，不抢占焦点
 * 扩展操作页可能运行在 action popup 中，一旦焦点被抢走，弹窗会立即被浏览器销毁
 * @param url - 目标网址
 * @param incognito - 是否使用无痕窗口
 * @returns 新标签页 ID 与所属窗口 ID
 */
async function openLoginTab(url: string, incognito: boolean): Promise<LoginTarget> {
  // 普通标签页
  if (!incognito) {
    console.log('[自动登录] 后台打开标签页:', url)
    const tab = await chrome.tabs.create({ url, active: false })
    if (!tab.id) {
      throw new Error('创建标签页失败')
    }
    console.log('[自动登录] 标签页已创建: tabId =', tab.id, ', windowId =', tab.windowId)
    return { tabId: tab.id, windowId: tab.windowId }
  }

  // 无痕窗口
  return openIncognitoTab(url)
}

/**
 * 在无痕窗口中打开目标网址
 * 注意：MV3 下 chrome.windows.create 的返回值可能为 null，不能依赖它
 * 因此这里用「窗口列表差集」定位新建的无痕窗口
 * @param url - 目标网址
 * @returns 新标签页 ID 与无痕窗口 ID
 */
async function openIncognitoTab(url: string): Promise<LoginTarget> {
  // 先确认扩展是否被允许在无痕模式下运行，避免创建失败后无从判断原因
  let allowed = true
  try {
    allowed = await chrome.extension.isAllowedIncognitoAccess()
  } catch (error) {
    console.warn('[自动登录] 无法检测无痕权限:', error)
  }
  console.log('[自动登录] 扩展无痕权限:', allowed)
  if (!allowed) {
    throw new Error('扩展未开启「在无痕模式下启用」，请在扩展详情页开启后重试')
  }

  // 记录创建前的无痕窗口，便于稍后定位新窗口
  const before = await chrome.windows.getAll({ populate: false })
  const beforeIds = before.filter(w => w.incognito && w.id !== undefined).map(w => w.id as number)

  console.log('[自动登录] 后台打开无痕窗口:', url)
  try {
    const created = await chrome.windows.create({ url, incognito: true, focused: false })
    const createdTabId = created?.tabs?.[0]?.id
    if (created?.id !== undefined && createdTabId) {
      console.log('[自动登录] 无痕窗口已创建(直接返回): tabId =', createdTabId, ', windowId =', created.id)
      return { tabId: createdTabId, windowId: created.id }
    }
    // 返回值为 null 或窗口内标签页尚未就绪，转入轮询
    console.warn('[自动登录] windows.create 未返回可用窗口:', created)
  } catch (error) {
    console.error('[自动登录] 无痕窗口创建失败:', error)
    throw new Error(`无痕窗口打开失败：${(error as Error).message}`)
  }

  // 轮询窗口列表，找到新建的无痕窗口及其标签页
  for (let i = 0; i < 25; i++) {
    const wins = await chrome.windows.getAll({ populate: true })
    const target = wins.find(w => w.incognito && w.id !== undefined && !beforeIds.includes(w.id))
    const tabId = target?.tabs?.[0]?.id
    if (target?.id !== undefined && tabId) {
      console.log('[自动登录] 无痕窗口已创建(轮询): tabId =', tabId, ', windowId =', target.id)
      return { tabId, windowId: target.id }
    }
    await sleep(200)
  }

  throw new Error('未能获取无痕窗口的标签页，请确认已在扩展详情页开启「在无痕模式下启用」')
}

/**
 * 等待标签页加载完成
 * @param tabId - 标签页 ID
 * @param timeout - 超时时间（毫秒）
 */
function waitTabComplete(tabId: number, timeout = 45000): Promise<void> {
  const startAt = Date.now()
  console.log('[自动登录] 等待页面加载完成: tabId =', tabId, ', 超时 =', timeout, 'ms')

  return new Promise((resolve, reject) => {
    let settled = false
    let timer: ReturnType<typeof setTimeout>

    /**
     * 结束等待（只生效一次）
     * @param error - 有值时视为失败
     */
    const finish = (error?: Error) => {
      if (settled) return
      settled = true
      chrome.tabs.onUpdated.removeListener(listener)
      clearTimeout(timer)
      if (error) {
        console.warn('[自动登录] 等待页面加载结束(失败):', error.message, ', 耗时', Date.now() - startAt, 'ms')
        reject(error)
      } else {
        console.log('[自动登录] 页面加载完成, 耗时', Date.now() - startAt, 'ms')
        resolve()
      }
    }

    const listener = (id: number, info: chrome.tabs.TabChangeInfo) => {
      if (id !== tabId) return
      console.log('[自动登录] tab 状态更新: status =', info.status)
      if (info.status === 'complete') {
        finish()
      }
    }

    timer = setTimeout(() => finish(new Error('页面加载超时')), timeout)
    chrome.tabs.onUpdated.addListener(listener)

    // 监听器注册前可能已加载完成，主动查询一次
    chrome.tabs.get(tabId)
      .then(tab => {
        console.log('[自动登录] 当前标签页状态:', tab.status)
        if (tab.status === 'complete') finish()
      })
      .catch(() => finish(new Error('标签页已关闭')))
  })
}

/**
 * 在目标页面查找并填充用户名/密码输入框
 * 注意：该函数会被序列化后注入目标页面执行，不能引用外部作用域的变量
 * @param payload - 元素 id 与待填充的账号密码
 * @returns 是否找到用户名/密码输入框
 */
function injectFillLogin(payload: FillLoginPayload): FillLoginResult {
  /** 按元素 id（支持 #id 写法）或 CSS 选择器定位输入框 */
  const findInput = (raw: string): HTMLInputElement | null => {
    const value = (raw || '').trim()
    if (!value) return null

    const byId = document.getElementById(value.replace(/^#/, ''))
    if (byId instanceof HTMLInputElement) return byId

    try {
      const bySelector = document.querySelector(value)
      if (bySelector instanceof HTMLInputElement) return bySelector
    } catch {
      // 非法选择器，忽略
    }
    return null
  }

  /** 未指定 id 时自动查找第一个可用的文本输入框 */
  const findUserInput = (): HTMLInputElement | null => {
    const inputs = document.querySelectorAll('input')
    for (let i = 0; i < inputs.length; i++) {
      const el = inputs[i]
      const type = (el.type || 'text').toLowerCase()
      if (el.disabled || el.readOnly) continue
      if (type === 'text' || type === 'email' || type === 'tel' || type === 'number') return el
    }
    return null
  }

  /** 未指定 id 时自动查找密码输入框 */
  const findPasswordInput = (): HTMLInputElement | null => {
    const el = document.querySelector('input[type="password"]')
    return el instanceof HTMLInputElement ? el : null
  }

  /** 赋值并触发事件，兼容 Vue/React 等受控组件 */
  const setValue = (el: HTMLInputElement, value: string) => {
    if (el.value === value) return
    try {
      el.focus()
    } catch {
      // 忽略聚焦失败
    }
    const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')
    if (descriptor && typeof descriptor.set === 'function') {
      descriptor.set.call(el, value)
    } else {
      el.value = value
    }
    el.dispatchEvent(new Event('input', { bubbles: true }))
    el.dispatchEvent(new Event('change', { bubbles: true }))
    el.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }))
  }

  const userInput = findInput(payload.usernameId) || (payload.usernameId.trim() ? null : findUserInput())
  const passwordInput = findInput(payload.passwordId) || (payload.passwordId.trim() ? null : findPasswordInput())

  if (userInput && payload.username) setValue(userInput, payload.username)
  if (passwordInput && payload.password) setValue(passwordInput, payload.password)

  return { userFound: !!userInput, pwdFound: !!passwordInput }
}

/**
 * 轮询注入脚本，等待输入框渲染完成后填充
 * @param tabId - 目标标签页 ID
 * @param maxAttempts - 最大重试次数
 * @returns 最后一次注入的执行结果
 */
async function fillLoginInputs(tabId: number, maxAttempts = 10): Promise<FillLoginResult> {
  const payload: FillLoginPayload = {
    usernameId: loginForm.usernameId.trim(),
    passwordId: loginForm.passwordId.trim(),
    username: loginForm.username,
    password: loginForm.password
  }

  console.log('[自动登录] 开始填充, 参数:', {
    tabId,
    maxAttempts,
    usernameId: payload.usernameId || '(自动查找)',
    passwordId: payload.passwordId || '(自动查找)',
    username: payload.username,
    password: payload.password ? `已填写(长度 ${payload.password.length})` : '未填写'
  })

  let result: FillLoginResult = { userFound: false, pwdFound: false }
  let lastInjectError = ''

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let current: FillLoginResult | undefined
    try {
      const injections = await chrome.scripting.executeScript({
        target: { tabId },
        func: injectFillLogin,
        args: [payload]
      })
      current = injections[0]?.result as FillLoginResult | undefined
      lastInjectError = ''
    } catch (error) {
      // 页面仍在加载、脚本上下文未就绪时会注入失败，记录下来继续重试
      lastInjectError = (error as Error).message
      const alive = await chrome.tabs.get(tabId).then(() => true).catch(() => false)
      console.warn('[自动登录] 第', attempt, '/', maxAttempts, '次注入失败:', lastInjectError, ', 标签页存在 =', alive)
      if (!alive) {
        throw new Error('目标标签页已关闭')
      }
      if (attempt < maxAttempts) {
        setLoginStatus(`查找输入框失败，重试 ${attempt}/${maxAttempts}`)
        await sleep(500)
      }
      continue
    }

    if (current) {
      result = current
      console.log('[自动登录] 第', attempt, '/', maxAttempts, '次注入结果: userFound =', current.userFound, ', pwdFound =', current.pwdFound)
      const usernameReady = !payload.username || current.userFound
      const passwordReady = !payload.password || current.pwdFound
      if (usernameReady && passwordReady) {
        console.log('[自动登录] 填充完成, 共尝试', attempt, '次')
        return result
      }
      if (attempt < maxAttempts) {
        setLoginStatus(`未找到输入框，重试 ${attempt}/${maxAttempts}`)
      }
    }
    await sleep(500)
  }

  console.warn('[自动登录] 重试次数用尽:', { maxAttempts, result, lastInjectError })
  if (lastInjectError && !result.userFound && !result.pwdFound) {
    throw new Error(`注入脚本失败：${lastInjectError}`)
  }
  return result
}

/**
 * 自动登录：打开网址并填充账号密码
 */
async function autoLogin() {
  if (logging.value) return

  loginStatus.value = ''
  console.log('[自动登录] ===== 开始执行 =====')
  console.log('[自动登录] 表单参数:', {
    host: loginForm.host,
    path: loginForm.path,
    usernameId: loginForm.usernameId || '(自动查找)',
    passwordId: loginForm.passwordId || '(自动查找)',
    username: loginForm.username,
    password: loginForm.password ? `已填写(长度 ${loginForm.password.length})` : '未填写',
    incognito: loginForm.incognito
  })

  try {
    const url = buildTargetUrl(loginForm.host, loginForm.path)
    console.log('[自动登录] 组装后的完整网址:', url)

    if (!loginForm.username && !loginForm.password) {
      throw new Error('请输入账号或密码')
    }

    logging.value = true
    setLoginStatus('正在打开页面...')

    const target = await openLoginTab(url, loginForm.incognito)
    lastLoginTabId.value = target.tabId
    lastLoginWindowId.value = target.windowId ?? null

    await waitTabComplete(target.tabId)

    setLoginStatus('正在填充账号密码...')
    const result = await fillLoginInputs(target.tabId)

    const filled: string[] = []
    if (result.userFound && loginForm.username) filled.push('账号')
    if (result.pwdFound && loginForm.password) filled.push('密码')

    if (!filled.length) {
      throw new Error('未找到用户名/密码输入框，请检查元素 id 或页面结构')
    }

    setLoginStatus(`已自动输入${filled.join('、')}，可在目标页面点击登录`, 'success')
    console.log('[自动登录] ===== 执行成功 ===== 已输入:', filled.join('、'))
    await reportResult(true, `已自动输入${filled.join('、')}`)
  } catch (error) {
    const message = (error as Error).message || '自动登录失败'
    setLoginStatus(message, 'error')
    console.error('[自动登录] ===== 执行失败 =====', error)
    await reportResult(false, message)
  } finally {
    logging.value = false
  }
}

/**
 * 切换到目标标签页（用户主动点击，切换后当前弹窗会被浏览器关闭）
 */
async function focusLoginTab() {
  if (lastLoginTabId.value === null) return

  console.log('[自动登录] 切换到目标标签页: tabId =', lastLoginTabId.value, ', windowId =', lastLoginWindowId.value)
  try {
    if (loginForm.incognito && lastLoginWindowId.value !== null) {
      await chrome.windows.update(lastLoginWindowId.value, { focused: true })
    }
    await chrome.tabs.update(lastLoginTabId.value, { active: true })
  } catch (error) {
    console.error('[自动登录] 切换标签页失败:', error)
    setLoginStatus('切换标签页失败: ' + (error as Error).message, 'error')
  }
}
</script>
