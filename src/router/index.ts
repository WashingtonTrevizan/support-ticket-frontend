// Router configuration
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import TestLogin from '../pages/TestLogin.vue'
import SimpleLogin from '../pages/SimpleLogin.vue'
import WorkingLogin from '../pages/WorkingLogin.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/working-login',
    name: 'WorkingLogin',
    component: WorkingLogin
  },
  {
    path: '/test-login',
    name: 'TestLogin',
    component: TestLogin
  },
  {
    path: '/simple-login',
    name: 'SimpleLogin',
    component: SimpleLogin
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true },
    children: [
      // Sub-rotas do dashboard podem ser adicionadas aqui
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard de navegação para rotas autenticadas
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  const isAuthenticated = !!token
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Redirecionando para login - usuário não autenticado')
    next('/login')
  } else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) {
    console.log('Redirecionando para dashboard - usuário já autenticado')
    next('/dashboard')
  } else {
    next()
  }
})

export default router
