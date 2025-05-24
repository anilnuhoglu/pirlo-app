<script setup>
import { ref } from 'vue'
import axios from 'axios'

const menu = ref({
  categories: [
    {
      name: 'Yeni Kategori',
      products: [
        { id: 'urun-id', name: 'Yeni Ürün', price: 0, description: '...' }
      ]
    }
  ]
})

const upload = async () => {
  const file = new File([JSON.stringify(menu.value)], "menu.json", { type: "application/json" })

  const { data } = await axios.get('/api/s3-upload-url') // Bu fonksiyonu ileride yazacağız
  await axios.put(data.url, file, {
    headers: { 'Content-Type': 'application/json' }
  })

  alert("Yüklendi!")
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Admin Panel</h1>
    <pre>{{ menu }}</pre>
    <button @click="upload" class="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
      Güncelle ve Yükle
    </button>
  </div>
</template>
