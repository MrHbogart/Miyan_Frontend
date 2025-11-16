// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import MiyanView from '@/views/Miyan/MiyanView.vue'
import MiyanBereshtView from '@/views/MiyanBeresht/MiyanBeresht.vue'
import MiyanMadiView from '@/views/MiyanMadi/MiyanMadi.vue'
import MiyanLanding from '@/views/Miyan/MiyanLanding.vue'
import MiyanGallery from '@/views/Miyan/MiyanGallery.vue'
import MiyanProjects from '@/views/Miyan/MiyanProjects.vue'
import MiyanBereshtLanding from '@/views/MiyanBeresht/MiyanBereshtLanding.vue'
import MiyanBereshtBaseMenu from '@/views/MiyanBeresht/MiyanBereshtBaseMenu.vue'
import MiyanBereshtDailyMenu from '@/views/MiyanBeresht/MiyanBereshtDailyMenu.vue'
import MiyanMadiLanding from '@/views/MiyanMadi/MiyanMadiLanding.vue'
import MiyanMadiBaseMenu from '@/views/MiyanMadi/MiyanMadiBaseMenu.vue'
import MiyanMadiDailyMenu from '@/views/MiyanMadi/MiyanMadiDailyMenu.vue'
import { lang as appLang, setLang } from '@/state/lang'

const routes = [
  {
    path: '/:lang(en|fa)?/',
    name: 'Miyan',
    component: MiyanView,
    children: [
      { path: '', name: 'MiyanLanding', component: MiyanLanding },
      { path: 'gallery', name: 'MiyanGallery', component: MiyanGallery },
      { path: 'projects', name: 'MiyanProjects', component: MiyanProjects },
    ],
  },
  {
    path: '/:lang(en|fa)?/beresht',
    name: 'MiyanBeresht',
    component: MiyanBereshtView,
    children: [
      { path: '', name: 'MiyanBereshtLanding', component: MiyanBereshtLanding },
      { path: 'menu', name: 'MiyanBereshtBaseMenu', component: MiyanBereshtBaseMenu },
      { path: 'daily-menu', name: 'MiyanBereshtDailyMenu', component: MiyanBereshtDailyMenu },
    ],
  },
  {
    path: '/:lang(en|fa)?/madi',
    name: 'MiyanMadi',
    component: MiyanMadiView,
    children: [
      { path: '', name: 'MiyanMadiLanding', component: MiyanMadiLanding },
      { path: 'menu', name: 'MiyanMadiBaseMenu', component: MiyanMadiBaseMenu },
      { path: 'daily-menu', name: 'MiyanMadiDailyMenu', component: MiyanMadiDailyMenu },
    ],
  },
  // fallback: redirect everything else to default language root
  { path: '/:pathMatch(.*)*', redirect: '/fa/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})

// Ensure default language prefix
router.beforeEach((to, from, next) => {
  let routeLang = to.params.lang

  if (!routeLang) {
    const seg = to.path.split('/').filter(Boolean)[0]
    if (['en', 'fa'].includes(seg)) routeLang = seg
  }

  if (!routeLang) {
    const defaultLang = appLang.value || 'fa'
    const newPath = `/${defaultLang}${to.fullPath.startsWith('/') ? '' : '/'}${to.fullPath}`
    return next({ path: newPath })
  }

  if (appLang.value !== routeLang) setLang(routeLang)
  next()
})

export default router
