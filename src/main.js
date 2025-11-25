import { createApp } from 'vue'
import App from './App.vue'
import './tailwind.css'
import './styles.css'
import './styles/fonts.css'
import 'leaflet/dist/leaflet.css'
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
