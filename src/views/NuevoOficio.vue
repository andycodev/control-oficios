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
            <div v-if="formulario.tipo === 'Económico'" class="space-y-4">
              <!-- Selector de Modo: Individual, Masivo o En Blanco Masivo -->
              <div class="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button type="button" @click="modoEconomico = 'individual'"
                  class="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                  :class="modoEconomico === 'individual' ? 'bg-white text-jade-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'">
                  Individual
                </button>
                <button type="button" @click="modoEconomico = 'masivo'"
                  class="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                  :class="modoEconomico === 'masivo' ? 'bg-white text-jade-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'">
                  Carga Masiva
                </button>
                <button type="button" @click="modoEconomico = 'masivo-blanco'"
                  class="flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all"
                  :class="modoEconomico === 'masivo-blanco' ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'">
                  En Blanco
                </button>
              </div>

              <!-- Modo Individual -->
              <div v-if="modoEconomico === 'individual'" class="space-y-1">
                <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Nombre de la persona</label>
                <input v-model="economicoMeta.nombre" type="text" :required="modoEconomico === 'individual'" placeholder="Ej. JUAN PEREZ MARTINEZ"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase" />
              </div>

              <!-- Modo Carga Masiva (Excel) -->
              <div v-else-if="modoEconomico === 'masivo'" class="space-y-4">
                <!-- Dropzone/File input -->
                <div class="border-2 border-dashed border-slate-200 hover:border-jade-500 rounded-2xl p-6 text-center cursor-pointer transition relative bg-slate-50/50">
                  <input type="file" @change="procesarArchivoMasivo" accept=".xlsx, .xls, .csv, .txt" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div class="space-y-2">
                    <div class="text-slate-400 flex justify-center">
                      <DocumentArrowUpIcon class="w-8 h-8 text-slate-400" />
                    </div>
                    <p class="text-xs font-black text-slate-600 uppercase tracking-wide">Arrastra o selecciona un archivo Excel / CSV / TXT</p>
                    <p class="text-[9px] text-slate-400">Se buscarán nombres en la primera columna del archivo</p>
                  </div>
                </div>

                <!-- Pegar lista -->
                <div class="space-y-2">
                  <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">O pega una lista de nombres (Uno por línea)</label>
                  <textarea v-model="listaNombresPegados" rows="4" placeholder="JUAN PEREZ MARTINEZ&#10;MARIA LOPEZ DIAZ&#10;CARLOS TORRES VÁSQUEZ"
                    class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-bold text-slate-700 outline-none transition duration-200 hover:border-slate-300 focus:bg-white focus:ring-4 focus:ring-jade-500/10 focus:border-jade-500 uppercase resize-none"></textarea>
                  <button type="button" @click="procesarNombresPegados" :disabled="!listaNombresPegados.trim()"
                    class="w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-extrabold text-[10px] uppercase tracking-wider py-2 rounded-xl transition duration-150 active:scale-95 flex items-center justify-center gap-1.5 min-h-[36px]">
                    <span>Agregar nombres de la lista</span>
                  </button>
                </div>

                <!-- Vista previa -->
                <div v-if="nombresCargados.length > 0" class="bg-jade-50/30 border border-jade-100 rounded-2xl p-4 space-y-3">
                  <div class="flex justify-between items-center pb-2 border-b border-jade-100">
                    <span class="text-xs font-black uppercase tracking-wider text-jade-800">
                      Nombres Detectados ({{ nombresCargados.length }})
                    </span>
                    <button type="button" @click="limpiarCargaMasiva" class="text-[10px] text-red-600 hover:text-red-800 font-extrabold uppercase">
                      Limpiar todo
                    </button>
                  </div>
                  <div class="max-h-48 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar text-[11px] font-bold text-slate-700">
                    <div v-for="(nombre, idx) in nombresCargados" :key="idx" class="flex justify-between items-center bg-white border border-slate-100 px-3 py-2 rounded-xl shadow-sm">
                      <span class="truncate pr-2">{{ idx + 1 }}. {{ nombre }}</span>
                      <button type="button" @click="eliminarNombreCargado(idx)" class="text-slate-400 hover:text-red-500 transition-colors flex-shrink-0">
                        <TrashIcon class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modo En Blanco Masivo -->
              <div v-else-if="modoEconomico === 'masivo-blanco'" class="space-y-4 animate-in fade-in duration-200">
                <!-- Panel informativo -->
                <div class="bg-violet-50/60 border border-violet-200 rounded-2xl p-4 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center flex-shrink-0 border border-violet-200/50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                    </svg>
                  </div>
                  <div class="text-[11px] font-semibold leading-relaxed">
                    <p class="uppercase font-black text-violet-900">PDF Masivo en Blanco</p>
                    <p class="mt-0.5 text-violet-800">Se registrarán <strong>{{ cantidadBlanco }}</strong> oficios económicos en blanco en el sistema y se descargará un único PDF listo para imprimir. El destinatario se completa manualmente a bolígrafo.</p>
                  </div>
                </div>

                <!-- Input de cantidad -->
                <div class="space-y-1.5">
                  <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Cantidad de oficios a generar</label>
                  <div class="flex items-center gap-3">
                    <button type="button"
                      @click="cantidadBlanco = Math.max(1, cantidadBlanco - 1)"
                      class="w-10 h-10 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-lg flex items-center justify-center transition active:scale-90">
                      −
                    </button>
                    <input
                      v-model.number="cantidadBlanco"
                      type="number" min="1" max="500"
                      class="flex-1 text-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-2xl font-black text-slate-900 outline-none transition duration-200 focus:ring-4 focus:ring-violet-500/10 focus:border-violet-500"
                    />
                    <button type="button"
                      @click="cantidadBlanco = Math.min(500, cantidadBlanco + 1)"
                      class="w-10 h-10 flex-shrink-0 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-black text-lg flex items-center justify-center transition active:scale-90">
                      +
                    </button>
                  </div>
                  <p class="text-[9px] text-slate-400 font-bold ml-1 text-center">Mínimo 1 — Máximo 500 oficios por descarga</p>
                </div>

                <!-- Atajos de cantidad rápida -->
                <div class="flex flex-wrap gap-2">
                  <button v-for="qty in [10, 25, 50, 100, 200]" :key="qty" type="button"
                    @click="cantidadBlanco = qty"
                    class="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all"
                    :class="cantidadBlanco === qty
                      ? 'bg-violet-600 border-violet-600 text-white shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-violet-400 hover:text-violet-700'"
                  >
                    {{ qty }} oficios
                  </button>
                </div>
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
          class="w-full text-white font-extrabold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-lg transition duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
          :class="(formulario.tipo === 'Económico' && modoEconomico === 'masivo-blanco')
            ? 'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-700 hover:to-violet-600 shadow-violet-600/10 hover:shadow-violet-600/20'
            : 'bg-gradient-to-r from-jade-600 to-jade-500 hover:from-jade-700 hover:to-jade-600 shadow-jade-600/10 hover:shadow-jade-600/20'"
        >
          <svg v-if="generando" class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <PlusIcon class="w-5 h-5" v-else />
          <span>
            <template v-if="generando">Registrando y Generando PDF...</template>
            <template v-else-if="formulario.tipo === 'Económico' && modoEconomico === 'masivo-blanco'">Generar {{ cantidadBlanco }} Oficio{{ cantidadBlanco !== 1 ? 's' : '' }} en Blanco</template>
            <template v-else-if="formulario.es_formato_vacio">Generar Oficio en Blanco</template>
            <template v-else>Generar Oficio Digital</template>
          </span>
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
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import {
  ArrowLeftIcon,
  InformationCircleIcon,
  Cog6ToothIcon,
  ArrowPathIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowUpIcon
} from '@heroicons/vue/24/outline'
import * as XLSX from 'xlsx'

const router = useRouter()
const generando = ref(false)

// Retorna la fecha local actual en formato YYYY-MM-DD (evita el desfase UTC de toISOString())
const obtenerFechaLocalHoy = () => {
  const ahora = new Date()
  const y = ahora.getFullYear()
  const m = String(ahora.getMonth() + 1).padStart(2, '0')
  const d = String(ahora.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
const user = ref(null)
const mostrarCoordenadas = ref(false)

const formulario = ref({
  tipo: 'Económico',
  es_formato_vacio: false
})

const economicoMeta = ref({
  nombre: ''
})

const modoEconomico = ref('individual') // 'individual' | 'masivo' | 'masivo-blanco'
const listaNombresPegados = ref('')
const nombresCargados = ref([])
const cantidadBlanco = ref(10)

const limpiarCargaMasiva = () => {
  nombresCargados.value = []
  listaNombresPegados.value = ''
}

const eliminarNombreCargado = (idx) => {
  nombresCargados.value.splice(idx, 1)
}

const procesarNombresPegados = () => {
  if (!listaNombresPegados.value.trim()) return
  const lines = listaNombresPegados.value.split(/\r?\n/)
  const uniqueNames = new Set(nombresCargados.value)
  let count = 0
  lines.forEach(line => {
    const clean = line.trim().toUpperCase()
    if (clean.length > 0) {
      if (!uniqueNames.has(clean)) {
        uniqueNames.add(clean)
        count++
      }
    }
  })
  nombresCargados.value = Array.from(uniqueNames)
  if (count > 0) {
    showNotification(`Se agregaron ${count} nombres de la lista pegada.`, 'alert-success')
  } else {
    showNotification('No se agregaron nombres nuevos (ya existen o lista vacía).', 'alert-warning')
  }
  listaNombresPegados.value = '' // Limpiar el área de texto
}

const procesarArchivoMasivo = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const extension = file.name.split('.').pop().toLowerCase()
  const reader = new FileReader()

  if (extension === 'xlsx' || extension === 'xls') {
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        
        const names = []
        rows.forEach(row => {
          if (row && row.length > 0) {
            const firstCell = String(row[0] || '').trim().toUpperCase()
            if (firstCell && firstCell !== 'NOMBRE' && firstCell !== 'NOMBRES') {
              names.push(firstCell)
            }
          }
        })

        const uniqueNames = new Set([...nombresCargados.value, ...names])
        nombresCargados.value = Array.from(uniqueNames)
        showNotification(`${names.length} nombres leídos del Excel.`, 'alert-success')
      } catch (err) {
        showNotification('Error al leer el archivo Excel: ' + err.message, 'alert-error')
      }
    }
    reader.readAsArrayBuffer(file)
  } else if (extension === 'csv' || extension === 'txt') {
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split(/\r?\n/)
        const names = lines
          .map(line => line.trim().toUpperCase())
          .filter(line => line.length > 0 && line !== 'NOMBRE' && line !== 'NOMBRES')
        
        const uniqueNames = new Set([...nombresCargados.value, ...names])
        nombresCargados.value = Array.from(uniqueNames)
        showNotification(`${names.length} nombres leídos del archivo.`, 'alert-success')
      } catch (err) {
        showNotification('Error al leer el archivo: ' + err.message, 'alert-error')
      }
    }
    reader.readAsText(file)
  } else {
    showNotification('Formato de archivo no soportado. Use .xlsx, .xls, .csv o .txt', 'alert-warning')
  }
  event.target.value = ''
}

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

// Generador de códigos de verificación por lotes para la carga masiva (eficiente en una sola consulta)
const generarCodigosVerificacionLote = async (tipo, cantidad) => {
  let prefijo = 'COD'
  if (tipo === 'Económico') prefijo = 'ECO'
  else if (tipo === 'Específico') prefijo = 'ESP'
  else if (tipo === 'Invitación') prefijo = 'INV'
  else if (tipo === 'Deportes') prefijo = 'DEP'

  const anio = new Date().getFullYear()
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

  try {
    const { data, error } = await supabase
      .from('oficios')
      .select('codigo_verificacion')
      .like('codigo_verificacion', `${prefijo}${anio}-%`)

    if (error) {
      if (error.message.includes('column') && error.message.includes('does not exist')) {
        throw new Error('La columna "codigo_verificacion" no existe en la base de datos.')
      }
      throw error
    }

    const codigosExistentes = new Set(data?.map(d => d.codigo_verificacion) || [])
    const codigosGenerados = []

    for (let i = 0; i < cantidad; i++) {
      let attempts = 0
      let codigo = ''
      while (attempts < 100) {
        let sufijo = ''
        for (let j = 0; j < 4; j++) {
          sufijo += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        codigo = `${prefijo}${anio}-${sufijo}`
        if (!codigosExistentes.has(codigo) && !codigosGenerados.includes(codigo)) {
          break
        }
        attempts++
      }
      codigosGenerados.push(codigo)
    }
    return codigosGenerados
  } catch (dbErr) {
    console.error("Error al generar códigos de verificación en lote:", dbErr)
    const fallbackCodes = []
    for (let i = 0; i < cantidad; i++) {
      let sufijo = ''
      for (let j = 0; j < 4; j++) {
        sufijo += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      fallbackCodes.push(`${prefijo}${anio}-${sufijo}`)
    }
    return fallbackCodes
  }
}

const generarOficiosMasivos = async () => {
  if (nombresCargados.value.length === 0) {
    showNotification('Debe agregar al menos un nombre para la carga masiva.', 'alert-warning')
    return
  }

  generando.value = true

  try {
    const creador = user.value?.email || 'Invitado'
    const cantidad = nombresCargados.value.length

    showNotification(`Generando códigos y registrando ${cantidad} oficios...`, 'alert-info')

    // 1. Generar códigos de verificación en lote
    const codigosVerificacion = await generarCodigosVerificacionLote('Económico', cantidad)

    // 2. Preparar el lote de registros para Supabase
    const payloads = nombresCargados.value.map((nombre, index) => ({
      tipo: 'Económico',
      es_formato_vacio: false,
      tipo_emision: 'DIGITAL',
      destinatario: nombre.trim().toUpperCase(),
      asunto: 'OFICIO ECONÓMICO',
      token_validacion: crypto.randomUUID(),
      creado_por: creador,
      estado: 'Emitido',
      codigo_verificacion: codigosVerificacion[index]
    }))

    // 3. Insertar registros en Supabase en una sola consulta
    const { data: records, error: insertError } = await supabase
      .from('oficios')
      .insert(payloads)
      .select('id, correlativo, destinatario, creado_por, tipo, es_formato_vacio, tipo_emision, asunto, token_validacion, codigo_verificacion')

    if (insertError) throw insertError
    if (!records || records.length === 0) throw new Error('No se pudieron guardar los registros de oficios.')

    showNotification(`Se registraron ${records.length} oficios. Generando PDF consolidado...`, 'alert-success')

    // 4. Generar el PDF consolidado
    const mergedPdf = await PDFDocument.create()
    const plantillaUrl = '/plantillas/plantilla-oficio-economico.pdf'
    
    // Descargar la plantilla una sola vez para todo el lote
    const response = await fetch(plantillaUrl)
    if (!response.ok) {
      throw new Error(`No se pudo descargar la plantilla base desde: ${plantillaUrl}`)
    }
    const plantillaBytes = await response.arrayBuffer()

    // Procesar cada oficio insertado
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      
      const correlativo = record.correlativo
      const codigoVisible = `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
      const validationUrl = `${window.location.origin}/validar?codigo=${record.codigo_verificacion}&token=${record.token_validacion}`
      const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 180 })

      const base64Data = qrDataUrl.split(',')[1]
      const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

      const tempDoc = await PDFDocument.load(plantillaBytes)
      const firstPage = tempDoc.getPages()[0]
      const qrImage = await tempDoc.embedPng(qrBytes)

      const fontBold = await tempDoc.embedFont(StandardFonts.HelveticaBold)
      const fontRegular = await tempDoc.embedFont(StandardFonts.Helvetica)

      const qrX = ajustesCoords.value.qr.x
      const qrY = ajustesCoords.value.qr.y
      const qrSize = ajustesCoords.value.qr.size

      firstPage.drawImage(qrImage, {
        x: qrX,
        y: qrY,
        width: qrSize,
        height: qrSize,
      })

      const msgText = 'Escanee el QR para verificar este oficio.'
      const msgTextWidth = fontRegular.widthOfTextAtSize(msgText, 5.5)
      const msgX = qrX + qrSize / 2 - msgTextWidth / 2
      firstPage.drawText(msgText, { x: msgX, y: qrY - 10, size: 5.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })

      firstPage.drawText(codigoVisible, {
        x: ajustesCoords.value.correlativo.x,
        y: ajustesCoords.value.correlativo.y,
        size: ajustesCoords.value.correlativo.size,
        font: fontBold,
      })

      if (ajustesCoords.value.codigoVerificacion) {
        const cvX = ajustesCoords.value.codigoVerificacion.x
        const cvY = ajustesCoords.value.codigoVerificacion.y
        const cvSize = ajustesCoords.value.codigoVerificacion.size

        firstPage.drawText("Código de verificación: ", { x: cvX, y: cvY, size: cvSize, font: fontRegular, color: rgb(0.3, 0.3, 0.3) })
        const labelWidth = fontRegular.widthOfTextAtSize("Código de verificación: ", cvSize)
        firstPage.drawText(record.codigo_verificacion, { x: cvX + labelWidth, y: cvY, size: cvSize, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
      }

      firstPage.drawText(record.destinatario.toUpperCase(), {
        x: ajustesCoords.value.destinatario.x,
        y: ajustesCoords.value.destinatario.y,
        size: 10,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1)
      })

      const tempBytes = await tempDoc.save()
      const loadedDoc = await PDFDocument.load(tempBytes)
      const copiedPages = await mergedPdf.copyPages(loadedDoc, [0])
      mergedPdf.addPage(copiedPages[0])
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })
    const downloadUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Oficio Económico Lote - ${obtenerFechaLocalHoy()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)

    showNotification(`PDF consolidado de ${records.length} oficios descargado.`, 'alert-success')
    router.push('/dashboard')
  } catch (err) {
    showNotification('Error en generación masiva: ' + err.message, 'alert-error')
  } finally {
    generando.value = false
  }
}

const generarOficiosMasivoEnBlanco = async () => {
  const cantidad = Number(cantidadBlanco.value)
  if (!cantidad || cantidad < 1 || cantidad > 500) {
    showNotification('La cantidad debe estar entre 1 y 500 oficios.', 'alert-warning')
    return
  }

  generando.value = true

  try {
    const creador = user.value?.email || 'Invitado'

    showNotification(`Generando códigos y registrando ${cantidad} oficios en blanco...`, 'alert-info')

    // 1. Generar códigos de verificación únicos en lote
    const codigosVerificacion = await generarCodigosVerificacionLote('Económico', cantidad)

    // 2. Preparar payloads para Supabase
    const payloads = Array.from({ length: cantidad }, (_, index) => ({
      tipo: 'Económico',
      es_formato_vacio: true,
      tipo_emision: 'BLANCO',
      destinatario: 'POR LLENAR A MANO',
      asunto: 'POR LLENAR A MANO',
      token_validacion: crypto.randomUUID(),
      creado_por: creador,
      estado: 'Emitido',
      codigo_verificacion: codigosVerificacion[index]
    }))

    // 3. Insertar registros en Supabase en batch
    const { data: records, error: insertError } = await supabase
      .from('oficios')
      .insert(payloads)
      .select('id, correlativo, token_validacion, codigo_verificacion')

    if (insertError) throw insertError
    if (!records || records.length === 0) throw new Error('No se pudieron guardar los registros de oficios en blanco.')

    showNotification(`Se registraron ${records.length} oficios. Generando PDF consolidado en blanco...`, 'alert-success')

    // 4. Generar PDF consolidado en blanco
    const mergedPdf = await PDFDocument.create()
    const plantillaUrl = '/plantillas/plantilla-oficio-economico.pdf'

    const response = await fetch(plantillaUrl)
    if (!response.ok) {
      throw new Error(`No se pudo descargar la plantilla base desde: ${plantillaUrl}`)
    }
    const plantillaBytes = await response.arrayBuffer()

    for (let i = 0; i < records.length; i++) {
      const record = records[i]

      const correlativo = record.correlativo
      const codigoVisible = `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
      const validationUrl = `${window.location.origin}/validar?codigo=${record.codigo_verificacion}&token=${record.token_validacion}`
      const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 180 })

      const base64Data = qrDataUrl.split(',')[1]
      const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))

      const tempDoc = await PDFDocument.load(plantillaBytes)
      const firstPage = tempDoc.getPages()[0]
      const qrImage = await tempDoc.embedPng(qrBytes)

      const fontBold = await tempDoc.embedFont(StandardFonts.HelveticaBold)
      const fontRegular = await tempDoc.embedFont(StandardFonts.Helvetica)

      const qrX = ajustesCoords.value.qr.x
      const qrY = ajustesCoords.value.qr.y
      const qrSize = ajustesCoords.value.qr.size

      // Dibujar QR
      firstPage.drawImage(qrImage, { x: qrX, y: qrY, width: qrSize, height: qrSize })

      // Texto centrado debajo del QR
      const msgText = 'Escanee el QR para verificar este oficio.'
      const msgTextWidth = fontRegular.widthOfTextAtSize(msgText, 5.5)
      const msgX = qrX + qrSize / 2 - msgTextWidth / 2
      firstPage.drawText(msgText, { x: msgX, y: qrY - 10, size: 5.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })

      // Correlativo
      firstPage.drawText(codigoVisible, {
        x: ajustesCoords.value.correlativo.x,
        y: ajustesCoords.value.correlativo.y,
        size: ajustesCoords.value.correlativo.size,
        font: fontBold,
      })

      // Código de verificación en el pie
      if (ajustesCoords.value.codigoVerificacion) {
        const cvX = ajustesCoords.value.codigoVerificacion.x
        const cvY = ajustesCoords.value.codigoVerificacion.y
        const cvSize = ajustesCoords.value.codigoVerificacion.size
        firstPage.drawText('Código de verificación: ', { x: cvX, y: cvY, size: cvSize, font: fontRegular, color: rgb(0.3, 0.3, 0.3) })
        const labelWidth = fontRegular.widthOfTextAtSize('Código de verificación: ', cvSize)
        firstPage.drawText(record.codigo_verificacion, { x: cvX + labelWidth, y: cvY, size: cvSize, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
      }

      // Sin nombre de destinatario — queda en blanco para llenado manual

      const tempBytes = await tempDoc.save()
      const loadedDoc = await PDFDocument.load(tempBytes)
      const copiedPages = await mergedPdf.copyPages(loadedDoc, [0])
      mergedPdf.addPage(copiedPages[0])
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })
    const downloadUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `Oficio Económico Blanco (${cantidad}) - ${obtenerFechaLocalHoy()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(downloadUrl)

    showNotification(`PDF con ${records.length} oficios en blanco descargado exitosamente.`, 'alert-success')
    router.push('/dashboard')
  } catch (err) {
    showNotification('Error al generar PDF en blanco masivo: ' + err.message, 'alert-error')
  } finally {
    generando.value = false
  }
}

const generarOficio = async () => {
  if (generando.value) return

  // Modo En Blanco Masivo
  if (formulario.value.tipo === 'Económico' && modoEconomico.value === 'masivo-blanco') {
    await generarOficiosMasivoEnBlanco()
    return
  }

  if (formulario.value.tipo === 'Económico' && modoEconomico.value === 'masivo' && !formulario.value.es_formato_vacio) {
    await generarOficiosMasivos()
    return
  }

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

    const msgText = 'Escanee el QR para verificar este oficio.'
    const msgTextWidth = fontRegular.widthOfTextAtSize(msgText, 5.5)
    const msgX = qrX + qrSize / 2 - msgTextWidth / 2
    firstPage.drawText(msgText, { x: msgX, y: qrY - 10, size: 5.5, font: fontRegular, color: rgb(0.4, 0.4, 0.4) })

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
    link.download = `Oficio ${payload.tipo} - ${obtenerFechaLocalHoy()}.pdf`
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
