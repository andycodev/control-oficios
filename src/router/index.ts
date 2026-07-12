import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabaseClient'

const routes = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, layout: 'public' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/nuevo-oficio',
    name: 'nuevo-oficio',
    component: () => import('@/views/NuevoOficio.vue'),
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/listado-oficios',
    name: 'listado-oficios',
    component: () => import('@/views/ListadoOficios.vue'),
    meta: { requiresAuth: true, layout: 'main' }
  },
  {
    path: '/validar',
    name: 'validar',
    component: () => import('@/views/Validar.vue'),
    meta: { requiresAuth: false, layout: 'public' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/dashboard',
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de autenticación para proteger rutas privadas
router.beforeEach(async (to, _from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router