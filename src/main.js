import axios from "axios";
import Vue from "vue";
import excel from "vue-excel-export";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";

let url = "";
//url = "http://192.168.1.206:8087";
//url = 'https://localhost:5001'
//url = 'https://localhost:44393'
url = "http://172.28.124.54:8080";

Vue.use(excel);
Vue.config.productionTip = false;

Vue.filter("currency", (value) => {
  let val = (value / 1).toFixed(2).replace(",", ".");
  return "$" + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});
Vue.filter("textcrop", (value, len) => {
  return value.length > len ? value.substr(0, len) + "..." : value;
});

const axiosInstance = axios.create({
  baseURL: url,
  params: {},
  headers: {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf8",
    },
  },
});

axiosInstance.interceptors.request.use(function(config) {
  const routeid = localStorage.getItem("routeid");
  const b1session = localStorage.getItem("b1session");
  config.headers["routeid"] = routeid;
  config.headers["b1session"] = b1session;
  return config;
});

Vue.prototype.$axios = axios;

export { axiosInstance };

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
