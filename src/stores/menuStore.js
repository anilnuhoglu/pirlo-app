import { defineStore } from 'pinia'
import { fetchLatestMenuData } from '../utils/menuStorage'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: null,
    loading: false,
  }),
  actions: {
    async fetchMenu() {
      this.loading = true
      try {
        this.menu = await fetchLatestMenuData()
      } catch (error) {
        console.error('Menü yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    },
    reset() {
      this.menu = null
      this.loading = false
    }
  }
})
