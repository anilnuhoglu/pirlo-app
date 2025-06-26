import { createRouter, createWebHistory } from 'vue-router'
import IndexPage from './pages/index.vue'
import MenuPage from './pages/MenuPage.vue'
import AdminPage from './pages/AdminPage.vue'

const routes = [
  { path: '/', component: IndexPage },
  { path: '/menu', component: MenuPage },
  // { path: '/admin', component: AdminPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
