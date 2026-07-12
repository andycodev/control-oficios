<template>
  <div class="space-y-4 md:space-y-6 lg:space-y-8 font-sans pb-10">
    <!-- Encabezado de la Página -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4 md:pb-6">
      <div>
        <h1 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-outfit uppercase">Control de Oficios</h1>
        <p class="text-xs text-slate-400 font-extrabold uppercase tracking-widest mt-1">Gestión y control de correspondencia institucional</p>
      </div>
      <router-link 
        to="/nuevo-oficio" 
        class="bg-gradient-to-r from-jade-600 to-jade-500 hover:from-jade-700 hover:to-jade-600 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl shadow-xl shadow-jade-600/10 hover:shadow-jade-600/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center gap-2 self-stretch sm:self-auto justify-center min-h-[44px]"
      >
        <PlusIcon class="w-5 h-5" />
        <span>Nuevo Oficio</span>
      </router-link>
    </div>

    <!-- Sección KPIs: 5 Indicadores Requeridos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <!-- 1. Total Generados -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-slate-200">
        <div class="space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Generados</span>
          <h3 class="text-3xl font-black text-slate-900 leading-none font-outfit">{{ totalEmitidos }}</h3>
          <p class="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Registrados en sistema</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center border border-slate-100">
          <DocumentDuplicateIcon class="w-6 h-6" />
        </div>
      </div>

      <!-- 2. Oficios Pendientes -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-amber-200">
        <div class="space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Pendientes</span>
          <h3 class="text-3xl font-black text-amber-600 leading-none font-outfit">{{ totalPendientes }}</h3>
          <p class="text-[9px] text-amber-600 font-bold uppercase tracking-wider">Por enviar / entregar</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-amber-50/50 text-amber-600 flex items-center justify-center border border-amber-100/50">
          <ClockIcon class="w-6 h-6" />
        </div>
      </div>

      <!-- 3. Oficios Entregados -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-blue-200">
        <div class="space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Entregados</span>
          <h3 class="text-3xl font-black text-blue-600 leading-none font-outfit">{{ totalSoloEntregados }}</h3>
          <p class="text-[9px] text-blue-600 font-bold uppercase tracking-wider">En espera de respuesta</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-blue-50/50 text-blue-600 flex items-center justify-center border border-blue-100/50">
          <PaperAirplaneIcon class="w-6 h-6" />
        </div>
      </div>

      <!-- 4. Oficios con Respuesta Recibida -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-green-200">
        <div class="space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Con Respuesta</span>
          <h3 class="text-3xl font-black text-green-600 leading-none font-outfit">{{ totalSoloRespuesta }}</h3>
          <p class="text-[9px] text-green-600 font-bold uppercase tracking-wider">Trámite completado</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-green-50/50 text-green-600 flex items-center justify-center border border-green-100/50">
          <ChatBubbleLeftRightIcon class="w-6 h-6" />
        </div>
      </div>

      <!-- 5. Oficios Anulados -->
      <div class="bg-white border border-slate-100 rounded-3xl p-4 shadow-sm flex items-center justify-between transition-all duration-300 hover:shadow-md hover:border-red-200">
        <div class="space-y-1">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Anulados</span>
          <h3 class="text-3xl font-black text-red-600 leading-none font-outfit">{{ totalAnulados }}</h3>
          <p class="text-[9px] text-red-600 font-bold uppercase tracking-wider">Sin validez legal</p>
        </div>
        <div class="w-11 h-11 rounded-xl bg-red-50/50 text-red-600 flex items-center justify-center border border-red-100/50">
          <NoSymbolIcon class="w-6 h-6" />
        </div>
      </div>
    </div>

    <!-- Sección: Relación entre Entregados y Respondidos (Control de Trámite) -->
    <div class="bg-white border border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm space-y-6">
      <div class="border-b border-slate-50 pb-3">
        <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight font-outfit">Control de Avance de Trámite</h2>
        <p class="text-xs text-slate-400 font-semibold mt-0.5">Seguimiento de respuesta para documentos oficialmente notificados</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <!-- Sub-KPIs de la Relación -->
        <div class="md:col-span-1 grid grid-cols-2 gap-4">
          <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
            <span class="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Total Enviados</span>
            <span class="text-2xl font-black text-slate-800 font-outfit">{{ totalEnviados }}</span>
            <p class="text-[8px] text-slate-400 font-extrabold uppercase mt-1">Entregados + Respuesta</p>
          </div>
          <div class="bg-amber-50/30 border border-amber-100/50 rounded-2xl p-4 text-center">
            <span class="text-[10px] font-black uppercase text-amber-700 tracking-wider block mb-1">Pendientes Respuesta</span>
            <span class="text-2xl font-black text-amber-600 font-outfit">{{ totalSoloEntregados }}</span>
            <p class="text-[8px] text-amber-500 font-extrabold uppercase mt-1">Esperando contestación</p>
          </div>
        </div>

        <!-- Barra de Progreso y Medición de Tasa de Respuesta -->
        <div class="md:col-span-2 space-y-4 bg-slate-50/50 border border-slate-100 rounded-3xl p-5">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <span class="text-xs font-black uppercase text-slate-800 tracking-wider">Tasa de Respuesta</span>
              <p class="text-[10px] text-slate-400 font-medium">Porcentaje de éxito sobre oficios entregados</p>
            </div>
            <span class="text-2xl font-black text-jade-700 font-outfit">{{ porcentajeRespuesta }}%</span>
          </div>

          <!-- Barra de Progreso Dinámica -->
          <div class="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-300/30">
            <div 
              class="bg-gradient-to-r from-jade-600 to-jade-500 h-full rounded-full transition-all duration-500 ease-out" 
              :style="{ width: porcentajeRespuesta + '%' }"
            ></div>
          </div>

          <div class="flex justify-between text-[9px] text-slate-500 font-extrabold uppercase tracking-wide">
            <span>{{ totalSoloRespuesta }} Oficios Respondidos</span>
            <span>Meta: 100%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de Reportes y Estadísticas de Distribución -->
    <div class="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-6">
      <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight font-outfit">Reportes de Distribución</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Económicos -->
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Oficio Económico</p>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-800">{{ statsPorTipo.Economico }}</span>
            <span class="text-[10px] text-slate-500 font-bold">({{ calcularPorcentaje(statsPorTipo.Economico) }}%)</span>
          </div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-amber-500 h-full rounded-full" :style="{ width: calcularPorcentaje(statsPorTipo.Economico) + '%' }"></div>
          </div>
        </div>

        <!-- Específicos -->
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Oficio Específico</p>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-800">{{ statsPorTipo.Especifico }}</span>
            <span class="text-[10px] text-slate-500 font-bold">({{ calcularPorcentaje(statsPorTipo.Especifico) }}%)</span>
          </div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-purple-500 h-full rounded-full" :style="{ width: calcularPorcentaje(statsPorTipo.Especifico) + '%' }"></div>
          </div>
        </div>

        <!-- Invitaciones -->
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Oficio Invitación</p>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-800">{{ statsPorTipo.Invitacion }}</span>
            <span class="text-[10px] text-slate-500 font-bold">({{ calcularPorcentaje(statsPorTipo.Invitacion) }}%)</span>
          </div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-teal-500 h-full rounded-full" :style="{ width: calcularPorcentaje(statsPorTipo.Invitacion) + '%' }"></div>
          </div>
        </div>

        <!-- Deportes -->
        <div class="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
          <p class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Oficio Deportes</p>
          <div class="flex items-baseline justify-between">
            <span class="text-2xl font-black text-slate-800">{{ statsPorTipo.Deportes }}</span>
            <span class="text-[10px] text-slate-500 font-bold">({{ calcularPorcentaje(statsPorTipo.Deportes) }}%)</span>
          </div>
          <div class="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div class="bg-indigo-500 h-full rounded-full" :style="{ width: calcularPorcentaje(statsPorTipo.Deportes) + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { 
  PlusIcon,
  DocumentDuplicateIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  NoSymbolIcon
} from '@heroicons/vue/24/outline'

const oficios = ref([])

// Métricas principales
const totalEmitidos = computed(() => oficios.value.length)
const totalPendientes = computed(() => oficios.value.filter(o => o.estado === 'Emitido').length)
const totalSoloEntregados = computed(() => oficios.value.filter(o => o.estado === 'Entregado').length)
const totalSoloRespuesta = computed(() => oficios.value.filter(o => o.estado === 'Con Respuesta').length)
const totalAnulados = computed(() => oficios.value.filter(o => o.estado === 'Anulado').length)

// Relación entregados vs respondidos
const totalEnviados = computed(() => totalSoloEntregados.value + totalSoloRespuesta.value)
const porcentajeRespuesta = computed(() => {
  if (totalEnviados.value === 0) return 0
  return Math.round((totalSoloRespuesta.value / totalEnviados.value) * 100)
})

// Estadísticas de tipologías
const statsPorTipo = computed(() => {
  return {
    Economico: oficios.value.filter(o => o.tipo === 'Económico').length,
    Especifico: oficios.value.filter(o => o.tipo === 'Específico').length,
    Invitacion: oficios.value.filter(o => o.tipo === 'Invitación').length,
    Deportes: oficios.value.filter(o => o.tipo === 'Deportes').length
  }
})

const calcularPorcentaje = (cantidad) => {
  if (totalEmitidos.value === 0) return 0
  return Math.round((cantidad / totalEmitidos.value) * 100)
}

const cargarOficios = async () => {
  try {
    const { data, error } = await supabase
      .from('oficios')
      .select('*')
      .order('correlativo', { ascending: false })

    if (error) throw error
    oficios.value = data || []
  } catch (err) {
    showNotification('Error al cargar oficios: ' + err.message, 'alert-error')
  }
}

let channel = null
const suscribirTiempoReal = () => {
  channel = supabase
    .channel('cambios-dashboard-stats')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'oficios' }, () => {
      cargarOficios()
    })
    .subscribe()
}

onMounted(() => {
  cargarOficios()
  suscribirTiempoReal()
})

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
})
</script>
