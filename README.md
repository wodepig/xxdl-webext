
问题
跳转问题
权限问题
## 性能优化
https://zhuanlan.zhihu.com/p/194666183981659053
https://developer.chrome.google.cn/docs/extensions/reference/api/action?hl=zh-cn
获取cpu信息
https://developer.chrome.google.cn/docs/extensions/reference/api/system/cpu?hl=zh-cn
## 使用翻译

### 1. 添加翻译文件
在 `assets/locales` 目录下添加翻译文件, 例如: `assets/locales/zh-CN/messages.json`

定义翻译内容:
```json
{
  "extensionName": {
    "message": "筱筱动力",
    "description": "扩展名称。"
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

## 安装daisyui没样式
需要先升级tailwindcss到v4版本, 然后安装daisyui就行了
## 升级tailwindcss v4报错
```
🟣 Plasmo v0.90.5
🔴 The Browser Extension Framework
🔵 INFO   | Starting the extension development server...
🔵 INFO   | Building for target: chrome-mv3
🔵 INFO   | Loaded environment variables from: []
(node:25780) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
🔴 ERROR  | Build failed. To debug, run plasmo dev --verbose.
🔴 ERROR  | Could not resolve module "node:module" from "D:\\ws\_project\\xxdl-webext\\node\_modules\\.pnpm\\jiti@2.6.1\\node\_modules\\jiti\\lib\\jiti.cjs"
```
** 讨论:**
https://github.com/PlasmoHQ/plasmo/issues/1188
解决方案: scripts/patch.js 脚本

