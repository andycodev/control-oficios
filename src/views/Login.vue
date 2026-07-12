<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 relative overflow-hidden font-sans">
    <!-- Círculos decorativos de fondo con colores institucionales -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-jade-100/40 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-dorado-100/40 blur-3xl"></div>

    <div class="w-full max-w-sm bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 md:p-8 relative z-10 transition-all duration-300 hover:shadow-jade-100/20">
      <!-- Encabezado / Logo del Sistema -->
      <div class="text-center mb-6">
        <div class="w-18 h-18 mx-auto mb-4 bg-gradient-to-tr from-jade-600 to-jade-500 rounded-2xl flex items-center justify-center shadow-lg shadow-jade-600/20 border border-dorado-500/20 transform hover:scale-105 transition-transform duration-300">
          <DocumentTextIcon class="w-9 h-9 text-white" />
        </div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-outfit uppercase">Control Oficios</h1>
        <p class="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold mt-1">Acceso para el Personal</p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="email" class="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">Correo Electrónico</label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            required 
            placeholder="correo@institucion.gob" 
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500"
          />
        </div>

        <div>
          <label for="password" class="block text-[10px] font-black uppercase text-slate-400 mb-1.5 ml-1">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            required 
            placeholder="••••••••" 
            class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-xs font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500"
          />
        </div>

        <!-- Botón de Envío (Consistente y táctil para móviles) -->
        <button 
          type="submit" 
          :disabled="loading"
          class="w-full bg-gradient-to-r from-jade-600 to-jade-500 hover:from-jade-700 hover:to-jade-600 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-jade-600/10 hover:shadow-jade-600/20 transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 min-h-[44px]"
        >
          <svg v-if="loading" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <ArrowRightOnRectangleIcon class="w-4 h-4" v-else />
          <span>{{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}</span>
        </button>
      </form>

      <!-- Enlace público de validación -->
      <div class="text-center mt-6 pt-4 border-t border-slate-100">
        <router-link 
          to="/validar" 
          class="text-[10px] font-black text-dorado-600 hover:text-dorado-700 uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
        >
          <MagnifyingGlassIcon class="w-4 h-4" />
          <span>Validar documento público</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { DocumentTextIcon, ArrowRightOnRectangleIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (loading.value) return
  loading.value = true

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value.trim(),
      password: password.value
    })

    if (error) throw error

    showNotification('¡Bienvenido/a al sistema!', 'alert-success')
    router.push('/dashboard')
  } catch (err) {
    showNotification('Error de acceso: ' + (err.message || 'Credenciales inválidas'), 'alert-error')
  } finally {
    loading.value = false
  }
}
</script>
