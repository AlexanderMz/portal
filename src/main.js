import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import excel from 'vue-excel-export'

Vue.use(excel)
Vue.config.productionTip = false

Vue.filter('currency', (value) => {
  let val = (value / 1).toFixed(2).replace('.', ',')
  return '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
})
Vue.filter('textcrop', (value, len) => {
  return (value.length > len) ? value.substr(0, len) + '...' : value;
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
