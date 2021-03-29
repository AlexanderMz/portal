import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)
let url = ''
//let url = 'https://localhost:44393'
//let url = 'http://localhost:8082'

/**
 * Dispercion
 * */
const Dispersion = {
  state: () => ({
    sociedades: [],
    sucursales: [],
    cuentas: [],
    transferencias: []
  }),
  mutations: {
    SET_SOCIEDADES: (state, datos) => {
      state.sociedades = datos
    },
    SET_SUCURSALES: (state, datos) => {
      state.sucursales = []
      state.sucursales = datos
    },
    SET_CUENTAS: (state, datos) => {
      state.cuentas = []
      state.cuentas = datos
    },
    SET_TRANSFERS: (state, datos) => {
      state.transferencias = []
      state.transferencias = datos
    }
  },
  actions: {
    getSociedades: ({ commit }) => {
      axios.get(`${url}/api/dataapp/sociedades`)
        .then(res => {
          commit('SET_SOCIEDADES', res.data)
        })
    },
    getSucursales: ({ commit }, sociedad) => {
      return new Promise((resolve, reject) => {
        axios.get(`${url}/api/dataapp/sucursales?sociedad=${sociedad}`)
          .then(res => {
            commit('SET_SUCURSALES', res.data)
            resolve(true)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    getCuentas: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axios.get(`${url}/api/dataapp/cuentas?sociedad=${data.sociedad}&sucursal=${data.sucursal}`)
          .then(res => {
            commit('SET_CUENTAS', res.data)
            resolve(true)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    getTransfers: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axios.get(`${url}/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&cuenta=${data.cuenta}&operacion=${data.operacion}`)
          .then(res => {
            commit('SET_TRANSFERS', res.data)
            resolve(true)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    getAllTransfers: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axios.get(`${url}/api/dataapp/transferencias`)
          .then(res => {
            commit('SET_TRANSFERS', res.data)
            resolve(true)
          })
          .catch(err => {
            reject(err.response.data)
          })
      })
    },
    generarTxtxLote: ({ commit }, data) => {
      let user = localStorage.getItem('user')
      let pass = localStorage.getItem('pass')
      let postUrl = `${url}/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&operacion=${data.operacion}&u=${user}&p=${pass}`
      return new Promise((resolve, reject) => {
        fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data.transferencias)
        }).then(res => {
          let filename = res.headers.get('filename')
          // res.blob().then(val => {
          //   const sUrl = window.URL.createObjectURL(val)
          //   //download(val, filename, 'application/pdf')
          // })
          resolve({ url: '', filename })
        }).catch(err => {
          reject(err)
        })
      })
    },
    generarTxtUnoxUno: ({ commit }, data) => {
      let user = localStorage.getItem('user')
      let pass = localStorage.getItem('pass')
      let postUrl = `${url}/api/dataapp/transferenciasbyone?u=${user}&p=${pass}`
      return new Promise((resolve, reject) => {
        fetch(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data.transferencias)
        }).then(res => {
          res.json().then(json => {
            resolve(json)
          })
        }).catch(err => {
          reject(err)
        })
      })
    }
  },
}
/**
 * Informes
 * */
const Informes = {
  state: () => ({
    sdaldia: [],
  }),
  mutations: {
    SET_SD: (state, datos) => {
      state.sdaldia = datos
    }
  },
  actions: {
    getDatos: ({ commit }, fecha) => {
      commit('SET_SD', [])
      axios.get(`${url}/api/dataapp/sdaldia?fecha=${fecha}`)
        .then(res => {
          commit('SET_SD', res.data)
        })
    }
  }
}
/**
 * Login
 */
const LoginModule = {
  state: () => ({
    isLogin: null
  }),
  mutations: {
    SET_LOGIN: (state, datos) => {
      state.isLogin = datos
    }
  },
  actions: {
    login: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axios.post(`${url}/api/dataapp/login`, data)
          .then(res => {
            commit('SET_LOGIN', true)
            resolve(true)
          }).catch(err => {
            reject(false)
          })
      })
    }
  }
}
/**
 * Ajustes
 */
const AjustesModule = {
  state: () => ({
    cedis: []
  }),
  mutations: {
    setCedis: (state, datos) => {
      state.cedis = datos
    }
  },
  actions: {
    getCedis: async ({ commit }) => {
      try {
        const req = await axios.get(`${url}/api/dataapp/cedis`)
        const data = await req.data
        commit('setCedis', data)
      } catch (error) {
        console.log(error)
      }
    },
    postSalida: async ({ commit }, info) => {
      try {
        let user = localStorage.getItem('user')
        const req = await axios.post(`${url}/api/dataapp/salida?u=${user}`, info)
        const data = await req.data
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    },
    postEntradas: async ({ commit }) => {
      try {
        let user = localStorage.getItem('user')
        const req = await axios.post(`${url}/api/dataapp/entrada?u=${user}`, info)
        const data = await req.data
        return true
      } catch (error) {
        console.log(error)
        return false
      }
    }
  }
}
export default new Vuex.Store({
  modules: {
    dispersion: Dispersion,
    informes: Informes,
    login: LoginModule,
    ajustes: AjustesModule
  }
})
