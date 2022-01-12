import { createApp } from 'vue'
import App from './App.vue'

import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

import 'material-design-icons/iconfont/material-icons.css' 

import router from './router/router.js'

import store from './store/store.js'

createApp(App).use(router).use(store).mount('#app')