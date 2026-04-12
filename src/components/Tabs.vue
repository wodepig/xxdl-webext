<template>
  <div class="tabs tabs-box" :class="customClass">
    <template v-for="(tab, index) in tabs" :key="tab.key">
      <input
        type="radio"
        :name="name"
        class="tab"
        :aria-label="tab.label"
        :checked="modelValue === tab.key"
        @change="$emit('update:modelValue', tab.key)"
      />
      <div class="tab-content bg-base-100 border-base-300 p-4">
        <slot :name="tab.key" :tab="tab">
          <!-- 默认内容插槽 -->
          <div v-html="tab.content"></div>
        </slot>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
export interface TabItem {
  key: string
  label: string
  content?: string
}

interface Props {
  tabs: TabItem[]
  name: string
  modelValue: string
  customClass?: string
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>
