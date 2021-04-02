import Vue from 'vue'
import Vuex from 'vuex'
import { axiosInstance } from '../main'

Vue.use(Vuex)

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
      axiosInstance.get(`/api/dataapp/sociedades`)
        .then(res => {
          commit('SET_SOCIEDADES', res.data)
        })
    },
    getSucursales: ({ commit }, sociedad) => {
      return new Promise((resolve, reject) => {
        axiosInstance.get(`/api/dataapp/sucursales?sociedad=${sociedad}`)
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
        axiosInstance.get(`/api/dataapp/cuentas?sociedad=${data.sociedad}&sucursal=${data.sucursal}`)
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
        axiosInstance.get(`/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&cuenta=${data.cuenta}&operacion=${data.operacion}`)
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
        axiosInstance.get(`/api/dataapp/transferencias`)
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
      let postUrl = `/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&operacion=${data.operacion}&u=${user}&p=${pass}`
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
      let postUrl = `/api/dataapp/transferenciasbyone?u=${user}&p=${pass}`
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
      axiosInstance.get(`/api/dataapp/sdaldia?fecha=${fecha}`)
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
        axiosInstance.post(`/api/dataapp/login`, data)
          .then(res => {
            commit('SET_LOGIN', true)
            localStorage.setItem('b1session', res.headers['b1session'])
            localStorage.setItem('routeid', res.headers['routeid'])
            resolve(true)
          }).catch(err => {
            reject(false)
          })
      })
    },
    loginSap: async ({ commit }, data) => {
      try {
        const req = await axiosInstance.post('https://192.168.1.30:50000/b1s/v1/Login', {
          CompanyDB: 'SBODEMOGOVI2020',
          UserName: data.UserName,
          Password: data.Password
        }, { withCredentials: true })
        const res = await req.data

        console.log(res)
        return true
      } catch (error) {
        console.error(error)
        return false
      }
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
        const req = await axiosInstance.get(`/api/dataapp/cedis`)
        const data = await req.data
        commit('setCedis', data)
      } catch (error) {
        console.log(error)
      }
    },
    postAjuste: ({ commit }, info) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem('user')
          axiosInstance.post(`/api/dataapp/${info.Tipo}?u=${user}`, info)
            .then(res => resolve(res))
            .catch(err => reject(err))
        } catch (error) {
          console.log(error)
          reject(error)
        }
      })
    },
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
