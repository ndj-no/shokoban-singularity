<template>
  <div class="flex flex-col items-center min-h-screen bg-[#222] py-8">
    <!-- <h1 class="text-xl mb-4 text-white font-bold tracking-wider drop-shadow">
      Quest for the Lost Treasure
    </h1> -->
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
    <div
      class="rounded-2xl shadow-2xl p-2"
      style="display: inline-block; background: #bbb; border: 4px solid #222"
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
import { ref } from 'vue'
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

function setLevel(lv: number) {
  level.value = lv
  if (lv === 1) currentMap.value = clone2d(mapData1)
  else currentMap.value = clone2d(mapData2)
  finished.value = false
  gameover.value = false
  showGameoverDialog.value = false
  gameoverDismissed.value = false
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
