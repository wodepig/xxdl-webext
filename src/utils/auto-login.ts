/**
 * 网页 ↔ 扩展「自动登录」通信协议
 * 网页侧通过 window.postMessage 发起，content script 校验域名后转发给 background
 */

/** 网页 → 扩展：触发自动登录 */
export const AUTO_LOGIN_MESSAGE_TYPE = 'XXDL_SEENTAO_AUTO_LOGIN'

/** 扩展 → 网页：自动登录执行结果 */
export const AUTO_LOGIN_RESULT_TYPE = 'XXDL_SEENTAO_AUTO_LOGIN_RESULT'

/**
 * 允许触发自动登录的域名白名单（按 location.hostname 精确匹配，不含端口）
 * 生产部署域名请补充到这里，不要使用通配
 */
export const AUTO_LOGIN_ALLOWED_HOSTS: string[] = [
  // 本地联调
  'localhost',
  '127.0.0.1',
  // 生产部署域名
  'finance.devitem.top'
]

/** 自动登录参数（由网页传入，字段均为可选，只覆盖传了的项） */
export interface AutoLoginParams {
  /** 目标主机（含协议，如 https://edu.seentao.com） */
  host?: string
  /** 目标路径（如 /runner_web/login） */
  path?: string
  /** 账号 */
  username?: string
  /** 密码 */
  password?: string
  /** 用户名输入框元素 id，留空自动查找 */
  usernameId?: string
  /** 密码输入框元素 id，留空自动查找 */
  passwordId?: string
  /** 验证码图片选择器（支持 XPath 与 CSS），不传则沿用表单默认值 */
  captchaSelector?: string
  /** 验证码输入框选择器，留空则自动查找 */
  captchaInputSelector?: string
  /** 是否使用无痕窗口打开，默认 false */
  incognito?: boolean
  /** 是否自动点击「确定」，默认 false（仅回填参数等待手动执行） */
  autoConfirm?: boolean
}

/** 自动登录执行结果 */
export interface AutoLoginResultPayload {
  /** 是否成功 */
  success: boolean
  /** 结果说明 */
  message: string
}

/** background 暂存待执行参数的 storage key */
export const PENDING_AUTO_LOGIN_KEY = 'pendingAutoLogin'

/** background 暂存请求来源标签页的 storage key（用于回传结果） */
export const AUTO_LOGIN_SOURCE_TAB_KEY = 'autoLoginSourceTabId'

/** 扩展操作页地址（不含扩展 id 前缀的路径部分） */
export const PROJECT_PAGE_PATH = 'tabs/project.html'
