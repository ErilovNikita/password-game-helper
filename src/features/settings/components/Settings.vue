<script setup lang="ts">
import { ref } from 'vue'
import type { Settings } from '../../game/types'

const length = ref<number>(4)
const emit = defineEmits<{ (e: 'start', payload: Settings): void }>()
function start(): void { emit('start', { length: length.value }) }
</script>

<template>
  <div class="settings">
    <div class="length-control">
      <div class="small">Укажите длину пароля</div>
      <input type="range" v-model.number="length" min="4" max="10" />
      <div class="length-value">{{ length }}</div>
    </div>

    <button class="footer-btn" @click="start">Начать</button>
  </div>
</template>

<style scoped>
.settings {
  padding: 16px 16px 96px;
}

.settings-header {
  flex-direction: column;
}

.length-control {
  margin-top: 18px;
}

input[type=range] {
  width: 100%;
}

.length-value {
  margin-top: 6px;
  font-weight: 600;
}
</style>
