<template>
  <div>
    <h2>{{ extensionName }}</h2>
    <div class="bg-red-200 p-5">
      hello
    </div>
  
    <button class="btn btn-primary" @click="mytest">测试</button>

    <div class="container">
    
    </div>
  </div>

</template>

<style>
.container {
  min-width: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 47px;
}
.text-center {
  text-align: center;
}
.action {
  color: #470;
  font-weight: bold;
}
</style>

<script setup lang="ts">
import "./style.css"
import { reactive } from "vue"
import type { App } from "vue"


const extensionName = chrome.i18n.getMessage("extensionName")
const state = reactive({ count: 0, action: null })

async function mytest() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
  console.log(tab)
}

function decrement() {
  state.count--
  state.action = "decrement"
}

defineOptions({
  prepare(app: App) {
    // Use any plugins here:
    // app.use
  }
})
</script>
