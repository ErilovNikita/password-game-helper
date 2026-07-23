<script setup lang="ts">
import { ref } from 'vue'
import packageInfo from '../../../../package.json'
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

    <div class="settings-actions">
      <button class="start-button" type="button" @click="start">Начать</button>
      
      <a
        class="repository-link"
        href="https://github.com/erilovnikita/password-game-helper"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M12 .7a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.8.1-.8 1.2.1 1.9 1.3 1.9 1.3 1.1 1.9 2.9 1.3 3.6 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.6-1.4-5.6-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C14.8 4.9 16 5.2 16 5.2c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.8 1.2 3.1 0 4.4-2.9 5.4-5.6 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .7Z"
          />
        </svg>
        Password Game Helper
      </a>
      <div class="app-version">Version {{ packageInfo.version }}</div>
    </div>
  </div>
</template>

<style scoped>
.settings {
  padding: 16px 16px 150px;
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

.settings-actions {
  position: fixed;
  z-index: 60;
  bottom: 14px;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(420px, calc(100% - 36px));
  transform: translateX(-50%);
}

.start-button {
  appearance: none;
  margin-bottom: 30px !important;
  -webkit-appearance: none;
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 24px;
  background: #2b6cff;
  color: #fff;
  -webkit-text-fill-color: #fff;
  font-weight: 700;
}

.app-version {
  margin-top: 8px;
  color: #778;
  font-size: 12px;
}

.repository-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  color: #334;
  -webkit-text-fill-color: #334;
  font-size: 12px;
  text-decoration: none;
}

.repository-link svg {
  width: 15px;
  height: 15px;
}
</style>
