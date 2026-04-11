import type { ProjectConf } from '../types/project'

// 匹配项目配置
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
  return projectConf.matchUrl.some(url => tab.url.includes(url)) &&
    projectConf.matchTitle.some(title => tab.title.includes(title))
}
