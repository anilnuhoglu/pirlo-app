import { createRouter, createWebHistory } from 'vue-router'
import MenuPage from './pages/MenuPage.vue'
import AdminPage from './pages/AdminPage.vue'

const routes = [
  { path: '/menu', component: MenuPage },
  { path: '/admin', component: AdminPage }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
