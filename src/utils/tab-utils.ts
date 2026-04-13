import type { ProjectConf } from '../types/project'

/**
 * 支持的项目配置列表
 */
export const supportedSites: ProjectConf[] = [
  {
    id: 1,
    name: 'Example 网站',
    description: '示例网站，用于演示扩展功能',
    matchUrl: ['example.com'],
    matchTitle: ['Example'],
    backendKey: 'example',
    fileName: 'example'
  },
  {
    id: 2,
    name: '新道云',
    description: '处理新道云和分析云的账号自动添加',
    matchUrl: ['seentao.com'],
    matchTitle: ['新道云','分析云'],
    backendKey: 'another',
    fileName: 'xindao'
  }
]

/**
 * 匹配项目配置
 * @param tab - 当前标签页
 * @param projectConf - 项目配置
 * @returns 是否匹配
 */
export function matchProjectConf(tab: chrome.tabs.Tab | null, projectConf: ProjectConf): boolean {
  if (!tab) {
    throw new Error("标签页为空")
  }
  if (!tab.url || !tab.title) {
    throw new Error("标签页url为空或标题为空")
  }
  if (!projectConf.matchUrl.length || !projectConf.matchTitle.length) {
    throw new Error("项目配置匹配url或标题为空")
  }
  console.log('匹配项目配置:', projectConf, tab.url, tab.title)
  return projectConf.matchUrl.some(url => tab.url!.includes(url)) ||
    projectConf.matchTitle.some(title => tab.title!.includes(title))
}

/**
 * 获取当前标签页匹配的项目配置
 * @returns 匹配的项目配置，如果没有匹配则返回 null
 */
export async function getMatchedProject(): Promise<ProjectConf | null> {
  try {
    console.log('获取当前标签页匹配的项目配置')
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    console.log('当前标签页:', tab)
    if (!tab?.url || !tab.title) {
      return null
    }

    for (const project of supportedSites) {
      console.log('检查项目配置:', project)
      try {
        if (matchProjectConf(tab, project)) {
          return project
        }
      } catch {
        // 继续检查下一个项目
        continue
      }
    }
    return null
  } catch (error) {
    console.error('获取匹配项目失败:', error)
    return null
  }
}
