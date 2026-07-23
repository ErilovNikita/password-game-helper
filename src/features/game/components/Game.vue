<template>
  <div class="game-page">
    <div class="header">
      <div class="blocks">
        <span
          v-for="n in settings.length"
          :key="n"
          class="block"
          :class="{ confirmed: isPositionConfirmed(n - 1) }"
        >
          {{ displayDigit(n - 1) }}
        </span>
      </div>
    </div>

    <div v-if="winningGuess" class="victory" role="status">
      <div class="fireworks" aria-hidden="true">🎉</div>
      <h2>Ты выиграл!</h2>
      <p>Отличная работа — пароль полностью разгадан!</p>
    </div>

    <div v-else class="history">
      <ul>
        <li
          v-for="(g,i) in guesses"
          :key="g.value"
          :class="g.feedback === 0 ? 'no-matches' : 'has-matches'"
        >
          <span>{{g.value}} — совпадений: {{g.feedback}}</span>
          <button
            class="delete-guess"
            type="button"
            :aria-label="`Удалить комбинацию ${g.value}`"
            @click="requestGuessRemoval(i)"
          >
            ✕
          </button>
        </li>
      </ul>
    </div>

    <Keyboard
      v-if="
        !winningGuess
        && !feedbackModalOpen
        && pendingRemovalIndex === null
        && !paused
      "
      :disabledDigits="disabledDigits"
      :disabledByPosition="disabledByPosition"
      :pos="currentGuess.length"
      @input="onInput"
      @backspace="onBack"
    />

    <FeedbackModal
      v-if="feedbackModalOpen"
      :max="settings.length"
      @submit="saveFeedback"
      @cancel="cancelFeedback"
    />

    <DeleteConfirmationModal
      v-if="pendingRemovalIndex !== null"
      :guess="guesses[pendingRemovalIndex].value"
      @confirm="confirmGuessRemoval"
      @cancel="pendingRemovalIndex = null"
    />

    <button
      v-if="winningGuess"
      class="footer-btn"
      type="button"
      @click="$emit('exit')"
    >
      Выйти из игры
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { calculateDeductions } from '../deductions'
import type { Guess, Settings } from '../types'
import {
  loadStorage,
  saveStorage,
  STORAGE_KEYS,
} from '../../../shared/storage'
import DeleteConfirmationModal from './DeleteConfirmationModal.vue'
import FeedbackModal from './FeedbackModal.vue'
import Keyboard from './Keyboard.vue'

const props = defineProps<{ settings: Settings; paused?: boolean }>()
defineEmits<{ (event: 'exit'): void }>()

type StoredGameState = {
  length: number
  currentGuess: string
  guesses: Guess[]
}

const storedGame = loadStorage<StoredGameState>(STORAGE_KEYS.game)
const restoredGame = isValidStoredGame(storedGame, props.settings.length)
  ? storedGame
  : null

const currentGuess = ref<string>(restoredGame?.currentGuess ?? '')
const guesses = ref<Guess[]>(restoredGame?.guesses ?? [])
const feedbackModalOpen = ref(
  currentGuess.value.length === props.settings.length,
)
const pendingRemovalIndex = ref<number | null>(null)
const disabledDigits = ref<string[]>([])
const disabledByPosition = ref<string[][]>(Array.from({length: props.settings.length}, ()=>[]))
const confirmedByPosition = ref<(string | null)[]>(
  Array.from({ length: props.settings.length }, () => null),
)
const winningGuess = computed(
  () => guesses.value.find((guess) => guess.feedback === props.settings.length)?.value ?? '',
)

watch(guesses, () => {
  updateDeductions()
  persistGame()
}, { deep: true })
watch(currentGuess, persistGame)

function isValidStoredGame(
  state: StoredGameState | null,
  length: number,
): state is StoredGameState {
  return Boolean(
    state
    && state.length === length
    && typeof state.currentGuess === 'string'
    && /^\d*$/.test(state.currentGuess)
    && state.currentGuess.length <= length
    && Array.isArray(state.guesses)
    && state.guesses.every((guess) => (
      typeof guess.value === 'string'
      && /^\d+$/.test(guess.value)
      && guess.value.length === length
      && Number.isInteger(guess.feedback)
      && guess.feedback >= 0
      && guess.feedback <= length
    )),
  )
}

function persistGame(): void {
  saveStorage(STORAGE_KEYS.game, {
    length: props.settings.length,
    currentGuess: currentGuess.value,
    guesses: guesses.value,
  } satisfies StoredGameState)
}

function onInput(d: string): void {
  if(currentGuess.value.length < props.settings.length){
    currentGuess.value += d
    if(currentGuess.value.length === props.settings.length){
      submitGuess()
    }
  }
}
function onBack(): void { currentGuess.value = currentGuess.value.slice(0,-1) }
function displayDigit(position: number): string {
  return winningGuess.value[position]
    ?? currentGuess.value[position]
    ?? confirmedByPosition.value[position]
    ?? '·'
}

function isPositionConfirmed(position: number): boolean {
  return Boolean(
    winningGuess.value
    || (!currentGuess.value[position] && confirmedByPosition.value[position]),
  )
}

function submitGuess(): void {
  if(currentGuess.value.length!==props.settings.length) return
  // prevent duplicate guesses
  if(guesses.value.some(g=>g.value===currentGuess.value)){
    alert('Эта комбинация уже была введена.')
    return
  }
  feedbackModalOpen.value = true
}

function saveFeedback(feedback: number): void {
  if (feedback < 0 || feedback > props.settings.length) return

  guesses.value.push({ value: currentGuess.value, feedback })
  currentGuess.value = ''
  feedbackModalOpen.value = false
}

function cancelFeedback(): void {
  currentGuess.value = ''
  feedbackModalOpen.value = false
}

function requestGuessRemoval(index: number): void {
  pendingRemovalIndex.value = index
}

function confirmGuessRemoval(): void {
  if (pendingRemovalIndex.value === null) return

  guesses.value.splice(pendingRemovalIndex.value, 1)
  pendingRemovalIndex.value = null
}

function updateDeductions(): void {
  const deductions = calculateDeductions(props.settings.length, guesses.value)
  disabledDigits.value = deductions.disabledDigits
  disabledByPosition.value = deductions.disabledByPosition
  confirmedByPosition.value = deductions.confirmedByPosition
}

updateDeductions()
</script>

<style scoped>
.game-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
}

.blocks {
  display: flex;
  gap: 6px;
  width: 100%;
  justify-content: center;
}

.block {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  border: 1px solid #e6eef8;
  border-radius: 8px;
  font-size: 32px;
}

.block.confirmed {
  border-color: #2b6cff;
  background: #edf3ff;
  color: #2b6cff;
  font-weight: 700;
}

.victory {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
}

.victory h2 {
  margin: 14px 0 6px;
  color: #2b6cff;
  font-size: 28px;
}

.victory p {
  max-width: 280px;
  margin: 0;
  color: #556;
  font-size: 16px;
  line-height: 1.5;
}

.fireworks {
  font-size: 100px;
}
.history {
  flex: 1;
  width: 100%;
  min-height: 0;
  margin: 0 auto;
  padding: 8px 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
}

.history ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.history li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 56px;
  margin-bottom: 8px;
  padding: 10px 10px 10px 14px;
  border-radius: 8px;
  box-sizing: border-box;
}

.history li.no-matches {
  border-color: #f4cccc;
  background: #fff1f1;
}

.history li.has-matches {
  border-color: #cce8d2;
  background: #effaf1;
}

.delete-guess {
  appearance: none;
  -webkit-appearance: none;
  flex: 0 0 36px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: rgba(0, 0, 0, 0.07);
  color: #000;
  -webkit-text-fill-color: #000;
  font-size: 16px;
  line-height: 1;
}

.delete-guess:active {
  background: rgba(0, 0, 0, 0.14);
}
</style>
