<template>
  <!-- Overlay toàn màn hình -->
  <transition name="fade" appear>
    <div v-if="props.show" class="dialog-overlay">
      <div class="dialog-content">
        <!-- Nội dung chúc mừng ở giữa -->
        <transition name="zoom" appear>
          <div v-if="props.show" class="flex flex-col items-center relative">
            <transition name="heart-fly" appear>
              <div v-if="props.show" class="heart-fly max-w-[320px] text-center space-y-4">
                <img src="/tada-chest-open.png" class="mx-auto" />
                <!-- Badge copy code: lấy từ env hoặc prop -->
                <CopyCodeBadge :code="codeValue" />
                <div class="text-4xl font-bold text-pink-600 mt-4 drop-shadow-lg w-full">
                  Happy Birthday
                </div>
              </div>
            </transition>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import CopyCodeBadge from './CopyCodeBadge.vue'

const props = defineProps<{ show: boolean; code?: string }>()

declare global {
  interface ImportMetaEnv {
    readonly VITE_CONGRATS_CODE?: string
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}

// Fallback sẽ dùng JLSKKMMFI nếu không có props.code hoặc biến môi trường
const envCode = import.meta.env.VITE_CONGRATS_CODE || 'TEST1234'
const codeValue = computed(() => props.code || envCode)
</script>

<style scoped>
/* Overlay dialog */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog-content {
  position: relative;
  max-width: 480px;
  width: 100%;
  padding: 24px 16px;
}

.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0.8, 0.4, 1.3);
}

.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.zoom-enter-to,
.zoom-leave-from {
  opacity: 1;
  transform: scale(1.1);
}

.chest-bounce-enter-active {
  animation:
    chest-bounce 1.2s cubic-bezier(0.5, 1.5, 0.4, 1) forwards,
    chest-fade-out 1s ease 1.2s forwards;
}

@keyframes chest-bounce {
  0% {
    transform: scale(0.5) rotate(-10deg);
  }
  60% {
    transform: scale(1) rotate(0deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}

@keyframes chest-fade-out {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.heart-fly {
  animation: heart-fly 1.2s cubic-bezier(0.55, 1.4, 0.3, 1) 1s 1 both;
}

@keyframes heart-fly {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0);
  }
  60% {
    opacity: 1;
    transform: translateY(-40px) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translateY(-50px) scale(1.2);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
