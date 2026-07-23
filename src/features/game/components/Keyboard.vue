<template>
  <div class="kbd">
    <div class="row" v-for="(r, idx) in rows" :key="idx">
      <template v-for="(key, keyIndex) in r" :key="`${idx}-${keyIndex}`">
        <button
          v-if="key"
          :disabled="key !== BACKSPACE && isDisabled(key)"
          :aria-label="key === BACKSPACE ? 'Удалить символ' : `Цифра ${key}`"
          @click="press(key)"
        >
          {{ key }}
        </button>
        <div v-else class="spacer"></div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

interface Props {
  disabledDigits?: string[]
  disabledByPosition?: string[][]
  pos?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'input', d: string): void
  (e: 'backspace'): void
}>()

const BACKSPACE = '⌫'
const rows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['', '0', BACKSPACE],
]
const disabledDigitsSet = computed(() => new Set((props.disabledDigits || []).map(String)))
const disabledByPositionSets = computed(() => (props.disabledByPosition || []).map(arr => new Set((arr || []).map(String))))

onMounted(() => window.addEventListener('keydown', handlePhysicalKey))
onBeforeUnmount(() => window.removeEventListener('keydown', handlePhysicalKey))

function isDisabled(k: string): boolean {
  if (disabledDigitsSet.value.has(k)) return true
  const posSet = disabledByPositionSets.value[props.pos ?? 0] || new Set<string>()
  if (posSet.has(k)) return true
  return false
}

function press(key: string): void {
  if (key === BACKSPACE) {
    emit('backspace')
    return
  }

  if (!isDisabled(key)) emit('input', key)
}

function handlePhysicalKey(event: KeyboardEvent): void {
  if (/^\d$/.test(event.key)) {
    event.preventDefault()
    press(event.key)
  } else if (event.key === 'Backspace') {
    event.preventDefault()
    emit('backspace')
  }
}
</script>

<style scoped>
.kbd {
  flex-shrink: 0;
  width: 100%;
  max-width: 420px;
  margin: 0 auto 25px;
}

.row {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 5px;
  margin-bottom: 5px;
}

.kbd button {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  min-width: 0;
  height: 64px;
  border-radius: 12px;
  border: 0;
  color: #000;
  -webkit-text-fill-color: #000;
  font-size: 20px;
  background-color: rgba(0, 0, 0, 0.118);
}

</style>
