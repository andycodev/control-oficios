<template>
  <nav class="bg-gradient-to-r from-jade-700 to-jade-600 text-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-30">
    <div class="flex items-center gap-3">
      <!-- Botón de Hamburguesa para Sidebar en móviles -->
      <button 
        @click="$emit('toggle-sidebar')" 
        class="lg:hidden p-2 hover:bg-jade-500 rounded-xl transition-colors focus:outline-none flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <Bars3Icon class="w-6 h-6" />
      </button>

      <div class="flex items-center gap-2">
        <span class="text-dorado-500 font-extrabold text-lg tracking-wider font-outfit uppercase">Control de Oficios</span>
      </div>
    </div>

    <!-- Info del Usuario y Cerrar Sesión -->
    <div class="flex items-center gap-2 sm:gap-4">
      <!-- Botón de Instalar PWA -->
      <button 
        v-if="canInstall" 
        @click="installPWA" 
        class="flex items-center gap-1.5 bg-jade-800 hover:bg-jade-900 border border-jade-500/50 text-white font-extrabold text-[10px] sm:text-xs tracking-wider uppercase px-3 py-2 rounded-xl shadow transition duration-200 active:scale-95"
      >
        <ArrowDownTrayIcon class="w-4 h-4 text-white" />
        <span class="hidden sm:inline">Instalar App</span>
        <span class="sm:hidden">Instalar</span>
      </button>

      <div v-if="userEmail" class="hidden md:flex items-center gap-2 bg-jade-800/50 px-3 py-1.5 rounded-full border border-jade-500/30">
        <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span class="text-xs font-semibold tracking-wide text-jade-50 uppercase">{{ userEmail }}</span>
      </div>
      <button 
        v-if="isAuthenticated" 
        @click="logout" 
        class="flex items-center gap-2 bg-dorado-500 hover:bg-dorado-600 text-slate-900 font-extrabold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl shadow transition duration-200 active:scale-95"
      >
        <ArrowRightOnRectangleIcon class="w-4 h-4 text-slate-900" />
        <span>Salir</span>
      </button>
      <router-link 
        v-else 
        to="/login" 
        class="bg-dorado-500 hover:bg-dorado-600 text-slate-900 font-extrabold text-xs tracking-wider uppercase px-4 py-2.5 rounded-xl shadow transition duration-200 active:scale-95"
      >
        Ingresar
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { installPromptEvent } from '@/events/pwaInstall'
import { Bars3Icon, ArrowRightOnRectangleIcon, ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['toggle-sidebar', 'logout-success'])

const router = useRouter()

const isAuthenticated = computed(() => !!props.user)
const userEmail = computed(() => props.user?.email || '')
const canInstall = computed(() => !!installPromptEvent.value)

const installPWA = async () => {
  const promptEvent = installPromptEvent.value
  if (!promptEvent) return
  promptEvent.prompt()
  const { outcome } = await promptEvent.userChoice
  if (outcome === 'accepted') {
    showNotification('¡Gracias por instalar la aplicación!', 'alert-success')
  }
  installPromptEvent.value = null
}

const logout = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    showNotification('Sesión cerrada con éxito', 'alert-success')
    emit('logout-success')
    router.push('/login')
  } catch (err) {
    showNotification('Error al cerrar sesión: ' + err.message, 'alert-error')
  }
}
</script>
