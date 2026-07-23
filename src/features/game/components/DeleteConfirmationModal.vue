<template>
  <Teleport to="body">
    <div class="confirmation-backdrop" @click.self="$emit('cancel')">
      <section
        class="confirmation"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        <h2 id="delete-title">Удалить попытку?</h2>
        <p id="delete-description">
          Комбинация <strong>{{ guess }}</strong> будет удалена, а подсказки пересчитаются.
        </p>

        <div class="confirmation-actions">
          <button class="cancel-button" type="button" @click="$emit('cancel')">
            Отмена
          </button>
          <button class="delete-button" type="button" @click="$emit('confirm')">
            Удалить
          </button>
        </div>
      </section>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{ guess: string }>()
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
.confirmation-backdrop {
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

.confirmation {
  width: min(100%, 330px);
  padding: 22px;
  border-radius: 40px;
  background: #fff;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  box-sizing: border-box;
  text-align: center;
}

.confirmation h2 {
  margin: 0 0 8px;
  font-size: 21px;
}

.confirmation p {
  margin: 0;
  color: #556;
  line-height: 1.45;
}

.confirmation-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 20px;
}

.confirmation-actions button {
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

.delete-button {
  background: #ffdede;
}
</style>
