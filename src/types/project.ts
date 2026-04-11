// 项目配置
export interface ProjectConf {
  id: number
  name: string
  description: string
  // 可以匹配的url
  matchUrl: string[]
  // 可以匹配的标题
  matchTitle: string[]
  // 后端key
  backendKey: string
}