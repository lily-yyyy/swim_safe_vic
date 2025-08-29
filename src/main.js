// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import 'bootstrap/dist/css/bootstrap.min.css' 
import './styles/style.css' 


createApp(App).use(router).mount('#app')

