<template>
  <div class="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 relative overflow-hidden flex flex-col justify-between font-sans">
    <!-- Círculos de fondo -->
    <div class="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-jade-100/30 blur-3xl"></div>
    <div class="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-dorado-100/30 blur-3xl"></div>

    <div class="w-full max-w-xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-2xl p-6 md:p-10 relative z-10 my-auto transition-all duration-300 hover:shadow-jade-100/10">
      
      <!-- Encabezado -->
      <div class="text-center mb-10">
        <span class="px-4 py-1.5 bg-jade-50 border border-jade-100 text-jade-600 rounded-full text-[10px] font-black uppercase tracking-widest">
          Portal Ciudadano de Validación
        </span>
        <h1 class="text-3xl font-black text-slate-900 tracking-tight mt-4 font-outfit uppercase">Verificador de Documentos</h1>
        <p class="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1.5">Consulte la validez oficial de los oficios institucionales emitidos</p>
      </div>

      <!-- Buscador Manual por Código de Oficio (Sin campos tediosos de token) -->
      <div class="space-y-4 mb-10 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
        <div class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Código de Oficio</label>
            <input 
              v-model="codigoEntrada" 
              type="text" 
              placeholder="Ej. COD2026-A7K9" 
              class="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase"
              @keyup.enter="buscarDocumento()"
            />
          </div>

          <button 
            @click="buscarDocumento()" 
            :disabled="buscando || !codigoEntrada"
            class="w-full bg-jade-600 hover:bg-jade-700 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none min-h-[48px] flex items-center justify-center gap-2"
          >
            <ShieldCheckIcon class="w-5 h-5" />
            <span>Validar Documento</span>
          </button>
        </div>
      </div>

      <!-- Spinner de Búsqueda -->
      <div v-if="buscando" class="flex flex-col items-center py-12">
        <svg class="animate-spin h-10 w-10 text-jade-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-xs text-slate-500 font-bold uppercase tracking-wider">Consultando en el servidor seguro...</p>
      </div>

      <!-- Resultados -->
      <Transition name="fade" mode="out-in">
        <div v-if="resultadoObtenido && !buscando">
          
          <!-- CASO 1: No encontrado, no auténtico o alterado -->
          <div v-if="documento === null" class="bg-red-50/50 border border-red-100 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 shadow-sm">
              <XCircleIcon class="w-9 h-9" />
            </div>
            <h2 class="text-lg font-black text-red-800 uppercase tracking-tight font-outfit">Documento no válido</h2>
            <p class="text-xs text-red-600 font-extrabold leading-relaxed max-w-sm mx-auto">
              Este documento no fue emitido por el sistema oficial o ha sido alterado. Por lo tanto, no puede considerarse un oficio válido.
            </p>
          </div>

          <!-- CASO 2: Documento Anulado -->
          <div v-else-if="documento.estado === 'Anulado'" class="bg-red-50/50 border border-red-100 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto border border-red-200 shadow-sm">
              <ExclamationTriangleIcon class="w-9 h-9" />
            </div>
            <h2 class="text-lg font-black text-red-800 uppercase tracking-tight font-outfit">Documento Anulado</h2>
            <p class="text-xs text-red-600 font-semibold leading-relaxed max-w-sm mx-auto font-sans">
              Este oficio ({{ obtenerCodigoVisible(documento.correlativo) }}) ha sido anulado formalmente en nuestro sistema. Ya no cuenta con validez oficial ni representación institucional.
            </p>
            <div class="pt-4 border-t border-red-200 flex flex-col gap-2 text-left text-xs font-bold text-slate-700">
              <div class="flex justify-between border-b border-red-100/50 pb-2">
                <span class="text-slate-400">Código de Oficio:</span>
                <span>{{ obtenerCodigoVisible(documento.correlativo) }}</span>
              </div>
              <div v-if="documento.codigo_verificacion" class="flex justify-between border-b border-red-100/50 pb-2">
                <span class="text-slate-400">Código de Verificación:</span>
                <span class="text-red-700 font-extrabold uppercase font-outfit">{{ documento.codigo_verificacion }}</span>
              </div>
              <div class="flex justify-between border-b border-red-100/50 pb-2">
                <span class="text-slate-400">Tipo de Documento:</span>
                <span>{{ documento.tipo }}</span>
              </div>
              <div class="flex justify-between border-b border-red-100/50 pb-2">
                <span class="text-slate-400">Destinatario original:</span>
                <span class="text-right">{{ documento.destinatario }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Fecha de Registro:</span>
                <span>{{ formatearFecha(documento.creado_en) }}</span>
              </div>
            </div>
          </div>

          <!-- CASO 3: Formato Vacío (Llenado Manual / Blanco) -->
          <div v-else-if="documento.es_formato_vacio" class="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto border border-blue-200 shadow-sm">
              <PencilSquareIcon class="w-9 h-9" />
            </div>
            
            <h2 class="text-lg font-black text-blue-800 uppercase tracking-tight font-outfit">Documento Válido - Llenado Manual</h2>
            
            <!-- Banner de Alerta para Registro Histórico -->
            <div v-if="esRegistroHistorico" class="bg-amber-100/50 border border-amber-200 text-amber-800 rounded-2xl p-3 text-[10px] font-black text-center uppercase tracking-wide">
              Registro Histórico (Migrado sin firma digital tokenizada)
            </div>



            <p class="text-xs text-blue-600 font-semibold leading-relaxed max-w-sm mx-auto">
              El código consultado corresponde a una plantilla en blanco generada por el sistema para llenado manual. Se autorizó la redacción manuscrita del documento físico.
            </p>
            
            <div class="bg-blue-100/30 border border-blue-200/30 rounded-2xl p-4 text-[10px] text-blue-800 font-bold leading-normal text-left flex items-start gap-2">
              <InformationCircleIcon class="w-4 h-4 text-blue-800 flex-shrink-0 mt-0.5" />
              <p><strong>Importante para el ciudadano:</strong> Para verificar la autenticidad total de este documento, asegúrese de que cuente con las firmas y sellos físicos autorizados del personal administrativo correspondiente.</p>
            </div>

            <div class="pt-4 border-t border-blue-200 flex flex-col gap-2.5 text-left text-xs font-bold text-slate-700">
              <div class="flex justify-between border-b border-blue-100/50 pb-2">
                <span class="text-slate-400">Código de Oficio (Correlativo):</span>
                <span>{{ obtenerCodigoVisible(documento.correlativo) }}</span>
              </div>
              <div v-if="documento.codigo_verificacion" class="flex justify-between border-b border-blue-100/50 pb-2">
                <span class="text-slate-400">Código de Verificación:</span>
                <span class="text-blue-700 font-extrabold uppercase font-outfit">{{ documento.codigo_verificacion }}</span>
              </div>
              <div class="flex justify-between border-b border-blue-100/50 pb-2">
                <span class="text-slate-400">Tipo de Formato:</span>
                <span>{{ documento.tipo }}</span>
              </div>
              <div class="flex justify-between border-b border-blue-100/50 pb-2">
                <span class="text-slate-400">Estado en Sistema:</span>
                <span class="uppercase text-blue-700 font-extrabold">{{ documento.estado }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-400">Fecha de Emisión:</span>
                <span>{{ formatearFecha(documento.creado_en) }}</span>
              </div>
            </div>
          </div>

          <!-- CASO 4: Válido Digital (Página Profesional de Validación) -->
          <div v-else class="bg-green-50/50 border border-green-100 rounded-3xl p-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div class="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto border border-green-200 shadow-sm">
              <CheckCircleIcon class="w-9 h-9" />
            </div>
            
            <span class="px-3.5 py-1 bg-green-100 text-green-800 border border-green-200 rounded-full text-[10px] font-black uppercase tracking-widest">
              Estado: Documento válido
            </span>

            <!-- Banner de Alerta para Registro Histórico -->
            <div v-if="esRegistroHistorico" class="bg-amber-100/50 border border-amber-200 text-amber-800 rounded-2xl p-3 text-[10px] font-black text-center mt-3 uppercase tracking-wide">
              Registro Histórico (Migrado sin firma digital tokenizada)
            </div>



            <p class="text-xs text-green-600 font-semibold leading-relaxed max-w-sm mx-auto mt-2">
              El oficio consultado es auténtico y coincide con los registros digitales oficiales de la institución.
            </p>

            <div class="pt-4 border-t border-green-200 flex flex-col gap-2.5 text-left text-xs font-bold text-slate-700">
              <!-- Código del oficio -->
              <div class="flex justify-between border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Código de Oficio (Correlativo):</span>
                <span>{{ obtenerCodigoVisible(documento.correlativo) }}</span>
              </div>
              <div v-if="documento.codigo_verificacion" class="flex justify-between border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Código de Verificación:</span>
                <span class="text-jade-700 font-extrabold uppercase font-outfit">{{ documento.codigo_verificacion }}</span>
              </div>
              
              <!-- Tipo de oficio -->
              <div class="flex justify-between border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Tipo de Oficio:</span>
                <span>{{ documento.tipo }}</span>
              </div>
              
              <!-- Destinatario -->
              <div class="flex flex-col border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Destinatario:</span>
                <span class="text-slate-800 mt-0.5">{{ documento.destinatario }}</span>
              </div>
              
              <!-- Detalles del Asunto -->
              <div class="flex flex-col border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Detalles del Asunto:</span>
                <span class="text-slate-800 mt-0.5 whitespace-pre-wrap">{{ documento.asunto }}</span>
              </div>

              <!-- Autoridad emisora -->
              <div class="flex justify-between border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Autoridad Emisora:</span>
                <span class="lowercase text-slate-600 text-[10px]">{{ documento.creado_por }}</span>
              </div>
              
              <!-- Fecha de emisión -->
              <div class="flex justify-between border-b border-green-100/50 pb-2">
                <span class="text-slate-400">Fecha de Emisión:</span>
                <span>{{ formatearFecha(documento.creado_en) }}</span>
              </div>

              <!-- Fecha y hora de validación -->
              <div class="flex justify-between">
                <span class="text-slate-400">Fecha y Hora de Validación:</span>
                <span class="text-slate-800">{{ obtenerFechaHoraValidacion() }}</span>
              </div>
            </div>
          </div>

        </div>
      </Transition>
      
      <!-- Enlace para volver o iniciar sesión -->
      <div class="text-center mt-10 pt-6 border-t border-slate-100">
        <router-link 
          to="/login" 
          class="text-xs font-black text-jade-700 hover:text-jade-900 uppercase tracking-widest transition-colors flex items-center justify-center gap-1.5"
        >
          <LockClosedIcon class="w-4 h-4 text-jade-700" />
          <span>Acceder al Panel Administrativo</span>
        </router-link>
      </div>

    </div>

    <!-- Footer público -->
    <div class="text-center pt-8 text-slate-400 text-[9px] font-black uppercase tracking-widest relative z-10">
      República del Perú · Gobierno Regional
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { 
  ShieldCheckIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  LockClosedIcon, 
  InformationCircleIcon, 
  PencilSquareIcon, 
  CheckCircleIcon 
} from '@heroicons/vue/24/outline'

const route = useRoute()
const codigoEntrada = ref('')
const buscando = ref(false)
const resultadoObtenido = ref(false)
const documento = ref(null)
const esRegistroHistorico = ref(false)
const tokenValidado = ref(false)

// Formatear correlativo como el código visible OF-2026-000001-HB
const obtenerCodigoVisible = (correlativo) => {
  return `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
}

onMounted(async () => {
  const codigoUrl = route.query.codigo
  const tokenUrl = route.query.token
  if (codigoUrl) {
    codigoEntrada.value = codigoUrl
    await buscarDocumento(tokenUrl)
  }
})

// Ejecutar búsqueda exclusivamente por el código de verificación
const buscarDocumento = async (tokenUrl = null) => {
  const input = codigoEntrada.value.trim().toUpperCase()
  if (!input) {
    showNotification('Ingrese el código de verificación', 'alert-warning')
    return
  }

  // Validar formato del código ingresado (ej. ECO2026-X7Y9)
  const regexNew = /^[A-Z]{2,4}\d{4}-[A-Z0-9]{4,5}$/i
  
  if (!regexNew.test(input)) {
    showNotification('Formato de código inválido. Debe ser como ECO2026-A7K9', 'alert-warning')
    return
  }

  buscando.value = true
  resultadoObtenido.value = false
  documento.value = null
  esRegistroHistorico.value = false
  tokenValidado.value = false
  let errorValidacionToken = false

  try {
    const { data, error } = await supabase
      .from('oficios')
      .select('*')
      .eq('codigo_verificacion', input)
      .maybeSingle()

    if (error) throw error

    if (data) {
      if (!data.token_validacion) {
        esRegistroHistorico.value = true
        tokenValidado.value = true
        documento.value = data
      } else {
        if (tokenUrl) {
          if (data.token_validacion === tokenUrl) {
            documento.value = data
            tokenValidado.value = true
          } else {
            documento.value = null
            errorValidacionToken = true
          }
        } else {
          documento.value = data
          tokenValidado.value = false
        }
      }
    } else {
      documento.value = null
    }

    resultadoObtenido.value = true

    if (errorValidacionToken) {
      showNotification('¡Alerta! Firma digital inválida o documento alterado.', 'alert-error')
    }
  } catch (err) {
    showNotification('Error al realizar búsqueda: ' + err.message, 'alert-error')
  } finally {
    buscando.value = false
  }
}

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-PE') + ' a las ' + fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

const obtenerFechaHoraValidacion = () => {
  const ahora = new Date()
  return ahora.toLocaleDateString('es-PE') + ' a las ' + ahora.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}
</script>
