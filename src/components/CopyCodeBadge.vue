<template>
  <div class="flex flex-col items-center select-none">
    <div
      class="copy-badge px-4 py-2 rounded-md bg-white/80 backdrop-blur border border-pink-200 shadow cursor-pointer flex items-center gap-2 transition hover:bg-white hover:shadow-lg active:scale-[0.97]"
      :class="{ copied }"
      @click="copy"
      role="button"
      :aria-label="copied ? 'Copied' : 'Copy code'"
    >
      <span class="font-mono text-gray-600 tracking-wide text-md font-bold">{{ code }}</span>
    </div>
    <div class="text-xs mt-1 text-pink-200 transition" :class="copied ? 'text-green-300' : ''">
      {{ copied ? 'Copied!' : 'Touch to copy' }}
      <span v-if="copied" class="text-green-600 text-lg">✔</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{ code: string }>()
const copied = ref(false)

function success() {
  copied.value = true
}

async function copy() {
  if (!props.code) return
  // Ưu tiên Clipboard API nếu context an toàn (https hoặc localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(props.code)
      success()
      return
    } catch (e) {
      // fallback phía dưới
      // console.warn('Clipboard API failed, fallback to execCommand', e)
    }
  }
  // Fallback: chọn text tạm rồi execCommand
  try {
    const ta = document.createElement('textarea')
    ta.value = props.code
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    ta.style.left = '-1000px'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.focus()
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    if (ok) {
      success()
      return
    }
  } catch (e) {
    // console.error('execCommand copy failed', e)
  }
  // Fallback cuối: Range selection (một số trình duyệt cũ / iOS)
  try {
    const span = document.createElement('span')
    span.textContent = props.code
    span.style.whiteSpace = 'pre'
    span.style.position = 'fixed'
    span.style.top = '-1000px'
    document.body.appendChild(span)
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      const range = document.createRange()
      range.selectNodeContents(span)
      selection.addRange(range)
      document.execCommand('copy')
      selection.removeAllRanges()
      success()
    }
    document.body.removeChild(span)
  } catch {}
}
</script>

<style scoped>
.copy-badge {
  user-select: none;
}
.copy-badge:focus {
  outline: 2px solid #ec4899;
  outline-offset: 2px;
}
.copy-badge.copied {
  animation: copied-pulse 0.4s ease;
}
@keyframes copied-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.6);
  }
  100% {
    box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);
  }
}
</style>
