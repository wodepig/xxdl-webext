# 数据获取扩展

浏览器扩展，用于快速获取支持网站的 Cookie 和 Storage 数据。

## 功能特性

- 🔐 快速获取支持网站的 Cookie 数据
- 💾 读取 LocalStorage 存储信息
- 📦 读取 SessionStorage 会话数据
- 🚀 一键发送到后端服务器
- 🌐 支持多个网站的定制化操作

## 技术栈

- [Plasmo](https://www.plasmo.com/) - 浏览器扩展框架
- [Vue 3](https://vuejs.org/) - 前端框架
- [Tailwind CSS v4](https://tailwindcss.com/) - CSS 框架
- [DaisyUI](https://daisyui.com/) - UI 组件库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全

## 开发环境

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build
```

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── About.vue       # 关于页面组件
│   ├── HeaderActions.vue # 头部操作按钮
│   ├── Tabs.vue        # Tab 组件
│   └── Toast.vue       # Toast 提示组件
├── composables/        # 组合式函数
│   └── useTheme.ts     # 主题管理
├── contents/           # Content Scripts
│   └── content.ts      # 页面注入脚本
├── tabs/               # 扩展页面
│   ├── project.vue     # 项目动态加载页
│   ├── settings.vue    # 设置页面
│   ├── About.vue       # 关于页面
│   └── project/        # 项目操作页面
│       ├── Base.vue    # 基础模板
│       ├── xindao.vue  # 新道云适配
│       ├── bilibili.vue # B站适配
│       ├── shein.vue   # Shein适配
│       └── example.vue # 示例模板
├── utils/              # 工具函数
│   ├── common.ts       # 通用工具
│   ├── http-client.ts  # HTTP 请求
│   ├── i18n.ts         # 国际化
│   └── tab-utils.ts    # 标签页工具
├── types/              # 类型定义
│   └── project.ts      # 项目类型
├── popup.vue           # 弹窗主页面
└── style.css           # 全局样式
```

## 新增站点适配指南

### 1. 添加项目配置

在 `src/utils/tab-utils.ts` 中的 `supportedSites` 数组添加站点配置：

```typescript
{
  id: 5,                          // 唯一标识（递增）
  fileName: 'your-site',          // 站点标识（用于路由，对应 vue 文件名）
  name: '站点名称',                // 显示名称
  description: '站点描述信息',     // 站点描述
  matchUrl: ['example.com'],      // 匹配的 URL 关键字数组
  matchTitle: ['示例站点'],        // 匹配的页面标题关键字数组
  backendKey: 'your-backend-key'  // 后端标识
}
```

### 2. 创建操作页面

在 `src/tabs/project/` 目录下创建 `{fileName}.vue` 文件：

```vue
<template>
  <div class="p-4 w-[470px] min-h-[400px] bg-base-200">
    <!-- 头部区域 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button @click="goBack" class="btn btn-ghost btn-sm btn-circle">
          <!-- 返回图标 -->
        </button>
        <div>
          <h1 class="text-lg font-bold">站点名称</h1>
          <p class="text-xs text-base-content/60">域名</p>
        </div>
      </div>
      <HeaderActions />
    </div>

    <!-- Tab 功能区域 -->
    <Tabs v-model="activeTab" :tabs="tabs" name="site_tabs" custom-class="mb-4">
      <!-- 功能 Tab -->
      <template #feature>
        <div class="bg-base-100 border border-base-300 p-4 rounded-box">
          <!-- 功能内容 -->
        </div>
      </template>
    </Tabs>
  </div>
</template>

<script setup lang="ts">
import "~/style.css"
import { ref, computed, onMounted } from "vue"
import { t } from "~/utils/i18n"
import HeaderActions from "~/components/HeaderActions.vue"
import Tabs from "~/components/Tabs.vue"
import Toast from "~/components/Toast.vue"
import { Storage } from "@plasmohq/storage"
import { loadAndApplyTheme } from "~/composables/useTheme"

// 加载主题
onMounted(async () => {
  await loadAndApplyTheme()
})

const activeTab = ref('feature')
const tabs = computed(() => [
  { key: 'feature', label: '功能名称' }
])

function goBack() {
  window.history.back()
}
</script>
```

### 3. 注册组件

在 `src/tabs/project.vue` 中导入并注册新组件：

```typescript
import YourSite from "./project/your-site.vue"

const componentMap: Record<string, Component> = {
  // ... 其他组件
  'your-site': YourSite
}
```

### 4. 添加翻译（可选）

在 `assets/locales/zh_CN/messages.json` 中添加相关翻译：

```json
{
  "yourSiteTitle": {
    "message": "站点标题",
    "description": "站点标题"
  }
}
```

### 5. 功能实现参考

#### 获取 LocalStorage
```typescript
import { getLocalStorage } from '~/utils/common'

const data = await getLocalStorage('key')
```

#### 获取 SessionStorage
```typescript
import { getSessionStorage } from '~/utils/common'

const data = await getSessionStorage('key')
```

#### 获取 Cookie
```typescript
import { getCookies } from '~/utils/common'

const cookies = await getCookies()
```

#### 发送数据到后端
```typescript
import { httpClient } from "~/utils/http-client"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()
const backendUrl = await storage.get('backendUrl')
const result = await httpClient.post(`${backendUrl}/api/endpoint`, data)
```

## 使用翻译

### 1. 添加翻译文件

在 `assets/locales/zh_CN/messages.json` 定义翻译内容：

```json
{
  "extensionName": {
    "message": "数据获取工具",
    "description": "扩展名称"
  }
}
```

### 2. 使用翻译工具类

```vue
<script setup lang="ts">
import { t, tHtml } from "~/utils/i18n"

const extensionName = t("extensionName")
const greeting = tHtml("greeting", ["用户"], "Hello!")
</script>

<template>
  <h2>{{ extensionName }}</h2>
  <p>{{ greeting }}</p>
</template>
```

### API

- `t(key, fallback?)` - 获取翻译文本
- `tHtml(key, substitutions?, fallback?)` - 获取带变量替换的翻译文本

## 主题配置

扩展支持 35 种 DaisyUI 内置主题，在设置页面可选择：

- light, dark, cupcake, bumblebee, emerald, corporate, synthwave
- retro, cyberpunk, valentine, halloween, garden, forest, aqua
- lofi, pastel, fantasy, wireframe, black, luxury, dracula
- cmyk, autumn, business, acid, lemonade, night, coffee
- winter, dim, nord, sunset, caramellatte, abyss, silk

## 常见问题

### 安装 daisyui 没样式

需要先升级 tailwindcss 到 v4 版本，然后安装 daisyui：

```bash
pnpm add -D tailwindcss@latest daisyui@latest
```

### 升级 tailwindcss v4 报错

如果遇到 `Could not resolve module "node:module"` 错误，参考：

- GitHub Issue: https://github.com/PlasmoHQ/plasmo/issues/1188
- 解决方案：使用 scripts/patch.js 脚本

## 参考链接

- [Plasmo 文档](https://docs.plasmo.com/)
- [Vue 3 文档](https://vuejs.org/guide/introduction.html)
- [Tailwind CSS v4 文档](https://tailwindcss.com/docs)
- [DaisyUI 主题](https://daisyui.com/docs/themes/)
- [Chrome Extension API](https://developer.chrome.google.cn/docs/extensions/reference/api)
