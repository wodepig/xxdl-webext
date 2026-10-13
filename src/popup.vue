<template>
  <div class="w-[470px]">
    <HomePanel />
  </div>
</template>

<style>
:host {
  display: block;
  width: 470px;
  min-height: 400px;
}
</style>

<script setup lang="ts">
import HomePanel from "~/components/HomePanel.vue"

/**
 * 扩展弹窗页面
 * 面板内容见 components/HomePanel.vue，侧边栏（sidepanel.vue）复用同一份
 */
</script>
