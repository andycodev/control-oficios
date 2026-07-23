<template>
  <div class="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-hidden">

    <!-- Background decorations -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-slate-200/50 blur-3xl pointer-events-none"></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-full bg-white/40 blur-3xl pointer-events-none">
    </div>

    <!-- Main Container -->
    <div class="flex-grow flex items-center justify-center p-4 sm:p-6 md:py-12 relative z-10 w-full max-w-2xl mx-auto">

      <div
        class="w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden transition-all duration-500 border border-slate-100 p-6 sm:p-10 md:p-12">

        <!-- HEADER INSTITUCIONAL -->
        <div class="flex flex-col items-center text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">

          <!-- 1. Imagen de la Virgen -->
          <div class="relative mb-6 group">
            <div
              class="absolute inset-0 bg-amber-200 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500">
            </div>
            <img src="/images/virgen-de-angosto.jpg" alt="Virgen de Angosto"
              class="relative w-36 h-48 sm:w-44 sm:h-56 object-cover object-top rounded-[2rem] shadow-xl ring-4 ring-white border border-slate-100 transition-transform duration-500 group-hover:scale-[1.02]" />
          </div>

          <!-- 2. Nombre del comité -->
          <div class="space-y-2">
            <h1 class="text-[11px] sm:text-xs font-black text-slate-500 uppercase tracking-widest leading-relaxed">
              Comité de Fiesta Patronal 2026
            </h1>
            <h2
              class="text-xl sm:text-3xl font-outfit font-black text-slate-800 uppercase tracking-tight text-balance leading-tight">
              "Nuestra Señora Virgen de Angosto"
            </h2>
            <h3 class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Huaca Blanca - Chongoyape
            </h3>
          </div>
        </div>

        <div class="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-8"></div>

        <!-- BÚSQUEDA MANUAL -->
        <Transition name="fade" mode="out-in">
          <div v-if="!resultadoObtenido && !buscando" class="space-y-6 max-w-md mx-auto">
            <div class="text-center space-y-2 mb-6">
              <h3 class="text-lg font-black text-slate-800 tracking-tight font-outfit">Verifique la autenticidad de su
                documento.</h3>
              <p class="text-sm text-slate-500 font-medium leading-relaxed text-balance">
                Ingrese o pegue el Código de Verificación que aparece en la parte inferior derecha del documento, tal
                como se muestra en la imagen de referencia. Luego presione "Validar Documento" para consultar su
                autenticidad.
              </p>
            </div>

            <div class="space-y-4">
              <input v-model="codigoEntrada" type="text" placeholder="Ej. ECO2026-A7K9"
                class="w-full px-5 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50 text-sm font-bold text-slate-700 outline-none transition duration-200 hover:border-slate-200 focus:bg-white focus:ring-4 focus:ring-slate-500/10 focus:border-slate-400 uppercase text-center tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-normal"
                @keyup.enter="buscarDocumento()" />
              <button @click="buscarDocumento()" :disabled="!codigoEntrada || buscando"
                class="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xs uppercase tracking-widest py-4 rounded-2xl transition duration-200 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-slate-800/20">
                <MagnifyingGlassIcon class="w-5 h-5" />
                Validar Documento
              </button>
            </div>

            <!-- Ayuda visual: Dónde encontrar el código -->
            <div class="mt-8 bg-blue-50/50 border border-blue-100/60 rounded-3xl p-5 overflow-hidden">
              <div class="flex flex-col sm:flex-row gap-5 items-center">

                <!-- Columna de Texto -->
                <div class="flex-1 space-y-3 text-center sm:text-left">
                  <div class="flex items-center justify-center sm:justify-start gap-2">
                    <InformationCircleIcon class="w-5 h-5 text-blue-600" />
                    <h4 class="font-black text-slate-800 text-sm tracking-tight font-outfit">¿Dónde encuentro el Código?
                    </h4>
                  </div>
                  <p class="text-xs text-slate-600 leading-relaxed font-medium">
                    Revise la <span class="font-bold text-slate-800">parte inferior derecha</span> del documento.
                  </p>
                </div>

                <!-- Miniatura Clickable -->
                <div class="w-full max-w-[200px] relative group cursor-pointer" @click="modalAyudaAbierto = true">
                  <div
                    class="absolute -inset-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-3xl blur-lg opacity-40 group-hover:opacity-80 transition duration-300">
                  </div>
                  <div class="relative bg-white p-1 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <img src="/images/codigo-verificacion.png" alt="Miniatura del código"
                      class="w-full h-auto rounded-xl object-cover opacity-90 group-hover:opacity-100 transition duration-300" />
                    <div
                      class="absolute inset-0 bg-slate-900/5 group-hover:bg-slate-900/10 transition duration-300 rounded-2xl">
                    </div>
                    <div
                      class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                      <div class="bg-blue-600 text-white p-2.5 rounded-full shadow-xl">
                        <MagnifyingGlassIcon class="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <!-- CARGANDO -->
          <div v-else-if="buscando" class="flex flex-col items-center justify-center py-10 space-y-4">
            <svg class="animate-spin h-12 w-12 text-slate-800" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-80" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <p class="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">Verificando
              autenticidad...</p>
          </div>

          <!-- RESULTADOS -->
          <div v-else-if="resultadoObtenido" class="animate-in fade-in slide-in-from-bottom-4 duration-500">

            <!-- ESTADO 1: DOCUMENTO VÁLIDO -->
            <div v-if="estadoValidacion === 'VALIDO'" class="space-y-8">

              <div class="text-center space-y-4">
                <div class="flex justify-center">
                  <div class="relative">
                    <div class="absolute inset-0 bg-emerald-400 blur-xl opacity-20 rounded-full"></div>
                    <img src="/images/file-success.svg" alt="Éxito"
                      class="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                  </div>
                </div>
                <h3 class="text-2xl sm:text-3xl font-black text-emerald-600 uppercase tracking-tight font-outfit">
                  Documento Válido
                </h3>
              </div>

              <!-- Tarjeta de Información -->
              <div class="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 sm:p-8 space-y-5 shadow-inner">
                <div class="flex flex-col border-b border-slate-200/70 pb-4">
                  <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Tipo de
                    Documento</span>
                  <span class="text-sm sm:text-base font-bold text-slate-800">{{ documento?.tipo || 'Documento Oficial'
                  }}</span>
                </div>

                <div class="flex flex-col border-b border-slate-200/70 pb-4">
                  <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Dirigido a</span>
                  <span class="text-sm sm:text-base font-bold text-slate-800">
                    {{ documento?.destinatario || 'No especificado' }}
                  </span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-slate-200/70 pb-4">
                  <div class="flex flex-col">
                    <span
                      class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Correlativo</span>
                    <span class="text-sm sm:text-base font-bold text-slate-800">{{
                      obtenerCodigoVisible(documento?.correlativo) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Código de
                      Verificación</span>
                    <span
                      class="text-sm sm:text-base font-black text-slate-800 font-outfit uppercase tracking-widest">{{
                        documento?.codigo_verificacion || 'N/A' }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div v-if="documento?.creado_en" class="flex flex-col">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Fecha de
                      Emisión</span>
                    <span class="text-xs font-bold text-slate-600">{{ formatearFecha(documento.creado_en) }}</span>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Fecha de
                      Consulta</span>
                    <span class="text-xs font-bold text-slate-600">{{ fechaConsulta }}</span>
                  </div>
                </div>
              </div>

              <!-- Mensaje Institucional de Autenticidad -->
              <div class="text-center px-2 sm:px-8">
                <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed italic">
                  Este documento ha sido emitido oficialmente por el COMITÉ DE FIESTA PATRONAL 2026 "Nuestra Señora
                  Virgen de Angosto" de Huaca Blanca - Chongoyape y su autenticidad ha sido verificada correctamente
                  mediante este sistema.
                </p>
              </div>

              <div class="mt-8 pt-6 border-t border-slate-100 text-center space-y-8">
                <h4 class="text-xl sm:text-2xl font-outfit font-black text-slate-800 tracking-wide text-balance">
                  "Dios y la Virgen bendigan su hogar."
                </h4>

                <button @click="resetearVista"
                  class="mx-auto text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 px-6 py-3 rounded-full hover:bg-slate-100">
                  <ArrowPathIcon class="w-4 h-4" />
                  Realizar otra consulta
                </button>
              </div>

            </div>

            <!-- ESTADO 2: DOCUMENTO NO VÁLIDO -->
            <div v-else-if="estadoValidacion === 'NO_VALIDO'" class="space-y-8">

              <div class="text-center space-y-4">
                <div class="flex justify-center">
                  <div class="relative">
                    <div class="absolute inset-0 bg-red-400 blur-xl opacity-20 rounded-full"></div>
                    <img src="/images/file-error.svg" alt="Error"
                      class="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                  </div>
                </div>
                <h3 class="text-2xl sm:text-3xl font-black text-red-600 uppercase tracking-tight font-outfit">
                  Documento No Válido
                </h3>
              </div>

              <div
                class="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 sm:p-8 text-center space-y-6 shadow-inner">
                <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-sm mx-auto">
                  El documento consultado no registra una emisión oficial en el sistema del COMITÉ DE FIESTA PATRONAL
                  2026 "Nuestra Señora Virgen de Angosto" de Huaca Blanca - Chongoyape. Por lo tanto, no es posible
                  confirmar su autenticidad ni que haya sido generado por este comité.
                </p>
                <div class="pt-6 border-t border-slate-200/70 inline-block px-8">
                  <span class="block text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Fecha de
                    Consulta</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800">{{ fechaConsulta }}</span>
                </div>
              </div>

              <div class="mt-8 text-center">
                <button @click="resetearVista"
                  class="mx-auto text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 px-6 py-3 rounded-full hover:bg-slate-100">
                  <ArrowPathIcon class="w-4 h-4" />
                  Realizar otra consulta
                </button>
              </div>

            </div>

            <!-- ESTADO 3: DOCUMENTO ANULADO -->
            <div v-else-if="estadoValidacion === 'ANULADO'" class="space-y-8">

              <div class="text-center space-y-4">
                <div class="flex justify-center">
                  <div class="relative">
                    <div class="absolute inset-0 bg-amber-400 blur-xl opacity-20 rounded-full"></div>
                    <img src="/images/file-warning.svg" alt="Advertencia"
                      class="relative w-20 h-20 sm:w-24 sm:h-24 drop-shadow-md" />
                  </div>
                </div>
                <h3 class="text-2xl sm:text-3xl font-black text-amber-600 uppercase tracking-tight font-outfit">
                  Documento Anulado
                </h3>
              </div>

              <div
                class="bg-slate-50 border border-slate-100 rounded-[2rem] p-6 sm:p-8 text-center space-y-6 shadow-inner">
                <p class="text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-sm mx-auto">
                  Este documento fue emitido originalmente por el COMITÉ DE FIESTA PATRONAL 2026 "Nuestra Señora Virgen
                  de Angosto" de Huaca Blanca - Chongoyape; sin embargo, actualmente se encuentra ANULADO, por lo que ha
                  perdido su validez y no debe utilizarse como documento oficial.
                </p>
                <div class="pt-6 border-t border-slate-200/70 inline-block px-8">
                  <span class="block text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Fecha de
                    Consulta</span>
                  <span class="text-xs sm:text-sm font-bold text-slate-800">{{ fechaConsulta }}</span>
                </div>
              </div>

              <div class="mt-8 text-center">
                <button @click="resetearVista"
                  class="mx-auto text-[10px] font-black text-slate-400 hover:text-slate-700 uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5 px-6 py-3 rounded-full hover:bg-slate-100">
                  <ArrowPathIcon class="w-4 h-4" />
                  Realizar otra consulta
                </button>
              </div>

            </div>

          </div>
        </Transition>
      </div>
    </div>

    <!-- Modal de Ayuda Visual -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="modalAyudaAbierto"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          @click.self="modalAyudaAbierto = false">
          <div
            class="bg-white rounded-[2rem] p-5 sm:p-6 w-full max-w-4xl shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200">

            <div class="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
              <div class="flex items-center gap-3">
                <div class="bg-blue-50 text-blue-600 p-2 rounded-xl">
                  <InformationCircleIcon class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="font-black text-slate-800 uppercase text-sm sm:text-base tracking-tight font-outfit">Código
                    de Verificación</h3>
                  <p class="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Ubicación
                    en el documento oficial</p>
                </div>
              </div>
              <button @click="modalAyudaAbierto = false"
                class="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors">
                <XCircleIcon class="w-6 h-6 sm:w-7 sm:h-7" />
              </button>
            </div>

            <div
              class="relative bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex-1 min-h-[40vh] flex">
              <div
                class="w-full overflow-auto overscroll-contain flex justify-start sm:justify-center items-center p-2 sm:p-4"
                dir="rtl">
                <div class="relative min-w-[550px] sm:min-w-0 sm:max-w-full flex-shrink-0" dir="ltr">
                  <img src="/images/codigo-verificacion.png" alt="Ejemplo ampliado"
                    class="w-full sm:w-auto sm:max-w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-sm mx-auto" />
                  <div class="absolute bottom-[10%] right-[10%] sm:bottom-[12%] sm:right-[12%] pointer-events-none">
                    <span class="flex h-5 w-5 sm:h-6 sm:w-6">
                      <span
                        class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span
                        class="relative inline-flex rounded-full h-5 w-5 sm:h-6 sm:w-6 bg-blue-500 shadow-xl shadow-blue-500/50 border-2 border-white"></span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-5 flex justify-center">
              <button @click="modalAyudaAbierto = false"
                class="bg-slate-800 hover:bg-slate-900 text-white font-extrabold px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest transition duration-150 active:scale-95 shadow-lg shadow-slate-800/10">
                Entendido
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { MagnifyingGlassIcon, ArrowPathIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const route = useRoute()
const codigoEntrada = ref('')
const buscando = ref(false)
const resultadoObtenido = ref(false)
const documento = ref(null)
const errorValidacionToken = ref(false)
const fechaConsulta = ref('')
const modalAyudaAbierto = ref(false)

const estadoValidacion = computed(() => {
  if (!documento.value) return 'NO_VALIDO'
  if (errorValidacionToken.value) return 'NO_VALIDO'
  if (documento.value.estado === 'Anulado') return 'ANULADO'
  return 'VALIDO'
})

// Formatear correlativo como el código visible OF-2026-000001-HB
const obtenerCodigoVisible = (correlativo) => {
  if (!correlativo) return 'N/A'
  return `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
}

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-PE') + ' a las ' + fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

const generarFechaConsulta = () => {
  const ahora = new Date()
  fechaConsulta.value = ahora.toLocaleDateString('es-PE') + ' a las ' + ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

onMounted(async () => {
  const codigoUrl = route.query.codigo
  const tokenUrl = route.query.token
  if (codigoUrl) {
    codigoEntrada.value = codigoUrl
    await buscarDocumento(tokenUrl)
  }
})

const resetearVista = () => {
  codigoEntrada.value = ''
  resultadoObtenido.value = false
  documento.value = null
  errorValidacionToken.value = false
  fechaConsulta.value = ''
}

const buscarDocumento = async (tokenUrl = null) => {
  const input = codigoEntrada.value.trim().toUpperCase()
  if (!input) return

  buscando.value = true
  resultadoObtenido.value = false
  documento.value = null
  errorValidacionToken.value = false

  try {
    const { data, error } = await supabase
      .from('oficios')
      .select('*')
      .eq('codigo_verificacion', input)
      .maybeSingle()

    if (error) throw error

    if (data) {
      if (!data.token_validacion) {
        // Documento antiguo o manual sin token
        documento.value = data
      } else {
        if (tokenUrl) {
          if (data.token_validacion === tokenUrl) {
            documento.value = data
          } else {
            // Token incorrecto
            documento.value = null
            errorValidacionToken.value = true
          }
        } else {
          // Búsqueda manual
          documento.value = data
        }
      }
    } else {
      // Documento no encontrado
      documento.value = null
    }

    generarFechaConsulta()
    resultadoObtenido.value = true
  } catch (err) {
    console.error('Error al realizar búsqueda:', err.message)
    documento.value = null
    generarFechaConsulta()
    resultadoObtenido.value = true
  } finally {
    buscando.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
