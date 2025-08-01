import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { axiosInstance } from "../main";

Vue.use(Vuex);

/**
 * Config
 */
const Config = {
  namespaced: true,
  state: () => ({
    menus: [],
    canCreate: true,
  }),
  getters: {
    doneMenu: (state) => state.menus,
    doneCanCreate: (state) => state.canCreate,
  },
  mutations: {
    SET_MENUS: (state, datos) => {
      state.menus = datos;
    },
    SET_CANCREATE: (state, datos) => {
      state.canCreate = datos;
    },
  },
  actions: {
    getMenu: ({ commit, rootState }) => {
      let user = rootState.login.userName;
      axiosInstance.get(`/api/config/menu?u=${user}`).then((res) => {
        commit("SET_MENUS", res.data);
      });
    },
  },
};
/**
 * Dispercion
 * */
const Dispersion = {
  namespaced: true,
  state: () => ({
    sociedades: [],
    sucursales: [],
    cuentas: [],
    transferencias: [],
    pasivos: [],
    transferenciasDispersion: [],
    services: [],
  }),
  mutations: {
    SET_SOCIEDADES: (state, datos) => {
      state.sociedades = datos;
    },
    SET_SUCURSALES: (state, datos) => {
      state.sucursales = [];
      state.sucursales = datos;
    },
    SET_CUENTAS: (state, datos) => {
      state.cuentas = [];
      state.cuentas = datos;
    },
    SET_TRANSFERS: (state, datos) => {
      state.transferencias = [];
      state.transferencias = datos;
    },
    SET_PASIVOS: (state, datos) => {
      state.pasivos = [];
      state.pasivos = datos;
    },
    SET_TRANSFERSDISPERSION: (state, datos) => {
      state.transferenciasDispersion = [];
      state.transferenciasDispersion = datos;
    },
    SET_SERVICES: (state, datos) => {
      state.services = [];
      state.services = datos;
    },
  },
  actions: {
    limpiar: ({ commit }) => {
      commit("SET_TRANSFERS", []);
      commit("SET_TRANSFERSDISPERSION", []);
    },
    getSociedades: ({ commit }) => {
      axiosInstance.get(`/api/dataapp/sociedades`).then((res) => {
        commit("SET_SOCIEDADES", res.data);
      });
    },
    getSucursales: ({ commit }, sociedad) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/api/dataapp/sucursales?sociedad=${sociedad}`)
          .then((res) => {
            commit("SET_SUCURSALES", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getCuentas: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/dataapp/cuentas?sociedad=${data.sociedad}&sucursal=${data.sucursal}`
          )
          .then((res) => {
            commit("SET_CUENTAS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getTransfers: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&cuenta=${data.cuenta}&operacion=${data.operacion}&year=${data.year}`
          )
          .then((res) => {
            commit("SET_TRANSFERS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getPasivos: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/dataapp/pasivos?sociedad=${data.sociedad}&sucursal=${data.sucursal}&cuenta=${data.cuenta}`
          )
          .then((res) => {
            commit("SET_PASIVOS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    postPasivos: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem("user");
          let pass = localStorage.getItem("pass");
          axiosInstance
            .post(
              `/api/dataapp/pasivos?u=${user}&p=${pass}&sociedad=${data.sociedad}`,
              data.info
            )
            .then((res) => resolve(res.data))
            .catch((err) => reject(err.response));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    getAllTransfers: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/api/dataapp/transferencias`)
          .then((res) => {
            commit("SET_TRANSFERS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getAllTransfersDispersion: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/dataapp/transferenciasDispersion?sociedad=${data.sociedad}&fecha1=${data.fecha1}&fecha2=${data.fecha2}`
          )
          .then((res) => {
            commit("SET_TRANSFERSDISPERSION", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getAllServices: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/api/dataapp/servicios`)
          .then((res) => {
            commit("SET_SERVICES", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    updateDispersion: ({ commit }, data) => {
      let user = localStorage.getItem("user");
      let pass = localStorage.getItem("pass");
      let postUrl = `/api/dataapp/updateDispersion?sociedad=${data.sociedad}&u=${user}&p=${pass}`;
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(postUrl, data.transferencias)
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    },
    generarTxtxLote: ({ commit }, data) => {
      let user = localStorage.getItem("user");
      let pass = localStorage.getItem("pass");
      let postUrl = `/api/dataapp/transferencias?sociedad=${data.sociedad}&sucursal=${data.sucursal}&operacion=${data.operacion}&u=${user}&p=${pass}`;
      return new Promise((resolve, reject) => {
        fetch(postUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data.transferencias),
        })
          .then((res) => {
            let filename = res.headers.get("filename");
            resolve({ url: "", filename });
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    generarTxtUnoxUno: ({ commit }, data) => {
      let user = localStorage.getItem("user");
      let pass = localStorage.getItem("pass");
      let postUrl = `/api/dataapp/transferenciasbyone?u=${user}&p=${pass}&g=${data.g}`;
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(postUrl, data.transferencias)
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    },
    generarTxtServices: ({ commit }, data) => {
      let user = localStorage.getItem("user");
      let pass = localStorage.getItem("pass");
      let postUrl = `/api/dataapp/servicios?u=${user}&p=${pass}&g=${data.g}`;
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(postUrl, data.services)
          .then((res) => resolve(res.data))
          .catch((err) => reject(err));
      });
    },
    postPagosFiliales: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem("user");
          let pass = localStorage.getItem("pass");
          axiosInstance
            .post(
              `/api/dataapp/pagofiliales?u=${user}&p=${pass}&sociedad=${data.sociedad}&sucursal=${data.sucursal}&proveedor=${data.proveedor}`,
              data.info
            )
            .then((res) => resolve(res))
            .catch((err) => reject(err.response));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
  },
};
/**
 * Informes
 * */
const Informes = {
  namespaced: true,
  state: () => ({
    sdaldia: [],
    foliosGenerados: [],
    infoTransfers: [],
    detallTransfers: [],
    rows: [],
    cols: [],
    uuidlist: [],
    parameters: [],
    loadingInfo: false,
    title: "",
  }),
  mutations: {
    SET_SD: (state, datos) => {
      state.sdaldia = datos;
    },
    SET_INFOTRANSFERS: (state, datos) => {
      state.infoTransfers = datos;
    },
    SET_DETAILSTRANSFERS: (state, datos) => {
      state.detallTransfers = datos;
    },
    SET_ROWS: (state, datos) => {
      state.rows = datos;
    },
    SET_COLS: (state, datos) => {
      state.cols = datos;
    },
    SET_PROPS: (state, datos) => {
      state.parameters = datos;
    },
    SET_CARGANDO: (state, datos) => {
      state.loadingInfo = datos;
    },
    SET_TITLE: (state, datos) => {
      state.title = datos;
    },
    SET_UUIDSTATE: (state, datos) => {
      state.uuidlist = datos;
    },
  },
  actions: {
    limpiar: ({ commit }) => {
      commit("SET_COLS", []);
      commit("SET_PROPS", []);
      commit("SET_ROWS", []);
      commit("SET_UUIDSTATE", []);
    },

    getDatos: ({ commit }, fecha) => {
      commit("SET_SD", []);
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/api/dataapp/sdaldia?fecha=${fecha}`)
          .then((res) => {
            commit("SET_SD", res.data);
            resolve();
          })
          .catch(() => reject());
      });
    },
    getInfoTransfers: ({ commit }, fecha) => {
      commit("SET_INFOTRANSFERS", []);
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(`/api/dataapp/infotransfers`, fecha)
          .then((res) => {
            if (res.data.length > 0) {
              commit("SET_INFOTRANSFERS", res.data);
              resolve();
            } else reject();
          })
          .catch(() => reject());
      });
    },
    getDetailsTransfers: ({ commit }, data) => {
      commit("SET_DETAILSTRANSFERS", []);
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(
            `/api/dataapp/detailstransfers?empresa=${data.empresa}`,
            data.fechas
          )
          .then((res) => {
            commit("SET_DETAILSTRANSFERS", res.data);
            resolve();
          })
          .catch(() => reject());
      });
    },
    getInforme: async ({ commit }, params) => {
      commit("SET_ROWS", []);
      try {
        commit("SET_CARGANDO", true);
        const req = await axiosInstance.get(
          `/api/dataapp/informe?informe=${params.id}`
        );
        const data = await req.data;
        commit("SET_ROWS", data.rows);
        commit("SET_CARGANDO", false);
      } catch (error) {
        commit("SET_CARGANDO", false);
        console.log(error);
      }
    },
    getParametros: async ({ commit }, id) => {
      commit("SET_COLS", []);
      commit("SET_PROPS", []);
      try {
        const req = await axiosInstance.get(
          `/api/dataapp/parametros?informe=${id}`
        );
        const data = await req.data;
        commit("SET_COLS", data.cols);
        commit("SET_PROPS", data.props);
      } catch (error) {
        console.log(error);
      }
    },
    getUUIDStatus: async ({ commit }, date) => {
      commit("SET_UUIDSTATE", []);
      try {
        commit("SET_CARGANDO", true);
        const req = await axiosInstance.get(`/api/Cancelacion?fecha=${date}`);
        const data = await req.data;
        commit("SET_UUIDSTATE", data);
        commit("SET_CARGANDO", false);
      } catch (error) {
        commit("SET_CARGANDO", false);
        console.log(error);
      }
    },
    getCuadroInversion: async ({ commit }, fechas) => {
      try {
        const req = await axiosInstance.get(
          `/api/dataapp/cuadroinversion?inputFechas=${fechas}`
        );
        const data = await req.data;
        return data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
  },
};
/**
 * Login
 */
const LoginModule = {
  namespaced: true,
  state: () => ({
    isLogin: null,
    userName: "",
    userPass: "",
  }),
  mutations: {
    SET_LOGIN: (state, datos) => {
      state.isLogin = datos;
    },
    SET_USERNAME: (state, datos) => {
      state.userName = datos;
    },
    SET_USERPASS: (state, datos) => {
      state.userPass = datos;
    },
  },
  actions: {
    login: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .post(`/api/dataapp/login`, data)
          .then((res) => {
            commit("SET_LOGIN", true);
            localStorage.setItem("b1session", res.headers["b1session"]);
            localStorage.setItem("routeid", res.headers["routeid"]);
            commit("SET_USERNAME", data.UserName);
            commit("SET_USERPASS", data.Password);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response);
          });
      });
    },
    loginSap: async ({ commit }, data) => {
      try {
        const req = await axiosInstance.post(
          "https://192.168.1.30:50000/b1s/v1/Login",
          {
            CompanyDB: "SBODEMOGOVI2020",
            UserName: data.UserName,
            Password: data.Password,
          },
          { withCredentials: true }
        );
        const res = await req.data;

        console.log(res);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
  },
};
/**
 * Ajustes
 */
const AjustesModule = {
  namespaced: true,
  state: () => ({
    cedis: [],
  }),
  mutations: {
    setCedis: (state, datos) => {
      state.cedis = datos;
    },
  },
  actions: {
    getCedis: async ({ commit }) => {
      try {
        const req = await axiosInstance.get(`/api/dataapp/cedis`);
        const data = await req.data;
        commit("setCedis", data);
      } catch (error) {
        console.log(error);
      }
    },
    postAjuste: ({ commit }, info) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem("user");
          axiosInstance
            .post(`/api/dataapp/${info.Tipo}?u=${user}`, info)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
  },
};
/**
 * Tunel
 */
const TunelBancario = {
  namespaced: true,
  state: () => ({
    resultado: [],
    datosInforme: {
      diferencias: [],
      rows: [],
      statistics: [],
    },
  }),
  getters: {
    doneRows: (state) => state.datosInforme,
    lenDif: (state) => state.datosInforme.diferencias.length,
    lenRows: (state) => state.datosInforme.rows.length,
    lenStats: (state) => state.datosInforme.statistics.length,
  },
  mutations: {
    SET_RESULTADOS: (state, datos) => {
      state.resultado = datos;
    },
    SET_INFORME: (state, datos) => {
      state.datosInforme = datos;
    },
  },
  actions: {
    postUpload: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .post(`/api/dataapp/uploadtxt`, data, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
              commit("SET_RESULTADOS", res.data);
              resolve(res);
            })
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
        }
      });
    },
    postTunel: ({ commit }, info) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .post(`/api/dataapp/tunel`, info)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    postUploadServicio: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .post(`/api/dataapp/uploadtxtservicio`, data, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then((res) => {
              commit("SET_RESULTADOS", res.data);
              resolve(res);
            })
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
        }
      });
    },
    postTunelServicio: ({ commit }, info) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .post(`/api/dataapp/tunelservicio`, info)
            .then((res) => resolve(res))
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
    getInforme: ({ commit }, fecha) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .post(`/api/dataapp/informe`, fecha)
            .then((res) => {
              commit("SET_INFORME", res.data);
              resolve(res);
            })
            .catch((err) => reject(err));
        } catch (error) {
          console.log(error);
          reject(error);
        }
      });
    },
  },
};
/**
 * Notas
 */
const Notas = {
  namespaced: true,
  actions: {
    postNotaDebito: ({ commit }, info) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem("user");
          let pass = localStorage.getItem("pass");
          info.Login = {
            UserName: user,
            Password: pass,
          };
          axiosInstance
            .post(`/api/dataapp/notadebito`, info)
            .then((res) => resolve(res))
            .catch((err) => {
              let res = {
                data: [
                  {
                    docEntry: 0,
                    cliente: err.data,
                    cantidad: 0,
                    precio: 0,
                  },
                ],
              };
              resolve(res);
            });
        } catch (error) {
          console.log(error);
          let res = {
            data: [
              {
                docEntry: 0,
                cliente: error,
                cantidad: 0,
                precio: 0,
              },
            ],
          };
          resolve(res);
        }
      });
    },
  },
};
/**
 * Cancelacion
 */
const Cancelacion = {
  namespaced: true,
  actions: {
    /**
     *
     * @param {*} param0
     * @param {Array} data
     * @returns
     */
    postCancelacion: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        try {
          let user = localStorage.getItem("user");
          data.forEach((val) => (val["Usuario"] = user));
          axiosInstance
            .post(`/api/Cancelacion`, data)
            .then((res) => resolve(res))
            .catch((err) => {
              let res = {
                data: [
                  {
                    docEntry: 0,
                    cliente: err.data,
                    cantidad: 0,
                    precio: 0,
                  },
                ],
              };
              resolve(res);
            });
        } catch (error) {
          console.log(error);
          let res = {
            data: [
              {
                docEntry: 0,
                cliente: error,
                cantidad: 0,
                precio: 0,
              },
            ],
          };
          resolve(res);
        }
      });
    },
    /**
     *
     * @param {*} param0
     * @param {Array} data
     * @returns
     */
    putCancelacion: ({ commit }) => {
      return new Promise((resolve, reject) => {
        try {
          axiosInstance
            .put(`/api/Cancelacion`)
            .then((res) => resolve(res))
            .catch((err) => {
              reject(res);
            });
        } catch (error) {
          console.log(error);
        }
      });
    },
  },
};

/**
 * Credito
 */
const Credito = {
  namespaced: true,
  state: () => ({
    customers: [],
    pagos: [],
    pendingBills: [],
    typeDiscounts: [],
    mensaje: "",
    error: null,
    pago: null,
  }),
  mutations: {
    SET_CUSTOMERS: (state, datos) => {
      state.customers = datos;
    },
    SET_PAGOS: (state, datos) => {
      state.pagos = [];
      state.pagos = datos;
    },
    SET_PENDINGBILLS: (state, datos) => {
      state.pendingBills = [];
      state.pendingBills = datos;
    },
    SET_TYPESDISCOUNT: (state, datos) => {
      state.typeDiscounts = [];
      state.typeDiscounts = datos;
    },
    SET_MENSAJE(state, payload) {
      state.mensaje = payload;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    DELETEITEM(state, item) {
      const index = state.pendingBills.indexOf(item);
      state.pendingBills.splice(index, 1);
    },
    ADDITEM(state, item) {
      state.pendingBills.push(item);
    },
    SET_PAGO(state, pago) {
      state.pago = pago;
    },
    REMOVE_PAGO(state, folioPago) {
      state.pagos = state.pagos.filter((p) => p.folioPago !== folioPago);
    },
  },
  actions: {
    limpiarCredito: ({ commit }) => {
      commit("SET_CUSTOMERS", []);
      commit("SET_PAGOS", []);
      commit("SET_PENDINGBILLS", []);
    },
    deleteItemPending: ({ commit }, item) => {
      commit("DELETEITEM", item);
    },
    addItemPending: ({ commit }, item) => {
      commit("ADDITEM", item);
    },
    getCustomers: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/credit/customers?sociedad=${data.sociedad}&sucursal=${data.sucursal}`
          )
          .then((res) => {
            commit("SET_CUSTOMERS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getPagosCta: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/credit/pagocta?sociedad=${data.sociedad}&cuenta=${data.cuenta}`
          )
          .then((res) => {
            commit("SET_PAGOS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getPendingBill: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(
            `/api/credit/pendingbill?sociedad=${data.sociedad}&sucursal=${data.sucursal}&cliente=${data.cliente}`
          )
          .then((res) => {
            commit("SET_PENDINGBILLS", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    getTypeDiscounts: ({ commit }, data) => {
      return new Promise((resolve, reject) => {
        axiosInstance
          .get(`/api/credit/typediscount?sociedad=${data.sociedad}`)
          .then((res) => {
            commit("SET_TYPESDISCOUNT", res.data);
            resolve(true);
          })
          .catch((err) => {
            reject(err.response.data);
          });
      });
    },
    async insertarPago({ commit }, pago) {
      try {
        const response = await axiosInstance.post("/api/credit/pagos", pago);
        commit(
          "SET_MENSAJE",
          `Pago insertado con Folio: ${response.data.folio}`
        );
        commit("SET_ERROR", null);
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async getReportHeader({ commit }, fecha) {
      try {
        const response = await axiosInstance.get(
          `/api/credit/report/header?fecha=${fecha}`
        );
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async getReportDetail({ commit }, folio) {
      try {
        const response = await axiosInstance.get(
          `/api/credit/report/details?folio=${folio}`
        );
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async getAutorizacionPreaplicaciones({ commit }) {
      try {
        const response = await axiosInstance.get(
          `/api/credit/operation/header`
        );
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async updateAutorizacionPreaplicaciones({ commit }, folio) {
      try {
        const response = await axiosInstance.put(
          `/api/credit/operation/header?folio=${folio}`
        );
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async getPagoByFolio({ commit }, folioPago) {
      try {
        const response = await axiosInstance.get(
          `/api/credit/pagos/${folioPago}`
        );
        commit("SET_PAGO", response.data);
        return response.data;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
    async deletePagoByFolio({ commit }, folioPago) {
      try {
        await axiosInstance.delete(`/api/credit/pagos/${folioPago}`);
        commit("REMOVE_PAGO", folioPago);
        return true;
      } catch (error) {
        commit("SET_ERROR", error.response?.data || error.message);
        throw error;
      }
    },
  },
};

export default new Vuex.Store({
  modules: {
    dispersion: Dispersion,
    informes: Informes,
    login: LoginModule,
    ajustes: AjustesModule,
    tunel: TunelBancario,
    config: Config,
    notas: Notas,
    cancelacion: Cancelacion,
    credito: Credito,
  },
  plugins: [
    createPersistedState({
      key: "AIzaSyC4d3pkEslVbx3xLc1037FdfgoYPW6b-yI",
      paths: ["login.userName"],
      storage: window.sessionStorage,
    }),
  ],
});
