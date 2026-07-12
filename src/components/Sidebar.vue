<template>
  <div>
    <!-- Backdrop para móviles -->
    <div 
      v-if="isOpen" 
      @click="$emit('close')" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
    ></div>

    <!-- Sidebar Contenedor -->
    <aside 
      :class="[
        'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-slate-100 text-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div>
        <!-- Encabezado / Logo -->
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div class="flex flex-col">
            <span class="text-[10px] uppercase font-black tracking-widest text-dorado-600">Sistema Oficial</span>
            <span class="text-lg font-black tracking-tight uppercase mt-0.5 text-jade-700 font-outfit">Control Oficios</span>
          </div>
          <!-- Botón de Cerrar para móviles -->
          <button 
            @click="$emit('close')" 
            class="lg:hidden p-1.5 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <!-- Enlaces de navegación -->
        <nav class="p-4 space-y-1.5 flex-1">
          <!-- Link: Dashboard -->
          <router-link 
            to="/dashboard" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200"
            active-class="bg-jade-50 text-jade-700 border border-jade-200/50 shadow-sm"
            :class="$route.path === '/dashboard' ? '' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
          >
            <Square2StackIcon class="w-5 h-5" />
            <span>Panel General</span>
          </router-link>

          <!-- Link: Nuevo Oficio -->
          <router-link 
            to="/nuevo-oficio" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200"
            active-class="bg-jade-50 text-jade-700 border border-jade-200/50 shadow-sm"
            :class="$route.path === '/nuevo-oficio' ? '' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
          >
            <DocumentPlusIcon class="w-5 h-5" />
            <span>Nuevo Oficio</span>
          </router-link>

          <!-- Link: Listado General -->
          <router-link 
            to="/listado-oficios" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200"
            active-class="bg-jade-50 text-jade-700 border border-jade-200/50 shadow-sm"
            :class="$route.path === '/listado-oficios' ? '' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
          >
            <ListBulletIcon class="w-5 h-5" />
            <span>Listado General</span>
          </router-link>

          <!-- Link: Validar (Public) -->
          <router-link 
            to="/validar" 
            @click="$emit('close')"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200"
            active-class="bg-jade-50 text-jade-700 border border-jade-200/50 shadow-sm"
            :class="$route.path === '/validar' ? '' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            <span>Validar Documento</span>
          </router-link>
        </nav>
      </div>

      <!-- Footer del Sidebar -->
      <div class="p-4 border-t border-slate-100 text-center">
        <p class="text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">© 2026 GESTIÓN PÚBLICA</p>
        <p class="text-[9px] text-dorado-600 font-bold uppercase tracking-wider mt-0.5">Control de Oficios v1.1</p>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { 
  Square2StackIcon, 
  DocumentPlusIcon, 
  ShieldCheckIcon, 
  ListBulletIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

defineEmits(['close'])
</script>
