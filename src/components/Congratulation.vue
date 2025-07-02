<template>
  <transition name="zoom" appear>
    <div v-if="props.show" class="flex flex-col items-center">
      <div style="position: relative; margin-top: 20px">
        <!-- Mochi chúc mừng -->
        <transition name="heart-fly" appear>
          <div
            v-if="props.show"
            style="position: absolute; left: 50%; transform: translateX(-50%)"
            class="heart-fly max-w-[320px]"
          >
            <img src="/mochimazui.png" />
            <div
              v-if="props.show"
              class="text-4xl font-bold text-pink-600 mt-8 drop-shadow-lg w-full"
            >
              Happy Birth Day
            </div>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
const props = defineProps({
  show: Boolean,
})
</script>

<style scoped>
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
    transform: translateX(-50%) translateY(30px) scale(0);
  }
  60% {
    opacity: 1;
    transform: translateX(-50%) translateY(-40px) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(-50px) scale(1.2);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 1.2s,
    transform 1.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
