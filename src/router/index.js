import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        desc: 'Inicio '
      },
      {
        path: '/dispersion',
        name: 'Dispersion',
        component: () => import('../views/Dispersion.vue'),
        desc: 'Dispersion '
      },
      {
        path: '/dispersion_1',
        name: 'Dispersion 1 a 1',
        component: () => import('../views/Dispersion_1.vue'),
        desc: 'Dispersion 1 a 1'
      },
      {
        path: '/informes',
        name: 'Informes',
        component: () => import('../views/Informes.vue'),
        desc: 'Informes'
      },
      {
        path: '/generados',
        name: 'FoliosGenerados',
        component: () => import('../views/FoliosGenerados.vue'),
        desc: 'Folios Generados'
      },
      {
        path: '/tunel',
        name: 'TunelBancario',
        component: () => import('../views/TunelBancario.vue'),
        desc: 'Tunel Bancario'
      },
      {
        path: '/informetunel',
        name: 'InformeTunel',
        component: () => import('../views/InformeTunel.vue'),
        desc: 'Informe Tunel Bancario'
      },
      {
        path: '/ajustesalida',
        name: 'AjusteSalidaInventario',
        component: () => import('../views/AjusteSalida.vue'),
        desc: 'Ajuste de salida de inventario'
      },
      {
        path: '/ajusteentrada',
        name: 'AjusteEntradaInventario',
        component: () => import('../views/AjusteEntrada.vue'),
        desc: 'Ajuste de entrada de inventario'
      }]
  },
  {
    path: '/login',
    component: () => import('../layouts/Login.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    desc: 'About'
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('../views/Error404.vue')
  }
]

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem('jwt') == null) {
      localStorage.setItem('nextUrl', to.fullPath)
      next({ path: '/login' })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem('jwt') == null) {
      next({ path: '/' })
    }
    else {
      next()
    }
  } else {
    next()
  }
})

export default router
