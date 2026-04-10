import type { PlasmoCSConfig } from "plasmo"
 
export const config: PlasmoCSConfig = {
  matches: ["https://plasmo.happyfe.com/*"],
  all_frames: true
}

console.log('检测到plasmo.happyfe.com页面, 变更背景色')
window.addEventListener("load", () => {
  document.body.style.background = "pink"
})