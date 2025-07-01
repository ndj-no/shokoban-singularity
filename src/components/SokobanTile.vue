<template>
  <div :style="style">
    <span v-if="cell === '#'">🧱</span>
    <span v-else-if="cell === 'B'">📦</span>
    <span v-else-if="cell === 'C'"><img class="w-[32px]" src="/chest.png" /></span>
    <span v-else-if="cell === 'P'"><img class="w-[32px]" src="/lumine2.png" /></span>
    <span v-else-if="cell === 'M'"><img class="w-[32px]" src="/hilichurl.png" /></span>
    <span v-else></span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { pixelStyle } from '@/utils/sokoban.ts'

const props = defineProps({
  cell: String,
})
const style = computed(() => {
  const bg =
    {
      '#': '#444',
      '.': '#eee',
      B: '#fa7',
      C: '#ffcc00',
      P: '#8ef',
      M: '#a4e',
    }[props.cell] || '#eee'
  return { ...pixelStyle, background: bg }
})
</script>
