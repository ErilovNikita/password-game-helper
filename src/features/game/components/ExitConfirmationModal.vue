<template>
  <Teleport to="body">
    <div class="exit-backdrop" @click.self="$emit('cancel')">
      <section
        class="exit-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="exit-title"
        aria-describedby="exit-description"
      >
        <h2 id="exit-title">Выйти из игры?</h2>
        <p id="exit-description">
          Текущая комбинация, история попыток и все подсказки будут удалены.
        </p>

        <div class="exit-actions">
          <button class="cancel-button" type="button" @click="$emit('cancel')">
            Отмена
          </button>
          <button class="exit-button" type="button" @click="$emit('confirm')">
            Выйти
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

const emit = defineEmits<{
  (event: 'confirm'): void
  (event: 'cancel'): void
}>()

function handleKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape') emit('cancel')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', handleKeydown))
</script>

<style scoped>
.exit-backdrop {
  position: fixed;
  z-index: 110;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.55);
  box-sizing: border-box;
}

.exit-modal {
  width: min(100%, 330px);
  padding: 22px;
  border-radius: 40px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  box-sizing: border-box;
  text-align: center;
}

.exit-modal h2 {
  margin: 0 0 8px;
  font-size: 21px;
}

.exit-modal p {
  margin: 0;
  color: #556;
  line-height: 1.45;
}

.exit-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.exit-actions button {
  appearance: none;
  -webkit-appearance: none;
  height: 48px;
  border: 0;
  border-radius: 24px;
  color: #000;
  -webkit-text-fill-color: #000;
  font-weight: 700;
}

.cancel-button {
  background: #eef0f3;
}

.exit-button {
  background: #dce8ff;
}
</style>
