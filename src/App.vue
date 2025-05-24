<template>
  <div class="max-w-3xl mx-auto mt-10">
    <nav class="flex gap-4 mb-6">
      <router-link to="/menu" class="text-blue-500">Menü</router-link>
      <router-link to="/admin" class="text-blue-500">Admin</router-link>
    </nav>
    <router-view />
  </div>
</template>
