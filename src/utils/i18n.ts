// import { chrome } from "plasmo"

export function t(key: string, fallback?: string): string {
  return chrome.i18n.getMessage(key) || fallback || key
}

export function tHtml(key: string, substitutions?: string | string[], fallback?: string): string {
  return chrome.i18n.getMessage(key, substitutions) || fallback || key
}
