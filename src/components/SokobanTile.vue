<template>
  <div :style="style">
    <span v-if="cell === '#'">🧱</span>
    <span v-else-if="cell === 'B'">📦</span>
    <span v-else-if="cell === 'C'">🗝️</span>
    <span v-else-if="cell === 'P'">🙂</span>
    <span v-else-if="cell === 'M'"><img class="w-[32px]" src="/public/hilichurl.png" /></span>
    <span v-else></span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { pixelStyle } from '@/utils/sokoban'

const props = defineProps({
  cell: String,
})
const style = computed(() => {
  const bg =
    {
      '#': '#444',
      '.': '#eee',
      B: '#fa7',
      C: '#ee8',
      P: '#8ef',
      M: '#a4e',
    }[props.cell] || '#eee'
  return { ...pixelStyle, background: bg }
})
</script>
