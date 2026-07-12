<template>
  <div class="max-w-2xl mx-auto space-y-4 md:space-y-6 font-sans">
    <!-- Encabezado de la Vista -->
    <div class="flex items-center gap-3 border-b border-slate-100 pb-4">
      <router-link to="/dashboard"
        class="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors active:scale-95 flex items-center justify-center">
        <ArrowLeftIcon class="w-5 h-5" />
      </router-link>
      <div>
        <h1 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-outfit uppercase">Emisión de Oficio
        </h1>
        <p class="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-0.5">Gestión de firmas
          digitales y códigos QR por token de validación</p>
      </div>
    </div>

    <!-- Tarjeta Principal del Formulario -->
    <div class="bg-white border border-slate-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm space-y-6">

      <!-- Banner Informativo Diagnóstico -->
      <div class="bg-amber-50/50 border border-amber-200 rounded-2xl p-4 text-amber-800 flex items-start gap-3">
        <div
          class="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 border border-amber-200/50">
          <InformationCircleIcon class="w-5 h-5 text-amber-800" />
        </div>
        <div class="text-[11px] font-semibold leading-relaxed">
          <p class="uppercase font-black text-amber-900">Alineación y Calibración PDF</p>
          <p class="mt-0.5">
            Utiliza las cuadrículas milimétricas para calibrar:
            <a href="/plantillas/diagnostico/diag-economico.pdf" target="_blank"
              class="underline font-black text-amber-950">Económico</a>,
            <a href="/plantillas/diagnostico/diag-especifico.pdf" target="_blank"
              class="underline font-black text-amber-950">Específico</a>,
            <a href="/plantillas/diagnostico/diag-invitacion.pdf" target="_blank"
              class="underline font-black text-amber-950">Invitación</a> o
            <a href="/plantillas/diagnostico/diag-deporte.pdf" target="_blank"
              class="underline font-black text-amber-950">Deportes</a>.
          </p>
        </div>
      </div>

      <form @submit.prevent="generarOficio" class="space-y-6">

        <!-- Tipo de Oficio Primario y Formato Vacío -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Oficio</label>
            <select v-model="formulario.tipo" required
              class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-extrabold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500">
              <option value="Económico">Económico</option>
              <option value="Específico">Específico</option>
              <option value="Invitación">Invitación</option>
              <option value="Deportes">Deportes</option>
            </select>
          </div>

          <div class="flex items-center sm:pt-6 pl-1">
            <label class="relative flex items-center gap-3 cursor-pointer select-none">
              <input v-model="formulario.es_formato_vacio" type="checkbox" class="sr-only peer" />
              <div
                class="relative flex-shrink-0 w-10 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-jade-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-jade-600">
              </div>
              <span class="text-[11px] font-black text-slate-600 uppercase tracking-wide">¿Oficio en Blanco? (Llenado
                Manual)</span>
            </label>
          </div>
        </div>

        <!-- Selectores Especiales según Tipo de Oficio -->
        <div v-if="formulario.tipo === 'Invitación' || formulario.tipo === 'Deportes'"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 animate-in fade-in duration-200">

          <!-- Sub-Selector para Invitación: Tipo de destinatario -->
          <div v-if="formulario.tipo === 'Invitación'" class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Tipo de Destinatario</label>
            <select v-model="invitacionMeta.tipoDestinatario"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-extrabold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500">
              <option value="Persona">Persona</option>
              <option value="Institución">Institución</option>
            </select>
          </div>

          <!-- Sub-Selector para Deportes: Disciplina -->
          <div v-if="formulario.tipo === 'Deportes'" class="space-y-1.5">
            <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Disciplina Deportiva</label>
            <select v-model="deporteMeta.disciplina" @change="actualizarPretextoDeporte"
              class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-extrabold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500">
              <option value="Fulbito Femenino">Fulbito Femenino</option>
              <option value="Fulbito Máster">Fulbito Máster</option>
              <option value="Fútbol Libre">Fútbol Libre</option>
              <option value="Vóley Mixto">Vóley Mixto</option>
            </select>
          </div>
        </div>

        <div class="border-t border-slate-100 my-1"></div>

        <!-- Inputs Dinámicos Basados en el Tipo Seleccionado (Solo si no es formato vacío) -->
        <Transition name="fade" mode="out-in">
          <div v-if="!formulario.es_formato_vacio" :key="formulario.tipo" class="space-y-6">
            <!-- CASO A: OFICIO ECONÓMICO -->
            <div v-if="formulario.tipo === 'Económico'" class="space-y-3">
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la persona</label>
                <input v-model="economicoMeta.nombre" type="text" required placeholder="Ej. JUAN PEREZ MARTINEZ"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase" />
              </div>
            </div>

            <!-- CASO B: OFICIO ESPECÍFICO -->
            <div v-if="formulario.tipo === 'Específico'" class="space-y-4">
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la persona</label>
                <input v-model="especificoMeta.nombre" type="text" required placeholder="Ej. CARLOS TORRES VÁSQUEZ"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase" />
              </div>
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Asunto del Oficio</label>
                <textarea v-model="especificoMeta.asunto" rows="3" required
                  placeholder="Escriba el asunto específico que se imprimirá en el documento..."
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 resize-none"></textarea>
              </div>
            </div>

            <!-- CASO C: OFICIO DE INVITACIÓN -->
            <div v-if="formulario.tipo === 'Invitación'" class="space-y-4">
              <!-- Nombre Dinámico (Persona o Institución) -->
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">
                  {{ invitacionMeta.tipoDestinatario === 'Persona' ? 'Nombre de la persona' : 'Nombre de la institución'
                  }}
                </label>
                <input v-model="invitacionMeta.nombre" type="text" required
                  :placeholder="invitacionMeta.tipoDestinatario === 'Persona' ? 'Ej. ANA LUISA DIAZ' : 'POLICÍA NACIONAL DEL PERÚ'"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase" />
              </div>

              <!-- Motivo -->
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">
                  {{ invitacionMeta.tipoDestinatario === 'Persona' ? 'Escribe el motivo de la invitación para:' :
                    'Motivo de la invitación' }}
                </label>
                <textarea v-model="invitacionMeta.motivo" rows="3" required
                  :placeholder="invitacionMeta.tipoDestinatario === 'Persona' ? 'Asistir a la asamblea general de fin de año' : 'PARTICIPAR EN EL DESFILE POR LA FIESTA PATRONAL EN HONOR A NUESTRA SEÑORA VIRGEN DE ANGOSTO'"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 resize-none"></textarea>
              </div>
            </div>

            <!-- CASO D: OFICIOS DEPORTIVOS -->
            <div v-if="formulario.tipo === 'Deportes'" class="space-y-4">
              <!-- Nombre de la persona a invitar -->
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la persona a
                  invitar</label>
                <input v-model="deporteMeta.nombre" type="text" required placeholder="Ej. RAÚL HERRERA GÓMEZ"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase" />
              </div>

              <!-- Descripción -->
              <div class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Descripción de la
                  invitación</label>
                <textarea v-model="deporteMeta.descripcion" rows="4" required
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 resize-none"></textarea>
              </div>
            </div>
          </div>

          <!-- Si el checkbox está activo (Formato vacío para llenado manual) -->
          <div v-else
            class="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-blue-700 flex items-start gap-3 animate-in zoom-in-95 duration-200">
            <div
              class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 border border-blue-200/50">
              <InformationCircleIcon class="w-5 h-5 text-blue-800" />
            </div>
            <div class="text-[11px] font-bold leading-relaxed">
              <p class="uppercase font-black text-blue-900">Modo Oficio en Blanco</p>
              <p class="mt-0.5">Se registrará y descargará una plantilla en blanco limpia oficial de la institución con
                su respectivo código QR y numeración correlativa en la cabecera. La información del documento se
                completará manualmente con firmas físicas.</p>
            </div>
          </div>
        </Transition>

        <!-- Acordeón Configuración Coordenadas (Senior Developer Touch) -->
        <div class="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/50">
          <button type="button" @click="mostrarCoordenadas = !mostrarCoordenadas"
            class="w-full flex items-center justify-between px-5 py-3.5 text-[10px] font-black uppercase text-slate-500 hover:bg-slate-100 transition-colors animate-in duration-150">
            <div class="flex items-center gap-1.5">
              <Cog6ToothIcon class="w-4 h-4 text-slate-500" />
              <span>Ajustes de Posición en Plantilla PDF</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-3.5 h-3.5 transition-transform"
              :class="{ 'rotate-180': mostrarCoordenadas }">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          <div v-show="mostrarCoordenadas"
            class="p-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white animate-in slide-in-from-top-4 duration-200">
            <div class="space-y-2.5">
              <p class="font-black text-slate-400 uppercase tracking-widest text-[9px]">Ubicación del Código QR</p>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">X (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.qr.x"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Y (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.qr.y"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Tamaño</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.qr.size"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <div class="space-y-2.5">
              <p class="font-black text-slate-400 uppercase tracking-widest text-[9px]">Ubicación del N° Correlativo</p>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">X (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.correlativo.x"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Y (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.correlativo.y"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Tamaño</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.correlativo.size"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <!-- Configuración Código de Verificación -->
            <div class="space-y-2.5 pt-2.5 border-t border-slate-100">
              <p class="font-black text-slate-400 uppercase tracking-widest text-[9px]">Ubicación Código Verificación
              </p>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">X (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.codigoVerificacion.x"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Y (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.codigoVerificacion.y"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Tamaño</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.codigoVerificacion.size"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
              </div>
            </div>

            <!-- Configuración Destinatario -->
            <div class="space-y-2.5 pt-2.5 border-t border-slate-100">
              <p class="font-black text-slate-400 uppercase tracking-widest text-[9px]">Ubicación del Destinatario
                (Señor(a)(ita))</p>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">X (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.destinatario.x"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div>
                  <label class="text-[9px] text-slate-400 block mb-1">Y (px)</label>
                  <input type="number" step="any" v-model.number="ajustesCoords.destinatario.y"
                    class="w-full border border-slate-200 rounded-lg p-2 font-bold focus:border-jade-500 focus:outline-none" />
                </div>
                <div class="flex items-end">
                  <button type="button" @click="resetCoordenadas"
                    class="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-extrabold py-2 rounded-lg transition-colors active:scale-95 text-[11px] flex items-center justify-center gap-1 min-h-[38px]">
                    <ArrowPathIcon class="w-4 h-4" />
                    <span>Reiniciar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botón de Envío / Descarga (Táctil, alto consistente) -->
        <button type="submit" :disabled="generando"
          class="w-full bg-gradient-to-r from-jade-600 to-jade-500 hover:from-jade-700 hover:to-jade-600 text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-jade-600/10 hover:shadow-jade-600/20 transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]">
          <svg v-if="generando" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <PlusIcon class="w-5 h-5" v-else />
          <span>{{ generando ? 'Registrando y Generando PDF...' :
            (formulario.es_formato_vacio ? 'Generar Oficio en Blanco' : 'Generar Oficio Digital') }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { PDFDocument, rgb, StandardFonts, PDFName, PDFArray, PDFString } from 'pdf-lib'
import QRCode from 'qrcode'
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  PlusIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()
const generando = ref(false)
const user = ref(null)
const mostrarCoordenadas = ref(false)

const formulario = ref({
  tipo: 'Económico',
  es_formato_vacio: false
})

const economicoMeta = ref({
  nombre: ''
})

const especificoMeta = ref({
  nombre: '',
  asunto: ''
})

const invitacionMeta = ref({
  tipoDestinatario: 'Persona',
  nombre: '',
  motivo: ''
})

const deporteMeta = ref({
  disciplina: 'Fulbito Femenino',
  nombre: '',
  descripcion: ''
})

const textosPrecargadosDeportes = {
  'Fulbito Femenino': 'Tenemos el agrado de invitar a su representada a participar en el Campeonato Relámpago de Fulbito Femenino, el cual se llevará a cabo en la losa deportiva municipal el día sábado 15 de agosto a partir de las 3:00 p.m., con la finalidad de promover el deporte y la integración de nuestra comunidad.',
  'Fulbito Máster': 'Es grato dirigirnos a usted para invitarlo cordialmente a participar en el Torneo de Fulbito Máster a realizarse en el complejo deportivo de la institución el día sábado 15 de agosto, donde contaremos con la participación de diversas delegaciones invitadas de nuestra región.',
  'Fútbol Libre': 'Por medio de la presente, extendemos la invitación oficial para participar en la Copa Fútbol Libre 2026, la cual reunirá a los mejores talentos de la disciplina en el estadio municipal a partir del 20 de agosto para disputar el gran trofeo de aniversario institucional.',
  'Vóley Mixto': 'Nos complace invitar a su equipo a formar parte del Encuentro de Integración de Vóley Mixto, promoviendo la equidad y el sano esparcimiento en nuestra institución el día domingo 16 de agosto.'
}

const actualizarPretextoDeporte = () => {
  deporteMeta.value.descripcion = textosPrecargadosDeportes[deporteMeta.value.disciplina] || ''
}

// Coordenadas predeterminadas calibradas para ubicar el QR en la parte superior derecha
const coordsPredeterminadas = {
  qr: { x: 505, y: 710, size: 70 },
  correlativo: { x: 89, y: 606, size: 10 },
  destinatario: { x: 160, y: 590 },
  codigoVerificacion: { x: 420, y: 35, size: 7.5 }
}

const ajustesCoords = ref(JSON.parse(JSON.stringify(coordsPredeterminadas)))

const resetCoordenadas = () => {
  ajustesCoords.value = JSON.parse(JSON.stringify(coordsPredeterminadas))
}

// Generador de código de verificación aleatorio, legible y único
const generarCodigoVerificacion = async (tipo) => {
  let prefijo = 'COD'
  if (tipo === 'Económico') prefijo = 'ECO'
  else if (tipo === 'Específico') prefijo = 'ESP'
  else if (tipo === 'Invitación') prefijo = 'INV'
  else if (tipo === 'Deportes') prefijo = 'DEP'

  const anio = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Excluye O, 0, I, 1, L

  let attempts = 0
  while (attempts < 50) {
    let sufijo = ''
    for (let i = 0; i < 4; i++) {
      sufijo += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    const codigo = `${prefijo}${anio}-${sufijo}`

    try {
      const { data, error } = await supabase
        .from('oficios')
        .select('id')
        .eq('codigo_verificacion', codigo)
        .maybeSingle()

      if (error) {
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          throw new Error('La columna "codigo_verificacion" no existe en la base de datos. Por favor ejecute la consulta SQL de migración provista en la base de datos de Supabase.')
        }
      }

      if (!error && !data) {
        return codigo
      }
    } catch (dbErr) {
      console.error("Error al validar código único:", dbErr)
      throw dbErr
    }
    attempts++
  }
  return `${prefijo}${anio}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
}

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  user.value = session?.user || null
  actualizarPretextoDeporte()
})

const generarOficio = async () => {
  if (generando.value) return
  generando.value = true

  try {
    const creador = user.value?.email || 'Invitado'
    const token = crypto.randomUUID()
    const esBlanco = formulario.value.es_formato_vacio

    let destinatario = 'POR LLENAR A MANO'
    let asunto = 'POR LLENAR A MANO'

    if (!esBlanco) {
      if (formulario.value.tipo === 'Económico') {
        destinatario = economicoMeta.value.nombre.trim().toUpperCase()
        asunto = 'OFICIO ECONÓMICO'
      } else if (formulario.value.tipo === 'Específico') {
        destinatario = especificoMeta.value.nombre.trim().toUpperCase()
        asunto = especificoMeta.value.asunto.trim()
      } else if (formulario.value.tipo === 'Invitación') {
        destinatario = invitacionMeta.value.nombre.trim().toUpperCase()
        asunto = invitacionMeta.value.motivo.trim()
      } else if (formulario.value.tipo === 'Deportes') {
        destinatario = deporteMeta.value.nombre.trim().toUpperCase()
        asunto = deporteMeta.value.descripcion.trim()
      }
    }

    let codigoVerificacion = ''
    try {
      codigoVerificacion = await generarCodigoVerificacion(formulario.value.tipo)
    } catch (err) {
      throw new Error(err.message || 'Error al generar el código único de verificación.')
    }

    const payload = {
      tipo: formulario.value.tipo,
      es_formato_vacio: esBlanco,
      tipo_emision: esBlanco ? 'BLANCO' : 'DIGITAL',
      destinatario,
      asunto,
      token_validacion: token,
      creado_por: creador,
      estado: 'Emitido',
      codigo_verificacion: codigoVerificacion
    }

    const { data, error } = await supabase
      .from('oficios')
      .insert([payload])
      .select('correlativo')
      .single()

    if (error) throw error

    const correlativo = data.correlativo
    const codigoVisible = `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
    showNotification(`Oficio registrado: ${codigoVisible}`, 'alert-success')

    await descargarYTimbrarPDF(correlativo, token, payload)
    router.push('/dashboard')
  } catch (err) {
    showNotification('Error al generar: ' + err.message, 'alert-error')
  } finally {
    generando.value = false
  }
}

const descargarYTimbrarPDF = async (correlativo, token, payload) => {
  try {
    let plantillaUrl = ''

    if (payload.tipo === 'Económico') {
      plantillaUrl = '/plantillas/plantilla-oficio-economico.pdf'
    } else if (payload.tipo === 'Específico') {
      plantillaUrl = '/plantillas/plantilla-oficio-especifico.pdf'
    } else if (payload.tipo === 'Invitación') {
      plantillaUrl = '/plantillas/plantilla-oficio-invitacion.pdf'
    } else if (payload.tipo === 'Deportes') {
      const disciplina = deporteMeta.value.disciplina
      if (disciplina === 'Fulbito Femenino') {
        plantillaUrl = '/plantillas/tipo-deporte/plantilla-oficio-deporte-fulbito-femenino.pdf'
      } else if (disciplina === 'Fulbito Máster') {
        plantillaUrl = '/plantillas/tipo-deporte/plantilla-oficio-deporte-fulbito-master.pdf'
      } else if (disciplina === 'Fútbol Libre') {
        plantillaUrl = '/plantillas/tipo-deporte/plantilla-oficio-deporte-futbol-libre.pdf'
      } else if (disciplina === 'Vóley Mixto') {
        plantillaUrl = '/plantillas/tipo-deporte/plantilla-oficio-deporte-voley-mixto.pdf'
      }
    }

    const response = await fetch(plantillaUrl)
    if (!response.ok) {
      throw new Error(`No se pudo descargar la plantilla base desde: ${plantillaUrl}`)
    }
    const pdfBytes = await response.arrayBuffer()

    const pdfDoc = await PDFDocument.load(pdfBytes)
    const firstPage = pdfDoc.getPages()[0]
    const { width, height } = firstPage.getSize()

    const codigoVisible = `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
    const codigoVerificacion = payload.codigo_verificacion || codigoVisible
    const validationUrl = `${window.location.origin}/validar?codigo=${codigoVerificacion}&token=${token}`
    const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 180 })

    const base64Data = qrDataUrl.split(',')[1]
    const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    const qrImage = await pdfDoc.embedPng(qrBytes)

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const qrX = ajustesCoords.value.qr.x
    const qrY = ajustesCoords.value.qr.y
    const qrSize = ajustesCoords.value.qr.size

    firstPage.drawImage(qrImage, {
      x: qrX,
      y: qrY,
      width: qrSize,
      height: qrSize,
    })

    const msgY1 = qrY - 10
    const msgY2 = qrY - 17
    const msgY3 = qrY - 24

    if (payload.tipo_emision === 'DIGITAL') {
      firstPage.drawText("Escanee el código QR o", {
        x: qrX - 8,
        y: msgY1,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })

      firstPage.drawText("haga clic aquí", {
        x: qrX - 8,
        y: msgY2,
        size: 5.5,
        font: fontBold,
        color: rgb(0, 0.4, 0.8)
      })

      firstPage.drawLine({
        start: { x: qrX - 8, y: msgY2 - 1.2 },
        end: { x: qrX + 28, y: msgY2 - 1.2 },
        thickness: 0.4,
        color: rgb(0, 0.4, 0.8)
      })

      firstPage.drawText(" para verificar", {
        x: qrX + 28,
        y: msgY2,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })

      firstPage.drawText("la autenticidad de este oficio.", {
        x: qrX - 8,
        y: msgY3,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })

      const linkAnnotation = pdfDoc.context.obj({
        Type: 'Annot',
        Subtype: 'Link',
        Rect: [qrX - 10, msgY2 - 3, qrX + 30, msgY2 + 6],
        Border: [0, 0, 0],
        A: {
          Type: 'Action',
          S: 'URI',
          URI: PDFString.of(validationUrl),
        },
      })

      const linkAnnotationRef = pdfDoc.context.register(linkAnnotation)
      const annots = firstPage.node.lookup(PDFName.of('Annots'), PDFArray) || pdfDoc.context.obj([])
      annots.push(linkAnnotationRef)
      firstPage.node.set(PDFName.of('Annots'), annots)

    } else {
      firstPage.drawText("Escanee el código QR para", {
        x: qrX - 8,
        y: msgY1,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })
      firstPage.drawText("verificar la autenticidad", {
        x: qrX - 8,
        y: msgY2,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })
      firstPage.drawText("de este oficio.", {
        x: qrX - 8,
        y: msgY3,
        size: 5.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      })
    }

    const correlativoX = ajustesCoords.value.correlativo.x
    const correlativoY = ajustesCoords.value.correlativo.y
    const correlativoSize = ajustesCoords.value.correlativo.size

    firstPage.drawText(codigoVisible, {
      x: correlativoX,
      y: correlativoY,
      size: correlativoSize,
      font: fontBold,
      // color: rgb(0.004, 0.553, 0.549)
    })

    /*   const textoFecha = `Fecha de emisión: ${new Date().toLocaleDateString('es-PE')}`
      firstPage.drawText(textoFecha, {
        x: correlativoX,
        y: correlativoY - 11,
        size: 7.5,
        font: fontRegular,
        color: rgb(0.4, 0.4, 0.4)
      }) */

    // Dibujar Código de Verificación en la posición configurada (esquina inferior derecha por defecto)
    if (ajustesCoords.value.codigoVerificacion) {
      const cvX = ajustesCoords.value.codigoVerificacion.x
      const cvY = ajustesCoords.value.codigoVerificacion.y
      const cvSize = ajustesCoords.value.codigoVerificacion.size

      firstPage.drawText("Código de verificación: ", {
        x: cvX,
        y: cvY,
        size: cvSize,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3)
      })

      const labelWidth = fontRegular.widthOfTextAtSize("Código de verificación: ", cvSize)
      firstPage.drawText(codigoVerificacion, {
        x: cvX + labelWidth,
        y: cvY,
        size: cvSize,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      })
    }

    if (payload.tipo_emision === 'DIGITAL') {
      if (payload.tipo === 'Económico') {
        firstPage.drawText(economicoMeta.value.nombre.toUpperCase(), {
          x: ajustesCoords.value.destinatario.x,
          y: ajustesCoords.value.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })
      }

      else if (payload.tipo === 'Específico') {
        firstPage.drawText(especificoMeta.value.nombre.toUpperCase(), {
          x: ajustesCoords.value.destinatario.x,
          y: ajustesCoords.value.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        firstPage.drawText(especificoMeta.value.asunto, {
          x: 120,
          y: 545,
          size: 10,
          font: fontRegular,
          color: rgb(0.1, 0.1, 0.1)
        })

        const asuntoTextoRecortado = splitTextIntoLines(especificoMeta.value.asunto, 75)
        let currentY = 425
        for (const line of asuntoTextoRecortado) {
          if (currentY < 150) break
          firstPage.drawText(line, {
            x: 80,
            y: currentY,
            size: 10,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1)
          })
          currentY -= 14
        }
      }

      else if (payload.tipo === 'Invitación') {
        firstPage.drawText(invitacionMeta.value.nombre.toUpperCase(), {
          x: ajustesCoords.value.destinatario.x,
          y: ajustesCoords.value.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        const motivoTextoRecortado = splitTextIntoLines(invitacionMeta.value.motivo, 80)
        let currentY = 460
        for (const line of motivoTextoRecortado) {
          if (currentY < 150) break
          firstPage.drawText(line, {
            x: 80,
            y: currentY,
            size: 10,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1)
          })
          currentY -= 14
        }
      }

      else if (payload.tipo === 'Deportes') {
        firstPage.drawText(deporteMeta.value.nombre.toUpperCase(), {
          x: ajustesCoords.value.destinatario.x,
          y: ajustesCoords.value.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        const descTextoRecortado = splitTextIntoLines(deporteMeta.value.descripcion, 80)
        let currentY = 460
        for (const line of descTextoRecortado) {
          if (currentY < 150) break
          firstPage.drawText(line, {
            x: 80,
            y: currentY,
            size: 10,
            font: fontRegular,
            color: rgb(0.1, 0.1, 0.1)
          })
          currentY -= 14
        }
      }
    }

    const modBytes = await pdfDoc.save()
    const blob = new Blob([modBytes], { type: 'application/pdf' })
    const downloadUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `${codigoVisible}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)

  } catch (err) {
    showNotification('Error al timbrar PDF: ' + err.message, 'alert-error')
  }
}

function splitTextIntoLines(text, charsPerLine) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).length <= charsPerLine) {
      currentLine += (currentLine === '' ? '' : ' ') + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine !== '') {
    lines.push(currentLine)
  }
  return lines
}
</script>
