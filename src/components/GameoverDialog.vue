<template>
  <transition name="fade" appear>
    <div v-if="show" class="overlay">
      <transition name="zoom" appear>
        <div v-if="show" class="panel text-center space-y-6">
          <div class="text-2xl font-extrabold text-red-500 drop-shadow-md animate-bounce">
            Omae wa mou shindeiru!! 😜
          </div>
          <div class="flex justify-center gap-4">
            <button
              class="px-5 py-2 rounded-lg bg-red-600/90 hover:bg-red-600 text-white font-semibold shadow active:scale-95 transition"
              @click="$emit('retry')"
            >
              Retry
            </button>
            <button
              class="px-5 py-2 rounded-lg bg-gray-600/70 hover:bg-gray-600 text-white font-semibold shadow active:scale-95 transition"
              @click="$emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{ (e: 'close'): void; (e: 'retry'): void }>()
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}
.panel {
  max-width: 480px;
  width: 100%;
  padding: 40px 32px;
}
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0.8, 0.4, 1.2);
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
.zoom-enter-to,
.zoom-leave-from {
  opacity: 1;
  transform: scale(1.05);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
