<template>
  <div class="space-y-4 sm:space-y-6 font-sans pb-10">
    <!-- Encabezado de la Vista -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-5">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight font-outfit uppercase">Listado General</h1>
        <p class="text-xs text-slate-400 font-extrabold uppercase tracking-widest mt-1">Consulta y administración de todos los oficios emitidos</p>
      </div>
      <router-link 
        to="/nuevo-oficio" 
        class="bg-gradient-to-r from-jade-600 to-jade-500 hover:from-jade-700 hover:to-jade-600 text-white font-extrabold text-xs uppercase tracking-widest px-5 py-3.5 rounded-xl shadow-lg shadow-jade-600/10 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[44px]"
      >
        <PlusIcon class="w-5 h-5" />
        <span>Nuevo Oficio</span>
      </router-link>
    </div>

    <!-- Panel de Filtros Combinables (Compacto y Responsive) -->
    <div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex items-center justify-between border-b border-slate-50 pb-2">
        <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Filtros de Búsqueda</h3>
        <button 
          @click="limpiarFiltros" 
          class="text-[10px] text-jade-700 hover:text-jade-900 font-black uppercase tracking-wider transition-colors flex items-center gap-1"
        >
          <ArrowPathIcon class="w-4 h-4" />
          <span>Limpiar Filtros</span>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Filtro: Código -->
        <div class="space-y-1">
          <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Código de Oficio</label>
          <input 
            v-model="filtros.codigo"
            type="text"
            placeholder="Ej. OF-2026-000001-HB"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:bg-white focus:border-jade-500 uppercase"
          />
        </div>

        <!-- Filtro: Destinatario -->
        <div class="space-y-1">
          <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Destinatario</label>
          <input 
            v-model="filtros.destinatario"
            type="text"
            placeholder="Buscar por destinatario..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:bg-white focus:border-jade-500"
          />
        </div>

        <!-- Filtro: Usuario Creador -->
        <div class="space-y-1">
          <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Creado Por (Usuario)</label>
          <select 
            v-model="filtros.usuario"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:bg-white focus:border-jade-500"
          >
            <option value="">Todos los usuarios</option>
            <option v-for="user in listaUsuarios" :key="user" :value="user">{{ user }}</option>
          </select>
        </div>

        <!-- Filtro: Estado -->
        <div class="space-y-1">
          <label class="block text-[10px] font-black uppercase text-slate-400 ml-1">Estado del Documento</label>
          <select 
            v-model="filtros.estado"
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-xs font-bold text-slate-700 outline-none transition duration-150 focus:bg-white focus:border-jade-500"
          >
            <option value="">Todos los estados</option>
            <option value="Emitido">Emitido</option>
            <option value="Entregado">Entregado</option>
            <option value="Con Respuesta">Con Respuesta</option>
            <option value="Anulado">Anulado</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Cargador de Datos -->
    <div v-if="cargando" class="flex flex-col items-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
      <svg class="animate-spin h-8 w-8 text-jade-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span class="text-xs text-slate-400 font-bold uppercase tracking-widest">Cargando correspondencia...</span>
    </div>

    <!-- Listado General (Mobile-First / Adaptativo) -->
    <div v-else>
      
      <!-- 1. VISTA DE TARJETAS EN MÓVILES (Oculta en md/lg) -->
      <div class="block lg:hidden space-y-3">
        <div 
          v-for="(oficio, index) in oficiosFiltrados" 
          :key="oficio.id" 
          class="bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-3 transition duration-150 hover:shadow-md"
          :class="{
            'border-red-100 bg-red-50/10': oficio.estado === 'Anulado',
            'border-blue-100 bg-blue-50/5': oficio.estado === 'Entregado',
            'border-green-100 bg-green-50/5': oficio.estado === 'Con Respuesta',
            'border-slate-100': oficio.estado === 'Emitido'
          }"
        >
          <!-- Cabecera de Tarjeta -->
          <div class="flex items-start justify-between border-b border-slate-100 pb-2">
            <div class="flex items-center gap-2">
              <input type="checkbox" :value="oficio" v-model="seleccionados" class="rounded border-slate-200 text-jade-600 focus:ring-jade-500/20 w-4 h-4 cursor-pointer align-middle mr-1" />
              <span class="w-5.5 h-5.5 rounded-lg bg-slate-50 text-slate-500 font-black text-[10px] flex items-center justify-center font-outfit border border-slate-100">
                {{ index + 1 }}
              </span>
              <div>
                <span class="text-xs font-black text-slate-900 block font-outfit">
                  {{ obtenerCodigoVisible(oficio.correlativo) }}
                </span>
                <span v-if="oficio.codigo_verificacion" class="text-[9px] text-jade-700 font-extrabold uppercase mt-0.2 block">
                  Verif: {{ oficio.codigo_verificacion }}
                </span>
                <span class="text-[9px] text-slate-400 font-extrabold uppercase mt-0.2 block">
                  Fecha: {{ formatearFecha(oficio.creado_en) }}
                </span>
              </div>
            </div>
            
            <div class="flex flex-col items-end gap-1">
              <span 
                class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider"
                :class="{
                  'bg-sky-100 text-sky-800 border border-sky-200': (oficio.tipo_emision || 'DIGITAL') === 'DIGITAL',
                  'bg-slate-100 text-slate-700 border border-slate-200': oficio.tipo_emision === 'BLANCO',
                }"
              >
                {{ oficio.tipo_emision || 'DIGITAL' }}
              </span>
              <span 
                class="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1"
                :class="{
                  'bg-amber-100 text-amber-800': oficio.tipo === 'Económico',
                  'bg-purple-100 text-purple-800': oficio.tipo === 'Específico',
                  'bg-teal-100 text-teal-800': oficio.tipo === 'Invitación',
                  'bg-indigo-100 text-indigo-800': oficio.tipo === 'Deportes',
                }"
              >
                {{ oficio.tipo }}
              </span>
            </div>
          </div>

          <!-- Detalles del Oficio -->
          <div class="space-y-1.5 text-xs">
            <div>
              <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Destinatario</span>
              <span class="text-slate-800 font-extrabold leading-tight block">{{ oficio.destinatario }}</span>
            </div>
            <div v-if="oficio.asunto && oficio.asunto !== 'POR LLENAR A MANO'">
              <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Asunto / Detalles</span>
              <span class="text-slate-600 font-semibold truncate block max-w-xs leading-normal">{{ oficio.asunto }}</span>
            </div>
            <div class="flex justify-between items-center text-[10px] pt-0.5">
              <span class="text-slate-400 font-bold">Creador: <span class="text-slate-600 uppercase font-bold">{{ oficio.creado_por }}</span></span>
              <!-- Estado Badge -->
              <span 
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border animate-in fade-in duration-200"
                :class="{
                  'bg-gray-100 text-gray-700 border-gray-200': oficio.estado === 'Emitido',
                  'bg-blue-100 text-blue-700 border-blue-200': oficio.estado === 'Entregado',
                  'bg-green-100 text-green-700 border-green-200': oficio.estado === 'Con Respuesta',
                  'bg-red-100 text-red-700 border-red-200': oficio.estado === 'Anulado'
                }"
              >
                {{ oficio.estado }}
              </span>
            </div>
          </div>

          <!-- Acciones en Tarjeta (Área táctil simplificada y elegante) -->
          <div class="border-t border-slate-100 pt-3 flex items-center justify-end">
            <div class="w-full text-right">
              <button 
                @click.stop="toggleDropdown($event, oficio)"
                class="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 font-extrabold text-xs uppercase tracking-wider transition duration-150 active:scale-[0.98] min-h-[40px]"
              >
                <span v-if="generandoPdfId === oficio.id" class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-3.5 w-3.5 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Procesando...</span>
                </span>
                <span v-else>Acciones</span>
                <ChevronDownIcon class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': dropdownAbierto && dropdownAbierto.id === oficio.id }" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. VISTA DE TABLA EN ESCRITORIO (Oculta en móviles/pantallas chicas) -->
      <div class="hidden lg:block bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="table-auto w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-500 uppercase font-black border-b border-slate-100">
              <tr>
                <th class="px-4 py-4 text-center w-10">
                  <input type="checkbox" :checked="todosSeleccionados" @change="toggleSeleccionarTodos" class="rounded border-slate-200 text-jade-600 focus:ring-jade-500/20 w-4 h-4 cursor-pointer align-middle" />
                </th>
                <th class="px-4 py-4 text-center w-12">N°</th>
                <th class="px-6 py-4">Código de Oficio</th>
                <th class="px-6 py-4">Emisión</th>
                <th class="px-6 py-4">Tipo</th>
                <th class="px-6 py-4">Destinatario</th>
                <th class="px-6 py-4">Creado Por</th>
                <th class="px-6 py-4">Estado</th>
                <th class="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="(oficio, index) in oficiosFiltrados" 
                :key="oficio.id" 
                :class="{
                  'bg-red-50/20 hover:bg-red-50/30': oficio.estado === 'Anulado',
                  'bg-blue-50/10 hover:bg-blue-50/20': oficio.estado === 'Entregado',
                  'bg-green-50/10 hover:bg-green-50/20': oficio.estado === 'Con Respuesta',
                  'hover:bg-slate-50/80': oficio.estado === 'Emitido'
                }"
                class="transition-colors font-bold text-slate-700"
              >
                <!-- Checkbox de Selección -->
                <td class="px-4 py-3 text-center w-10">
                  <input type="checkbox" :value="oficio" v-model="seleccionados" class="rounded border-slate-200 text-jade-600 focus:ring-jade-500/20 w-4 h-4 cursor-pointer align-middle" />
                </td>
                <!-- Número de Fila -->
                <td class="px-4 py-3 text-center text-slate-400 font-bold font-outfit">
                  {{ index + 1 }}
                </td>
                <!-- Código de Oficio -->
                <td class="px-6 py-3">
                  <span class="text-sm font-black text-slate-900 block font-outfit">
                    {{ obtenerCodigoVisible(oficio.correlativo) }}
                  </span>
                  <div class="flex flex-col gap-0.5 mt-0.5">
                    <span v-if="oficio.codigo_verificacion" class="text-[10px] text-slate-500 font-extrabold uppercase">
                      Verif: <span class="text-jade-700 font-black font-outfit select-all bg-jade-50/50 px-1 py-0.2 border border-jade-100 rounded">{{ oficio.codigo_verificacion }}</span>
                    </span>
                    <span v-if="oficio.es_formato_vacio" class="inline-flex self-start px-1 py-0.2 bg-blue-50 border border-blue-100 text-blue-700 rounded text-[9px] uppercase tracking-wide font-extrabold">
                      Llenado Manual
                    </span>
                  </div>
                </td>
                
                <!-- Emisión -->
                <td class="px-6 py-3">
                  <span 
                    class="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-sky-100 text-sky-800 border border-sky-200': (oficio.tipo_emision || 'DIGITAL') === 'DIGITAL',
                      'bg-slate-100 text-slate-700 border border-slate-200': oficio.tipo_emision === 'BLANCO',
                    }"
                  >
                    {{ oficio.tipo_emision || 'DIGITAL' }}
                  </span>
                </td>
                
                <!-- Tipo -->
                <td class="px-6 py-3">
                  <span 
                    class="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                    :class="{
                      'bg-amber-100 text-amber-800 border-amber-200': oficio.tipo === 'Económico',
                      'bg-purple-100 text-purple-800 border-purple-200': oficio.tipo === 'Específico',
                      'bg-teal-100 text-teal-800 border-teal-200': oficio.tipo === 'Invitación',
                      'bg-indigo-100 text-indigo-800 border-indigo-200': oficio.tipo === 'Deportes',
                    }"
                  >
                    {{ oficio.tipo }}
                  </span>
                </td>

                <!-- Destinatario -->
                <td class="px-6 py-3">
                  <div class="max-w-xs truncate text-slate-800 font-extrabold" :title="oficio.destinatario">
                    {{ oficio.destinatario }}
                  </div>
                  <div v-if="oficio.asunto && oficio.asunto !== 'POR LLENAR A MANO'" class="text-[10px] text-slate-400 font-semibold truncate max-w-xs mt-0.5">
                    Detalles: {{ oficio.asunto }}
                  </div>
                </td>

                <!-- Creado Por -->
                <td class="px-6 py-3 text-slate-400 uppercase text-[10px] font-extrabold">
                  {{ oficio.creado_por }}
                </td>

                <!-- Estado -->
                <td class="px-6 py-3">
                  <span 
                    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border"
                    :class="{
                      'bg-gray-100 text-gray-700 border-gray-200': oficio.estado === 'Emitido',
                      'bg-blue-100 text-blue-700 border-blue-200': oficio.estado === 'Entregado',
                      'bg-green-100 text-green-700 border-green-200': oficio.estado === 'Con Respuesta',
                      'bg-red-100 text-red-700 border-red-200': oficio.estado === 'Anulado'
                    }"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="{
                      'bg-gray-500': oficio.estado === 'Emitido',
                      'bg-blue-500': oficio.estado === 'Entregado',
                      'bg-green-500': oficio.estado === 'Con Respuesta',
                      'bg-red-500': oficio.estado === 'Anulado'
                    }"></span>
                    {{ oficio.estado }}
                  </span>
                </td>

                <!-- Acciones (Menú Desplegable) -->
                <td class="px-6 py-3 text-center">
                  <div class="inline-block text-left">
                    <button 
                      @click.stop="toggleDropdown($event, oficio)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 font-extrabold text-[11px] uppercase tracking-wider transition duration-150 active:scale-[0.97] min-h-[34px]"
                    >
                      <span v-if="generandoPdfId === oficio.id" class="flex items-center gap-1">
                        <svg class="animate-spin h-3 w-3 text-slate-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </span>
                      <span v-else>Acciones</span>
                      <ChevronDownIcon class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': dropdownAbierto && dropdownAbierto.id === oficio.id }" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vista sin Resultados -->
      <div v-if="oficiosFiltrados.length === 0" class="bg-white border border-slate-100 rounded-3xl p-16 text-center text-slate-400 font-bold">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14 mx-auto mb-3 text-slate-200">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <span class="text-xs">No se encontraron oficios que coincidan con los filtros aplicados.</span>
      </div>

    </div>

    <!-- Modal de Confirmación para Anular Oficio -->
    <Transition name="fade">
      <div v-if="oficioAAnular" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" @click.self="oficioAAnular = null">
        <div class="bg-white rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 text-center border border-red-50">
          <div class="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-5 border border-red-100/50">
            <XCircleIcon class="w-10 h-10 text-red-600" />
          </div>
          <h3 class="font-black text-slate-900 uppercase text-lg tracking-tight mb-2 font-outfit">¿Confirmar Anulación?</h3>
          <p class="text-slate-500 text-xs mb-8 leading-relaxed">
            ¿Está seguro de anular el <span class="font-black text-slate-950">{{ obtenerCodigoVisible(oficioAAnular.correlativo) }}</span> dirigido a <span class="font-black text-slate-950">{{ oficioAAnular.destinatario }}</span>? 
            <br/><br/>
            <span class="text-red-600 font-extrabold uppercase bg-red-50 border border-red-100 rounded-xl px-4 py-2 block font-sans">Esta acción mantendrá el número correlativo pero deshabilitará su validez legal.</span>
          </p>
          <div class="flex gap-4">
            <button 
              @click="oficioAAnular = null" 
              class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition duration-150 active:scale-95 min-h-[44px]"
            >
              Volver
            </button>
            <button 
              @click="confirmarAnulacion" 
              class="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-widest transition duration-150 active:scale-95 shadow-lg shadow-red-600/10 min-h-[44px]"
            >
              Anular
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Menú Desplegable Teletransportado (Evita cortes por scroll/overflow en tablas o cards) -->
    <Teleport to="body">
      <div 
        v-if="dropdownAbierto"
        ref="floatingDropdown"
        :style="dropdownStyle"
        class="fixed rounded-2xl bg-white/95 backdrop-blur-md border border-slate-100 shadow-2xl z-[9999] py-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150 text-left"
        @click.stop
      >
        <!-- Previsualizar -->
        <button 
          @click="previsualizarYDescargarPDF(dropdownAbierto, 'preview'); cerrarDropdowns()"
          class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <EyeIcon class="w-3.5 h-3.5 text-jade-600" />
          <span>Previsualizar Oficio</span>
        </button>

        <!-- Descargar -->
        <button 
          @click="previsualizarYDescargarPDF(dropdownAbierto, 'download'); cerrarDropdowns()"
          class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <ArrowDownTrayIcon class="w-3.5 h-3.5 text-jade-600" />
          <span>Descargar PDF</span>
        </button>

        <!-- Validar Código -->
        <button 
          @click="validarOficio(dropdownAbierto); cerrarDropdowns()"
          class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-[0.98]"
        >
          <ShieldCheckIcon class="w-3.5 h-3.5 text-jade-700" />
          <span>Validar Código</span>
        </button>

        <!-- Separador si hay opciones administrativas -->
        <div v-if="dropdownAbierto.estado !== 'Anulado'" class="border-t border-slate-100 my-1"></div>

        <!-- Opciones Administrativas -->
        <template v-if="dropdownAbierto.estado !== 'Anulado'">
          <!-- Entregar -->
          <button 
            v-if="dropdownAbierto.estado === 'Emitido'"
            @click="cambiarEstado(dropdownAbierto.id, 'Entregado'); cerrarDropdowns()"
            class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50/50 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <CheckIcon class="w-3.5 h-3.5 text-blue-600" />
            <span>Marcar Entregado</span>
          </button>

          <!-- Responder -->
          <button 
            v-if="dropdownAbierto.estado === 'Emitido' || dropdownAbierto.estado === 'Entregado'"
            @click="cambiarEstado(dropdownAbierto.id, 'Con Respuesta'); cerrarDropdowns()"
            class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-green-600 hover:bg-green-50/50 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <ChatBubbleBottomCenterTextIcon class="w-3.5 h-3.5 text-green-600" />
            <span>Marcar con Respuesta</span>
          </button>

          <!-- Anular -->
          <button 
            @click="solicitarAnulacion(dropdownAbierto); cerrarDropdowns()"
            class="w-full text-left px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-red-600 hover:bg-red-50/50 transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <XCircleIcon class="w-3.5 h-3.5 text-red-600" />
            <span>Anular Oficio</span>
          </button>
        </template>
        
        <!-- Indicador de Anulado si aplica -->
        <template v-else>
          <div class="border-t border-slate-100 my-1"></div>
          <div class="px-4 py-1.5 text-[10px] text-red-600 font-black uppercase italic tracking-wider">
            Documento Anulado
          </div>
        </template>
      </div>
    </Teleport>

    <!-- Modal de Previsualización de PDF Teletransportado -->
    <Teleport to="body">
      <Transition name="fade">
        <div 
          v-if="previewPdfUrl" 
          class="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
          @click.self="cerrarPreview"
        >
          <div class="bg-white rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-6 w-full max-w-4xl h-[90vh] sm:h-[85vh] shadow-2xl flex flex-col justify-between border border-slate-100 animate-in zoom-in-95 duration-200">
            <div class="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 class="font-black text-slate-900 uppercase text-xs sm:text-sm tracking-tight font-outfit">Previsualización de Oficio</h3>
                <p class="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{{ previewPdfCodigo }}</p>
              </div>
              <button 
                @click="cerrarPreview" 
                class="p-1.5 sm:p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
              >
                <XCircleIcon class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            
            <!-- Visor PDF (iframe) -->
            <div class="flex-1 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl overflow-hidden relative">
              <iframe 
                :src="previewPdfUrl" 
                class="w-full h-full border-none"
                title="Previsualizador de PDF"
              ></iframe>
            </div>
            
            <!-- Botón de Cerrar/Descargar en Footer -->
            <div class="flex justify-end gap-2.5 sm:gap-3 mt-4 pt-3 border-t border-slate-100">
              <button 
                @click="cerrarPreview" 
                class="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-500 font-extrabold px-4 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition duration-150 active:scale-95 min-h-[38px] flex items-center justify-center"
              >
                Cerrar
              </button>
              <button 
                @click="descargarDesdePreview" 
                class="flex-1 sm:flex-initial bg-jade-600 hover:bg-jade-700 text-white font-extrabold px-4 sm:px-5 py-2.5 rounded-xl text-[10px] sm:text-xs uppercase tracking-widest transition duration-150 active:scale-95 shadow-lg shadow-jade-600/10 min-h-[38px] flex items-center justify-center gap-1.5"
              >
                <ArrowDownTrayIcon class="w-3.5 h-3.5" />
                <span>Descargar</span>
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Barra de Acciones Masivas Flotante (Premium glassmorphism / dark mode) -->
    <Transition name="fade">
      <div v-if="seleccionados.length > 0" class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-xl px-5 py-3 flex items-center justify-between gap-4 w-[92%] max-w-md border border-slate-800 animate-in slide-in-from-bottom duration-300">
        <div class="flex flex-col">
          <span class="text-xs font-black uppercase tracking-wider text-slate-200">Seleccionados</span>
          <span class="text-[10px] text-jade-400 font-bold font-outfit mt-0.5">{{ seleccionados.length }} documento(s)</span>
        </div>
        <div class="flex gap-2">
          <button 
            @click="limpiarSeleccion" 
            class="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition duration-150 active:scale-95"
          >
            Deseleccionar
          </button>
          <button 
            @click="descargarSeleccionadosConsolidado" 
            :disabled="descargandoConsolidado"
            class="px-4 py-2 bg-jade-600 hover:bg-jade-500 disabled:bg-slate-800 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-xl transition duration-150 active:scale-95 flex items-center gap-1.5 min-h-[34px]"
          >
            <span v-if="descargandoConsolidado" class="flex items-center gap-1.5">
              <svg class="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ progresoConsolidado.actual }}/{{ progresoConsolidado.total }}</span>
            </span>
            <span v-else class="flex items-center gap-1.5">
              <ArrowDownTrayIcon class="w-4 h-4" />
              <span>PDF Único</span>
            </span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { supabase } from '@/lib/supabaseClient'
import { showNotification } from '@/events/notificationEvents'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import { 
  PlusIcon, 
  ArrowPathIcon, 
  ShieldCheckIcon, 
  CheckIcon, 
  ChatBubbleBottomCenterTextIcon, 
  XCircleIcon,
  ChevronDownIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'

const oficios = ref([])
const cargando = ref(true)
const oficioAAnular = ref(null)

// Estado del Dropdown y Generación de PDF
const dropdownAbierto = ref(null)
const generandoPdfId = ref(null)

// Estado para la previsualización del PDF en Modal
const previewPdfUrl = ref(null)
const previewPdfCodigo = ref('')

// Variables para la selección múltiple y consolidación
const seleccionados = ref([])
const descargandoConsolidado = ref(false)
const progresoConsolidado = ref({ actual: 0, total: 0 })

const todosSeleccionados = computed(() => {
  return oficiosFiltrados.value.length > 0 && seleccionados.value.length === oficiosFiltrados.value.length
})

const toggleSeleccionarTodos = () => {
  if (todosSeleccionados.value) {
    seleccionados.value = []
  } else {
    seleccionados.value = [...oficiosFiltrados.value]
  }
}

const limpiarSeleccion = () => {
  seleccionados.value = []
}

// Limpiar la selección si cambian los filtros
watch(filtros, () => {
  seleccionados.value = []
}, { deep: true })

const descargarSeleccionadosConsolidado = async () => {
  if (seleccionados.value.length === 0) return
  descargandoConsolidado.value = true
  progresoConsolidado.value = { actual: 0, total: seleccionados.value.length }

  try {
    const mergedPdf = await PDFDocument.create()
    const templatesCache = {}

    // Ordenar los oficios seleccionados por correlativo ascendente
    const oficiosAProcesar = [...seleccionados.value].sort((a, b) => a.correlativo - b.correlativo)

    for (let i = 0; i < oficiosAProcesar.length; i++) {
      const oficio = oficiosAProcesar[i]
      progresoConsolidado.value.actual = i + 1

      let plantillaUrl = ''
      if (oficio.tipo === 'Económico') {
        plantillaUrl = '/plantillas/plantilla-oficio-economico.pdf'
      } else if (oficio.tipo === 'Específico') {
        plantillaUrl = '/plantillas/plantilla-oficio-especifico.pdf'
      } else if (oficio.tipo === 'Invitación') {
        plantillaUrl = '/plantillas/plantilla-oficio-invitacion.pdf'
      } else if (oficio.tipo === 'Deportes') {
        const disciplina = obtenerDisciplinaDeAsunto(oficio.asunto)
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

      if (!plantillaUrl) continue

      let plantillaBytes
      if (templatesCache[plantillaUrl]) {
        plantillaBytes = templatesCache[plantillaUrl]
      } else {
        const response = await fetch(plantillaUrl)
        if (!response.ok) throw new Error(`No se pudo descargar la plantilla base desde: ${plantillaUrl}`)
        plantillaBytes = await response.arrayBuffer()
        templatesCache[plantillaUrl] = plantillaBytes
      }

      const tempDoc = await PDFDocument.load(plantillaBytes)
      const firstPage = tempDoc.getPages()[0]

      const codigoVisible = obtenerCodigoVisible(oficio.correlativo)
      const codigoVerificacion = oficio.codigo_verificacion || codigoVisible
      const validationUrl = `${window.location.origin}/validar?codigo=${codigoVerificacion}&token=${oficio.token_validacion}`
      const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 180 })

      const base64Data = qrDataUrl.split(',')[1]
      const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
      const qrImage = await tempDoc.embedPng(qrBytes)

      const fontBold = await tempDoc.embedFont(StandardFonts.HelveticaBold)
      const fontRegular = await tempDoc.embedFont(StandardFonts.Helvetica)

      const qrX = coordsPredeterminadas.qr.x
      const qrY = coordsPredeterminadas.qr.y
      const qrSize = coordsPredeterminadas.qr.size

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

      const correlativoX = coordsPredeterminadas.correlativo.x
      const correlativoY = coordsPredeterminadas.correlativo.y
      const correlativoSize = coordsPredeterminadas.correlativo.size

      firstPage.drawText(codigoVisible, {
        x: correlativoX,
        y: correlativoY,
        size: correlativoSize,
        font: fontBold,
      })

      if (coordsPredeterminadas.codigoVerificacion) {
        const cvX = coordsPredeterminadas.codigoVerificacion.x
        const cvY = coordsPredeterminadas.codigoVerificacion.y
        const cvSize = coordsPredeterminadas.codigoVerificacion.size

        firstPage.drawText("Código de verificación: ", { x: cvX, y: cvY, size: cvSize, font: fontRegular, color: rgb(0.3, 0.3, 0.3) })
        const labelWidth = fontRegular.widthOfTextAtSize("Código de verificación: ", cvSize)
        firstPage.drawText(codigoVerificacion, { x: cvX + labelWidth, y: cvY, size: cvSize, font: fontBold, color: rgb(0.1, 0.1, 0.1) })
      }

      if (oficio.tipo_emision === 'DIGITAL') {
        if (oficio.tipo === 'Económico') {
          firstPage.drawText(oficio.destinatario.toUpperCase(), {
            x: coordsPredeterminadas.destinatario.x,
            y: coordsPredeterminadas.destinatario.y,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
          })
        } else if (oficio.tipo === 'Específico') {
          firstPage.drawText(oficio.destinatario.toUpperCase(), {
            x: coordsPredeterminadas.destinatario.x,
            y: coordsPredeterminadas.destinatario.y,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
          })
          firstPage.drawText(oficio.asunto, { x: 120, y: 545, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) })
          const asuntoTextoRecortado = splitTextIntoLines(oficio.asunto, 75)
          let currentY = 425
          for (const line of asuntoTextoRecortado) {
            if (currentY < 150) break
            firstPage.drawText(line, { x: 80, y: currentY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) })
            currentY -= 14
          }
        } else if (oficio.tipo === 'Invitación') {
          firstPage.drawText(oficio.destinatario.toUpperCase(), {
            x: coordsPredeterminadas.destinatario.x,
            y: coordsPredeterminadas.destinatario.y,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
          })
          const motivoTextoRecortado = splitTextIntoLines(oficio.asunto, 80)
          let currentY = 460
          for (const line of motivoTextoRecortado) {
            if (currentY < 150) break
            firstPage.drawText(line, { x: 80, y: currentY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) })
            currentY -= 14
          }
        } else if (oficio.tipo === 'Deportes') {
          firstPage.drawText(oficio.destinatario.toUpperCase(), {
            x: coordsPredeterminadas.destinatario.x,
            y: coordsPredeterminadas.destinatario.y,
            size: 10,
            font: fontBold,
            color: rgb(0.1, 0.1, 0.1)
          })
          const descTextoRecortado = splitTextIntoLines(oficio.asunto, 80)
          let currentY = 460
          for (const line of descTextoRecortado) {
            if (currentY < 150) break
            firstPage.drawText(line, { x: 80, y: currentY, size: 10, font: fontRegular, color: rgb(0.1, 0.1, 0.1) })
            currentY -= 14
          }
        }
      }

      const tempBytes = await tempDoc.save()
      const loadedDoc = await PDFDocument.load(tempBytes)
      const copiedPages = await mergedPdf.copyPages(loadedDoc, [0])
      mergedPdf.addPage(copiedPages[0])
    }

    const mergedBytes = await mergedPdf.save()
    const blob = new Blob([mergedBytes], { type: 'application/pdf' })
    const pdfUrl = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = `OFICIOS_CONSOLIDADOS_${new Date().toISOString().substring(0, 10)}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 100)

    showNotification(`Se descargó el archivo con ${oficiosAProcesar.length} oficios unificados.`, 'alert-success')
    seleccionados.value = []
  } catch (err) {
    showNotification('Error al unificar PDFs: ' + err.message, 'alert-error')
  } finally {
    descargandoConsolidado.value = false
  }
}

const cerrarPreview = () => {
  if (previewPdfUrl.value) {
    URL.revokeObjectURL(previewPdfUrl.value)
    previewPdfUrl.value = null
    previewPdfCodigo.value = ''
  }
}

const descargarDesdePreview = () => {
  if (!previewPdfUrl.value) return
  const link = document.createElement('a')
  link.href = previewPdfUrl.value
  link.download = `${previewPdfCodigo.value}.pdf`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch(previewPdfUrl, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden')
  } else {
    document.body.classList.remove('overflow-hidden')
  }
})

// Coordenadas calculadas para el posicionamiento del Dropdown flotante
const dropdownCoords = ref({ top: 0, left: 0, width: 224 })

const toggleDropdown = (event, oficio) => {
  if (dropdownAbierto.value && dropdownAbierto.value.id === oficio.id) {
    dropdownAbierto.value = null
  } else {
    dropdownAbierto.value = oficio
    actualizarPosicionDropdown(event.currentTarget)
  }
}

const cerrarDropdowns = () => {
  dropdownAbierto.value = null
}

const actualizarPosicionDropdown = (el) => {
  if (!el) return
  const rect = el.getBoundingClientRect()
  const dropdownWidth = 224
  const dropdownHeight = 240 // Altura estimada

  let top = rect.bottom + window.scrollY + 6
  let left = rect.right - dropdownWidth + window.scrollX

  if (left < 10) {
    left = 10 + window.scrollX
  }

  const maxLeft = window.innerWidth - dropdownWidth - 10 + window.scrollX
  if (left > maxLeft) {
    left = maxLeft
  }

  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
    top = rect.top + window.scrollY - dropdownHeight - 6
  }

  dropdownCoords.value = {
    top,
    left,
    width: dropdownWidth
  }
}

const dropdownStyle = computed(() => {
  return {
    position: 'absolute',
    top: `${dropdownCoords.value.top}px`,
    left: `${dropdownCoords.value.left}px`,
    width: `${dropdownCoords.value.width}px`
  }
})

// Filtros reactivos
const filtros = ref({
  codigo: '',
  destinatario: '',
  usuario: '',
  estado: ''
})

const limpiarFiltros = () => {
  filtros.value = {
    codigo: '',
    destinatario: '',
    usuario: '',
    estado: ''
  }
}

// Formatear correlativo como el código visible OF-2026-000001-HB
const obtenerCodigoVisible = (correlativo) => {
  return `OF-2026-${String(correlativo).padStart(6, '0')}-HB`
}

// Carga lista dinámica de creadores para el filtro
const listaUsuarios = computed(() => {
  const creadores = oficios.value.map(o => o.creado_por)
  return [...new Set(creadores)].filter(Boolean)
})

// Lógica de filtrado combinable y rápido
const oficiosFiltrados = computed(() => {
  return oficios.value.filter(o => {
    // 1. Filtrar por Código (búsqueda parcial)
    if (filtros.value.codigo) {
      const codVisible = obtenerCodigoVisible(o.correlativo).toLowerCase()
      if (!codVisible.includes(filtros.value.codigo.trim().toLowerCase())) return false
    }

    // 2. Filtrar por Destinatario (búsqueda parcial)
    if (filtros.value.destinatario) {
      const dest = o.destinatario.toLowerCase()
      if (!dest.includes(filtros.value.destinatario.trim().toLowerCase())) return false
    }

    // 3. Filtrar por Creador (exacta)
    if (filtros.value.usuario) {
      if (o.creado_por !== filtros.value.usuario) return false
    }

    // 4. Filtrar por Estado (exacta)
    if (filtros.value.estado) {
      if (o.estado !== filtros.value.estado) return false
    }

    return true
  })
})

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
  } finally {
    cargando.value = false
  }
}

const cambiarEstado = async (id, nuevoEstado) => {
  try {
    const { error } = await supabase
      .from('oficios')
      .update({ estado: nuevoEstado })
      .eq('id', id)

    if (error) throw error
    showNotification(`Estado actualizado a: ${nuevoEstado}`, 'alert-success')
    await cargarOficios()
  } catch (err) {
    showNotification('Error al actualizar estado: ' + err.message, 'alert-error')
  }
}

const solicitarAnulacion = (oficio) => {
  oficioAAnular.value = oficio
}

const confirmarAnulacion = async () => {
  if (!oficioAAnular.value) return
  const targetId = oficioAAnular.value.id
  oficioAAnular.value = null

  try {
    const { error } = await supabase
      .from('oficios')
      .update({ estado: 'Anulado' })
      .eq('id', targetId)

    if (error) throw error
    showNotification('Oficio anulado correctamente', 'alert-success')
    await cargarOficios()
  } catch (err) {
    showNotification('Error al anular el oficio: ' + err.message, 'alert-error')
  }
}

const validarOficio = (oficio) => {
  const codigo = oficio.codigo_verificacion || obtenerCodigoVisible(oficio.correlativo)
  window.open(`/validar?codigo=${codigo}`, '_blank')
}

// Coordenadas predeterminadas calibradas para ubicar el QR en la parte superior derecha (igual que en NuevoOficio.vue)
const coordsPredeterminadas = {
  qr: { x: 505, y: 710, size: 70 },
  correlativo: { x: 89, y: 606, size: 10 },
  destinatario: { x: 160, y: 590 },
  codigoVerificacion: { x: 420, y: 35, size: 7.5 }
}

const obtenerDisciplinaDeAsunto = (asunto) => {
  if (!asunto) return 'Fulbito Femenino'
  const text = asunto.toLowerCase()
  if (text.includes('femenino')) return 'Fulbito Femenino'
  if (text.includes('máster') || text.includes('master')) return 'Fulbito Máster'
  if (text.includes('fútbol libre') || text.includes('futbol libre')) return 'Fútbol Libre'
  if (text.includes('vóley') || text.includes('voley')) return 'Vóley Mixto'
  return 'Fulbito Femenino' // default
}

function splitTextIntoLines(text, charsPerLine) {
  if (!text) return []
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= charsPerLine) {
      currentLine = (currentLine + ' ' + word).trim()
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  if (currentLine) lines.push(currentLine)
  return lines
}

const previsualizarYDescargarPDF = async (oficio, action) => {
  if (generandoPdfId.value) return
  generandoPdfId.value = oficio.id

  try {
    let plantillaUrl = ''

    if (oficio.tipo === 'Económico') {
      plantillaUrl = '/plantillas/plantilla-oficio-economico.pdf'
    } else if (oficio.tipo === 'Específico') {
      plantillaUrl = '/plantillas/plantilla-oficio-especifico.pdf'
    } else if (oficio.tipo === 'Invitación') {
      plantillaUrl = '/plantillas/plantilla-oficio-invitacion.pdf'
    } else if (oficio.tipo === 'Deportes') {
      const disciplina = obtenerDisciplinaDeAsunto(oficio.asunto)
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

    const codigoVisible = obtenerCodigoVisible(oficio.correlativo)
    const codigoVerificacion = oficio.codigo_verificacion || codigoVisible
    const validationUrl = `${window.location.origin}/validar?codigo=${codigoVerificacion}&token=${oficio.token_validacion}`
    const qrDataUrl = await QRCode.toDataURL(validationUrl, { margin: 1, width: 180 })

    const base64Data = qrDataUrl.split(',')[1]
    const qrBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
    const qrImage = await pdfDoc.embedPng(qrBytes)

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)

    const qrX = coordsPredeterminadas.qr.x
    const qrY = coordsPredeterminadas.qr.y
    const qrSize = coordsPredeterminadas.qr.size

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

    const correlativoX = coordsPredeterminadas.correlativo.x
    const correlativoY = coordsPredeterminadas.correlativo.y
    const correlativoSize = coordsPredeterminadas.correlativo.size

    firstPage.drawText(codigoVisible, {
      x: correlativoX,
      y: correlativoY,
      size: correlativoSize,
      font: fontBold,
    })

    if (coordsPredeterminadas.codigoVerificacion) {
      const cvX = coordsPredeterminadas.codigoVerificacion.x
      const cvY = coordsPredeterminadas.codigoVerificacion.y
      const cvSize = coordsPredeterminadas.codigoVerificacion.size

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

    if (oficio.tipo_emision === 'DIGITAL') {
      if (oficio.tipo === 'Económico') {
        firstPage.drawText(oficio.destinatario.toUpperCase(), {
          x: coordsPredeterminadas.destinatario.x,
          y: coordsPredeterminadas.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })
      }

      else if (oficio.tipo === 'Específico') {
        firstPage.drawText(oficio.destinatario.toUpperCase(), {
          x: coordsPredeterminadas.destinatario.x,
          y: coordsPredeterminadas.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        firstPage.drawText(oficio.asunto, {
          x: 120,
          y: 545,
          size: 10,
          font: fontRegular,
          color: rgb(0.1, 0.1, 0.1)
        })

        const asuntoTextoRecortado = splitTextIntoLines(oficio.asunto, 75)
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

      else if (oficio.tipo === 'Invitación') {
        firstPage.drawText(oficio.destinatario.toUpperCase(), {
          x: coordsPredeterminadas.destinatario.x,
          y: coordsPredeterminadas.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        const motivoTextoRecortado = splitTextIntoLines(oficio.asunto, 80)
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

      else if (oficio.tipo === 'Deportes') {
        firstPage.drawText(oficio.destinatario.toUpperCase(), {
          x: coordsPredeterminadas.destinatario.x,
          y: coordsPredeterminadas.destinatario.y,
          size: 10,
          font: fontBold,
          color: rgb(0.1, 0.1, 0.1)
        })

        const descTextoRecortado = splitTextIntoLines(oficio.asunto, 80)
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
    const pdfUrl = URL.createObjectURL(blob)

    if (action === 'preview') {
      previewPdfUrl.value = pdfUrl
      previewPdfCodigo.value = codigoVisible
    } else {
      const link = document.createElement('a')
      link.href = pdfUrl
      link.download = `${codigoVisible}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 100)
    }

  } catch (err) {
    showNotification('Error al timbrar PDF: ' + err.message, 'alert-error')
  } finally {
    generandoPdfId.value = null
  }
}

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return ''
  const fecha = new Date(fechaStr)
  return fecha.toLocaleDateString('es-PE')
}

let channel = null
const suscribirTiempoReal = () => {
  channel = supabase
    .channel('cambios-listado-oficios')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'oficios' }, () => {
      cargarOficios()
    })
    .subscribe()
}

onMounted(() => {
  cargarOficios()
  suscribirTiempoReal()
  window.addEventListener('click', cerrarDropdowns)
  window.addEventListener('scroll', cerrarDropdowns, { passive: true })
  document.addEventListener('scroll', cerrarDropdowns, { capture: true, passive: true })
})

onUnmounted(() => {
  if (channel) {
    supabase.removeChannel(channel)
  }
  window.removeEventListener('click', cerrarDropdowns)
  window.removeEventListener('scroll', cerrarDropdowns)
  document.removeEventListener('scroll', cerrarDropdowns, { capture: true })
})
</script>
