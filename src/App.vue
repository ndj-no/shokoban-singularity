<template>
  <div class="flex flex-col items-center min-h-screen bg-[#222] pt-4 px-2">
    <h1 class="text-xl mb-4 text-white font-bold tracking-wider drop-shadow">
      Quest for the Lost Treasure
    </h1>
    <div class="flex gap-4 mb-4" v-show="false">
      <button
        class="px-4 py-1 rounded-lg bg-pink-500 text-white font-bold"
        :class="{ 'opacity-70': level === 1 }"
        @click="setLevel(1)"
      >
        Màn 1
      </button>
      <button
        class="px-4 py-1 rounded-lg bg-pink-500 text-white font-bold"
        :class="{ 'opacity-70': level === 2 }"
        @click="setLevel(2)"
      >
        Màn 2 (quái vật)
      </button>
    </div>
    <!-- Wrapper để canh giữa và tránh chạm mép, + scale -->
    <div class="w-full flex justify-center overflow-hidden">
      <div
        class="relative"
        :style="{
          width: scaledWidth ? scaledWidth + 'px' : 'auto',
          height: scaledHeight ? scaledHeight + 'px' : 'auto',
        }"
      >
        <div
          ref="mapContainer"
          class="rounded-2xl shadow-2xl p-2"
          :style="{
            position: 'absolute',
            left: '0',
            top: '0',
            display: 'inline-block',
            background: '#bbb',
            border: '4px solid #222',
            transform: `scale(${mapScale})`,
            transformOrigin: 'top left',
          }"
        >
          <SokobanMap
            :initialMap="currentMap"
            :finished="finished"
            :gameover="gameover"
            :monster="level === 2"
            @update:map="(m) => (currentMap = m)"
            @finish="onFinish"
            @gameover="onGameover"
          />
        </div>
      </div>
    </div>
    <div class="mt-8 text-gray-300 text-lg">
      <span>Swipe to move</span>
      <button
        class="ml-6 px-4 py-1 rounded-lg bg-indigo-600 text-white font-bold"
        @click="resetLevel"
      >
        Retry
      </button>
    </div>
    <div style="height: 80px" />

    <Congratulation :show="finished" v-if="!gameover" />
    <GameoverDialog :show="showGameoverDialog" @retry="resetLevel" @close="closeGameover" />
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, onMounted, onUnmounted, watch, computed } from 'vue'
import { mapData1, mapData2, clone2d } from './utils/sokoban.ts'
import SokobanMap from './components/SokobanMap.vue'
import Congratulation from './components/Congratulation.vue'
import GameoverDialog from './components/GameoverDialog.vue'

const level = ref(2)
const currentMap = ref(clone2d(mapData2))
const finished = ref(false)
const gameover = ref(false) // trạng thái game logic
const showGameoverDialog = ref(false) // trạng thái hiển thị dialog
const gameoverDismissed = ref(false) // đã đóng thủ công => không hiện lại

// Thêm refs cho scale
const mapContainer = ref<HTMLElement | null>(null)
const mapScale = ref(1)
const baseWidth = ref(0)
const baseHeight = ref(0)
const scaledWidth = computed(() => baseWidth.value * mapScale.value)
const scaledHeight = computed(() => baseHeight.value * mapScale.value)

function calcScaleRaw() {
  if (!mapContainer.value) return 1
  // đo kích thước trước khi scale (offsetWidth/offsetHeight không chịu ảnh hưởng transform)
  const bw = mapContainer.value.offsetWidth
  const bh = mapContainer.value.offsetHeight
  if (bw && bh) {
    // chỉ cập nhật nếu thay đổi để tránh reflow dư
    if (bw !== baseWidth.value || bh !== baseHeight.value) {
      baseWidth.value = bw
      baseHeight.value = bh
    }
  }
  const vw = window.innerWidth
  const horizontalMargin = 24
  const maxWidth = vw - horizontalMargin
  return bw > maxWidth ? maxWidth / bw : 1
}

function applyScale() {
  if (!mapContainer.value) return
  const s = Number(calcScaleRaw().toFixed(4))
  if (Math.abs(s - mapScale.value) > 0.0001) mapScale.value = s
}

function updateScale() {
  nextTick(() => requestAnimationFrame(applyScale))
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale, { passive: true })
  window.addEventListener('orientationchange', updateScale, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
  window.removeEventListener('orientationchange', updateScale)
})

watch(currentMap, () => updateScale())

function setLevel(lv: number) {
  level.value = lv
  if (lv === 1) currentMap.value = clone2d(mapData1)
  else currentMap.value = clone2d(mapData2)
  finished.value = false
  gameover.value = false
  showGameoverDialog.value = false
  gameoverDismissed.value = false
  updateScale()
}
function resetLevel() {
  setLevel(level.value)
}
function onFinish() {
  finished.value = true
}
function onGameover() {
  gameover.value = true
  if (!gameoverDismissed.value) showGameoverDialog.value = true
}
function closeGameover() {
  showGameoverDialog.value = false
  gameoverDismissed.value = true
}
</script>
