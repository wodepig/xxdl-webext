/**
 * 打码服务（captcha-bypass）调用封装
 * 接口文档见项目根目录「打码平台API.md」
 */
import { http } from "./http"

/** 识别类型：text 文字验证码 / math 算术验证码 */
export type CaptchaType = "text" | "math"

/** 打码服务统一响应体 */
interface CaptchaResponse<T> {
  code: number
  msg: string
  data: T
}

/** text 模式返回数据 */
interface CaptchaTextData {
  code: string
}

/** math 模式返回数据 */
interface CaptchaMathData {
  formula: string
  result: number
}

/**
 * 拼接接口地址
 * @param baseUrl - 打码服务根地址
 * @param path - 接口路径（以 / 开头）
 * @returns 完整请求地址
 */
export function buildCaptchaUrl(baseUrl: string, path: string): string {
  return baseUrl.replace(/\/+$/, "") + path
}

/**
 * 识别验证码
 * 注意：业务失败时 HTTP 仍返回 200，必须按响应体的 code 判断
 * @param baseUrl - 打码服务根地址
 * @param type - 识别类型
 * @param image - 图片 base64（可带 data URI 前缀）
 * @returns 识别结果（math 模式返回计算结果）
 */
export async function solveCaptcha(
  baseUrl: string,
  type: CaptchaType,
  image: string
): Promise<string> {
  const url = buildCaptchaUrl(baseUrl, "/captcha/ocr")
  const result = await http.post<CaptchaResponse<CaptchaTextData | CaptchaMathData>>(url, {
    type,
    action: "onnx",
    bg: image
  })

  const body = result.data
  if (!body || body.code !== 0) {
    throw new Error(body?.msg || "验证码识别失败")
  }

  // 算术验证码：填计算结果
  if (type === "math") {
    const data = body.data as CaptchaMathData
    if (data && typeof data.result === "number" && Number.isFinite(data.result)) {
      return String(data.result)
    }
    if (data?.formula) {
      return data.formula
    }
    throw new Error("验证码识别结果为空")
  }

  const data = body.data as CaptchaTextData
  if (!data || !data.code) {
    throw new Error("验证码识别结果为空")
  }
  return String(data.code)
}
