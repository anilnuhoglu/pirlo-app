<template>
  <div class="main-container">
    <div class="menu-button-icon">
      <div class="menu-button-icon-image">
        <img class="menu-button-icon-image-img" src="@/assets/pirlo.svg" alt="Pirlo Ristorante">
      </div>
    </div>
    <div class="menu-button-container" v-if="$route.path === '/'">
      <router-link class="menu-button-link" to="/menu">
        <div class="menu-button">
          Menu
        </div>
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
.main-container {
  min-width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-button-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  min-width: 200px;
  min-height: 100px;
  margin-bottom: 10px;
  background-color: #ffe6d3;
  border-radius: 5px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.menu-button-container:hover {
  background-color: #2c2c2c;
  transform: translate(-50%, -50%) scale(1.15);
  color: #ffe6d3;
}

.menu-button-link {
  text-decoration: none;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-button {
  padding: 10px;
  border-radius: 5px;
  font-size: 24px;  
  cursor: pointer;
  color: #722F37;
  margin:auto;
}

.menu-button-icon {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.menu-button-icon-image-img {
  height: 150px;
  width: auto;
  object-fit: cover;
  aspect-ratio: 2 / 1;
}
</style>
