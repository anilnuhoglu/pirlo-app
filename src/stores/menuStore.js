import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menu: null,
    loading: false,
  }),
  actions: {
    async fetchMenu() {
      this.loading = true
      try {
        const res = await fetch('https://pirlo-menu-app.s3.eu-central-1.amazonaws.com/menu.json')
        this.menu = await res.json()
      } catch (error) {
        console.error('Menü yüklenirken hata oluştu:', error)
      } finally {
        this.loading = false
      }
    }
  }
})