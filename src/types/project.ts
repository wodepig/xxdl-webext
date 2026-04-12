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
  // 项目文件名, 用于在popup中显示, 路径是tabs/fileName.vue, eg: example/xindao 不需要包含.vue
  fileName: string
}