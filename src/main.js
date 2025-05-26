import { createApp } from 'vue'
import './assets/main.css'
import App from './App.vue'
import { router } from './router'
import { createPinia } from 'pinia'

/* Font Awesome kurulumu */
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEye, faTimes } from '@fortawesome/free-solid-svg-icons'
// İhtiyacınız olan diğer ikonları buraya ekleyin

library.add(faEye, faTimes)
const pinia = createPinia()
createApp(App)
    .use(router)
    .use(pinia)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')