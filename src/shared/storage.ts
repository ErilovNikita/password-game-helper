export const STORAGE_KEYS = {
  app: 'password-game-helper:app',
  game: 'password-game-helper:game',
} as const

export function loadStorage<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) as T : null
  } catch {
    return null
  }
}

export function saveStorage(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // The application remains usable when storage is unavailable.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch {
    // The application remains usable when storage is unavailable.
  }
}
