<template>
  <Teleport to="body">
    <div class="modal-backdrop" role="presentation">
      <section
        class="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
      >
        <h2 id="feedback-title">Сколько цифр совпало?</h2>
        <p>Укажите количество цифр, которые стоят на правильных позициях.</p>

        <div class="feedback-keyboard" aria-label="Количество совпадений">
          <button
            v-for="value in values"
            :key="value"
            type="button"
            @click="$emit('submit', value)"
          >
            {{ value }}
          </button>
        </div>

        <button class="cancel-button" type="button" @click="$emit('cancel')">
          Отмена
        </button>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'

const props = defineProps<{ max: number }>()
const emit = defineEmits<{
  (event: 'submit', value: number): void
  (event: 'cancel'): void
}>()

const values = computed(() => (
  Array.from({ length: props.max + 1 }, (_, value) => value)
))

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  box-sizing: border-box;
}

.modal {
  width: min(100%, 360px);
  padding: 24px;
  border-radius: 40px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  box-sizing: border-box;
  text-align: center;
}

.modal h2 {
  margin: 0 0 8px;
  font-size: 22px;
}

.modal p {
  margin: 0 0 20px;
  color: #556;
  line-height: 1.45;
}

.feedback-keyboard {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.feedback-keyboard button {
  appearance: none;
  -webkit-appearance: none;
  min-height: 56px;
  border: 0;
  border-radius: 24px;
  background: #edf3ff;
  color: #000;
  -webkit-text-fill-color: #000;
  font-size: 20px;
  font-weight: 700;
}

.feedback-keyboard button:active {
  background: #dce8ff;
}

.cancel-button {
  width: 100%;
  height: 48px;
  margin-top: 14px;
  border: 0;
  border-radius: 24px;
  background: #eef0f3;
  font-weight: 600;
}
</style>
