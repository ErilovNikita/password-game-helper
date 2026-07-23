import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'

// always unregister any previous service worker as early as possible in dev
if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then((registrations) => {
      if (!registrations.length) return
      registrations.forEach((registration) => registration.unregister().catch(() => {}))
      if (!sessionStorage.getItem('dev-sw-unregistered')) {
        sessionStorage.setItem('dev-sw-unregistered', '1')
        window.location.reload()
      }
    })
    .catch(() => {})
}

createApp(App).mount('#app')
