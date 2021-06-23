import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import excel from 'vue-excel-export'
import axios from 'axios'

//const url = ''
//const url = 'http://192.168.1.34:8087'
const url = 'https://localhost:5001'
//const url = 'https://localhost:44393'

Vue.use(excel)
Vue.config.productionTip = false

Vue.filter('currency', (value) => {
  let val = (value / 1).toFixed(2).replace(',', '.')
  return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
})
Vue.filter('textcrop', (value, len) => {
  return (value.length > len) ? value.substr(0, len) + '...' : value;
})

const axiosInstance = axios.create({
  baseURL: url,
  params: {},
  headers: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json; charset=utf8'
    }
  }
})

axiosInstance.interceptors.request.use(function (config) {
  const routeid = localStorage.getItem('routeid')
  const b1session = localStorage.getItem('b1session')
  config.headers["routeid"] = routeid
  config.headers["b1session"] = b1session
  return config
})

Vue.prototype.$axios = axios

export {
  axiosInstance
}

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
