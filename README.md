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

