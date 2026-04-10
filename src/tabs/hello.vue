<template>
  <div class="bg-blue-200">
    <!-- <button class="btn btn-primary">按钮</button> -->
    扩展页面可见
    <img :src="someCoolImage" alt="一个非常酷的图像" />
  </div>
</template>

<script setup lang="ts">
import '../style.css'
import someCoolImage from "data-base64:/assets/xxdl-wx-qr.jpg"
</script>
