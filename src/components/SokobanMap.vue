<template>
  <div
    :style="{
      display: 'grid',
      gridTemplateRows: `repeat(${map.length}, ${tileSize}px)`,
      gridTemplateColumns: `repeat(${map[0].length}, ${tileSize}px)`,
    }"
  >
    <template v-for="(row, y) in map" :key="y">
      <template v-for="(cell, x) in row" :key="x">
        <SokobanTile :cell="cell" />
      </template>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { tileSize, clone2d, findPos } from '@/utils/sokoban'
import SokobanTile from '@/components/SokobanTile.vue'

const props = defineProps({
  initialMap: Array,
  finished: Boolean,
  gameover: Boolean,
  monster: Boolean,
})
const emit = defineEmits(['update:map', 'finish', 'gameover'])

const map = ref(clone2d(props.initialMap))

function move(dx: number, dy: number) {
  if (props.finished || props.gameover) return
  const cur = findPos(map.value, 'P')
  if (!cur) return
  const nx = cur.x + dx,
    ny = cur.y + dy
  if (map.value[ny][nx] === '#') return
  if (map.value[ny][nx] === 'B') {
    const bx = nx + dx,
      by = ny + dy
    if (map.value[by][bx] !== '.' && map.value[by][bx] !== 'C') return
    map.value[by][bx] = 'B'
    map.value[ny][nx] = 'P'
    map.value[cur.y][cur.x] = '.'
  } else if (map.value[ny][nx] === '.' || map.value[ny][nx] === 'C') {
    if (map.value[ny][nx] === 'C') emit('finish')
    map.value[ny][nx] = 'P'
    map.value[cur.y][cur.x] = '.'
  } else if (map.value[ny][nx] === 'M') {
    emit('gameover')
    return
  }
  emit('update:map', clone2d(map.value))
}

// QUAN TRỌNG: ĐÚNG LÀ monsterDir, không phải monsterLastDir
let monsterDir: [number, number] | null = null
function moveMonster() {
  const mon = findPos(map.value, 'M')
  if (!mon) return

  // Nếu chưa có hướng, random hướng
  if (!monsterDir) {
    const directions: [number, number][] = [
      [1, 0], // phải
      [-1, 0], // trái
      [0, 1], // xuống
      [0, -1], // lên
    ].filter(([dx, dy]) => {
      const tx = mon.x + dx,
        ty = mon.y + dy
      return map.value[ty] && map.value[ty][tx] && ['.', 'P'].includes(map.value[ty][tx])
    })
    if (directions.length === 0) {
      emit('update:map', clone2d(map.value))
      return
    }
    monsterDir = directions[Math.floor(Math.random() * directions.length)]
  }

  // Đi thử hướng hiện tại
  let nx = mon.x + monsterDir[0]
  let ny = mon.y + monsterDir[1]

  if (map.value[ny] && map.value[ny][nx] && ['.', 'P'].includes(map.value[ny][nx])) {
    if (map.value[ny][nx] === 'P') {
      emit('gameover')
      return
    }
    map.value[ny][nx] = 'M'
    map.value[mon.y][mon.x] = '.'
    emit('update:map', clone2d(map.value))
    return
  }

  // Nếu không đi được thì random lại hướng hợp lệ
  const directions: [number, number][] = [
    [1, 0], // phải
    [-1, 0], // trái
    [0, 1], // xuống
    [0, -1], // lên
  ].filter(([dx, dy]) => {
    const tx = mon.x + dx,
      ty = mon.y + dy
    return map.value[ty] && map.value[ty][tx] && ['.', 'P'].includes(map.value[ty][tx])
  })
  if (directions.length === 0) {
    emit('update:map', clone2d(map.value))
    return
  }
  monsterDir = directions[Math.floor(Math.random() * directions.length)]
  nx = mon.x + monsterDir[0]
  ny = mon.y + monsterDir[1]
  if (map.value[ny][nx] === 'P') {
    emit('gameover')
    return
  }
  map.value[ny][nx] = 'M'
  map.value[mon.y][mon.x] = '.'
  emit('update:map', clone2d(map.value))
}

let monsterInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (props.finished || props.gameover) return
    const dir = {
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      w: [0, -1],
      s: [0, 1],
      a: [-1, 0],
      d: [1, 0],
    }[e.key as string] as [number, number] | undefined
    if (!dir) return
    move(dir[0], dir[1])
  })

  if (props.monster) {
    monsterDir = null // reset hướng mỗi lần vào màn
    monsterInterval = setInterval(() => {
      if (!props.finished && !props.gameover) moveMonster()
    }, 1000)
  }
})

onUnmounted(() => {
  if (monsterInterval) clearInterval(monsterInterval)
})

watch(
  () => props.initialMap,
  (val) => {
    map.value = clone2d(val)
    monsterDir = null // reset hướng khi reset map
  },
)
</script>
