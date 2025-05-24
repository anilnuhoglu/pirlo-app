<script setup>
import { ref, onMounted } from 'vue'

const menu = ref(null)

onMounted(async () => {
  const res = await fetch('https://pirlo-menu-app.s3.eu-central-1.amazonaws.com/menu.json')
  menu.value = await res.json()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Menü</h1>
    <div v-if="menu">
      <div v-for="category in menu.categories" :key="category.name" class="mb-4">
        <h2 class="text-xl font-semibold">{{ category.name }}</h2>
        <ul class="pl-4">
          <li v-for="product in category.products" :key="product.id">
            {{ product.name }} - {{ product.price }}₺
          </li>
        </ul>
      </div>
    </div>
    <div v-else>Yükleniyor...</div>
  </div>
</template>
