import { ref } from 'vue'

export const installPromptEvent = ref<any>(null)
export const isAppInstalled = ref(false)

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault()
    // Stash the event so it can be triggered later.
    installPromptEvent.value = e
  })

  window.addEventListener('appinstalled', () => {
    installPromptEvent.value = null
    isAppInstalled.value = true
  })
}
