<template>
  <div
    ref="rootRef"
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
import { tileSize, clone2d, findPos } from '@/utils/sokoban.ts'
import { swipeVectorToDir } from '@/utils/input'
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
let monsterDir: number[] | null = null

function moveMonster() {
  const mon = findPos(map.value, 'M')
  if (!mon) return

  // Nếu chưa có hướng, random hướng
  if (!monsterDir) {
    const directions: number[][] = [
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
  const directions: number[][] = [
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

// --- Touch swipe handling state ---
// We keep this lightweight and separate from movement logic.
const rootRef = ref<HTMLElement | null>(null)
let touchId: number | null = null
let startX = 0
let startY = 0
let swipeDone = false // ensures exactly one move per gesture
const SWIPE_THRESHOLD = 30 // px; adjust within 24-40 as required

function onTouchStart(e: TouchEvent) {
  if (props.finished || props.gameover) return
  if (touchId !== null) return // already tracking one finger (ignore multi-touch)
  const t = e.changedTouches[0]
  touchId = t.identifier
  startX = t.pageX
  startY = t.pageY
  swipeDone = false
}

function onTouchMove(e: TouchEvent) {
  if (touchId === null) return
  // find the active touch with our identifier
  const t = Array.from(e.touches).find((tt) => tt.identifier === touchId)
  if (!t) return
  const dx = t.pageX - startX
  const dy = t.pageY - startY
  const dir = !swipeDone ? swipeVectorToDir(dx, dy, SWIPE_THRESHOLD) : null
  if (dir) {
    move(dir[0], dir[1])
    swipeDone = true
  }
  // Prevent page scroll while interacting within game area
  e.preventDefault()
}

function endTouchIfMatch(e: TouchEvent) {
  if (touchId === null) return
  if (Array.from(e.changedTouches).some((t) => t.identifier === touchId)) {
    touchId = null
    swipeDone = false
  }
}

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
  // Attach touch listeners (non-passive so we can preventDefault)
  if (rootRef.value) {
    rootRef.value.addEventListener('touchstart', onTouchStart, { passive: false })
    rootRef.value.addEventListener('touchmove', onTouchMove, { passive: false })
    rootRef.value.addEventListener('touchend', endTouchIfMatch, { passive: false })
    rootRef.value.addEventListener('touchcancel', endTouchIfMatch, { passive: false })
  }
  startMonster(props.monster)
})

const clearMonsterInvterval = () => {
  if (monsterInterval) clearInterval(monsterInterval)
}

onUnmounted(() => {
  clearMonsterInvterval()
  if (rootRef.value) {
    rootRef.value.removeEventListener('touchstart', onTouchStart)
    rootRef.value.removeEventListener('touchmove', onTouchMove)
    rootRef.value.removeEventListener('touchend', endTouchIfMatch)
    rootRef.value.removeEventListener('touchcancel', endTouchIfMatch)
  }
})

const startMonster = (isMonsterEnable: any) => {
  if (isMonsterEnable && !monsterInterval) {
    monsterInterval = setInterval(() => {
      if (!props.finished && !props.gameover) moveMonster()
    }, 1000)
  }
}

watch(
  () => [props.initialMap, props.monster],
  ([newMap, newMonster]) => {
    map.value = clone2d(newMap)
    monsterDir = null // reset hướng khi reset map
    if (!newMonster) {
      clearMonsterInvterval();
    }
    startMonster(newMonster)
  },
)
</script>
