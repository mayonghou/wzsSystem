import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import axios from './axios'
import socket from './socket'

Vue.prototype.$axios = axios;
Vue.prototype.$websocket = socket;
Vue.use(ElementUI);
//放入全局

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
