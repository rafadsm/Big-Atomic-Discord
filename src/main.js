import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
    
import router from '@/pages/router'

import store from './store/index.js'

Vue.use(VueAxios, axios)
Vue.use(BootstrapVue)

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
