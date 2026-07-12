<template>
  <div class="min-h-screen flex flex-col font-sans">
    <!-- Si la ruta usa el layout principal y el usuario está autenticado, mostramos Navbar y Sidebar -->
    <div v-if="currentRoute.meta.layout === 'main'" class="flex min-h-screen">
      <!-- Sidebar -->
      <Sidebar :isOpen="sidebarOpen" @close="sidebarOpen = false" />

      <!-- Contenido Principal -->
      <div class="flex-1 flex flex-col min-h-screen lg:pl-64">
        <!-- Navbar -->
        <Navbar :user="user" @toggle-sidebar="sidebarOpen = !sidebarOpen" @logout-success="user = null" />

        <!-- Vista -->
        <main class="flex-1 p-4 md:p-6 lg:p-8">
          <router-view />
        </main>
      </div>
    </div>

    <!-- Si no requiere el layout principal, mostramos solo la vista (ej. Login, Validar) -->
    <div v-else class="flex-1 flex flex-col">
      <router-view />
    </div>

    <!-- Notificaciones Globales -->
    <div class="fixed top-4 right-4 pointer-events-none z-[9999]">
      <div class="pointer-events-auto">
        <Notification v-bind="notificationState" @close="notificationState.show = false" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import Sidebar from '@/components/Sidebar.vue'
import Navbar from '@/components/Navbar.vue'
import Notification from '@/components/shared/Notification.vue'
import { notificationState } from '@/events/notificationEvents'
import '@/events/pwaInstall'

const currentRoute = useRoute()
const user = ref<any>(null)
const sidebarOpen = ref(false)

onMounted(async () => {
  // Obtener sesión inicial
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null

  // Escuchar cambios de autenticación
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user || null
  })
})
</script>

<style>
/* Animaciones globales y transiciones suaves */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>