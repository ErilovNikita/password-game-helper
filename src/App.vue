<script setup lang="ts">
import { ref, watch } from 'vue'
import cogIcon from './assets/cog.png'
import ExitConfirmationModal from './features/game/components/ExitConfirmationModal.vue'
import Game from './features/game/components/Game.vue'
import type { Settings as GameSettings } from './features/game/types'
import Settings from './features/settings/components/Settings.vue'
import {
  loadStorage,
  removeStorage,
  saveStorage,
  STORAGE_KEYS,
} from './shared/storage'

type AppState = {
  view: 'settings' | 'game'
  settings: GameSettings
}

const storedState = loadStorage<AppState>(STORAGE_KEYS.app)
const hasValidStoredState = (
  storedState
  && ['settings', 'game'].includes(storedState.view)
  && Number.isInteger(storedState.settings?.length)
  && storedState.settings.length >= 4
  && storedState.settings.length <= 10
)

const view = ref<'settings' | 'game'>(
  hasValidStoredState ? storedState.view : 'settings',
)
const settings = ref<GameSettings>(
  hasValidStoredState ? storedState.settings : { length: 4 },
)
const exitModalOpen = ref(false)

watch([view, settings], () => {
  saveStorage(STORAGE_KEYS.app, {
    view: view.value,
    settings: settings.value,
  })
}, { deep: true })

function startGame(newSettings: GameSettings) {
  removeStorage(STORAGE_KEYS.game)
  settings.value = newSettings
  view.value = 'game'
}

function confirmExit() {
  removeStorage(STORAGE_KEYS.game)
  exitModalOpen.value = false
  view.value = 'settings'
}
</script>

<template>
  <div
    class="app-header center"
    :class="{ compact: view === 'game' }"
  >
    <img src="/logo.png" alt="" class="logo" />
    <div class="app-title">
      <h1 class="header">Password Game Helper</h1>
      <div class="small">Помощник для позиционной игры с паролем</div>
    </div>
    <button
      v-if="view === 'game'"
      class="exit-trigger"
      type="button"
      aria-label="Выйти из игры"
      @click="exitModalOpen = true"
    >
      <img :src="cogIcon" alt="" />
    </button>
  </div>

  <main class="content">
    <Settings v-if="view === 'settings'" @start="startGame" />
    <Game
      v-else
      :settings="settings"
      :paused="exitModalOpen"
      @exit="exitModalOpen = true"
    />
  </main>

  <ExitConfirmationModal
    v-if="exitModalOpen"
    @confirm="confirmExit"
    @cancel="exitModalOpen = false"
  />
</template>

<style scoped>
.content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.app-header {
  flex-direction: column;
  gap: 8px;
  margin-bottom: 8px;
  transform-origin: top center;
}

.logo {
  height: 72px;
  margin-bottom: 10px;
}

.app-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.header {
  margin-bottom: 0;
}

.app-header.compact {
  flex-direction: row;
  justify-content: flex-start;
  gap: 12px;
  min-height: 52px;
  padding: 0 8px;
}

.compact .logo {
  height: 20px;
  margin-bottom: 0;
  transform: rotate(-90deg);
  animation: compact-logo 350ms ease-out both;
}

.compact .app-title {
  align-items: flex-start;
  gap: 0;
  text-align: left;
  animation: compact-title 350ms ease-out both;
}

.compact .header {
  font-size: 18px;
  text-align: left;
}

.compact .small {
  margin-top: 3px;
  font-size: 12px;
}

.exit-trigger {
  appearance: none;
  -webkit-appearance: none;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  margin-left: auto;
  padding: 0;
  border: 0;
  border-radius: 24px;
  background: #eef0f3;
  color: #000;
  -webkit-text-fill-color: #000;
  font-size: 21px;
  line-height: 1;
}

.exit-trigger img {
  display: block;
  width: 20px;
  height: 20px;
  margin: auto;
  object-fit: contain;
}

@keyframes compact-logo {
  from {
    transform: translateX(110px) scale(1.5) rotate(0);
  }

  to {
    transform: translateX(0) scale(1) rotate(-90deg);
  }
}

@keyframes compact-title {
  from {
    opacity: 0;
    transform: translateX(24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .compact .logo,
  .compact .app-title {
    animation: none;
  }
}
</style>
