<template>
  <v-container>
    <v-toolbar
      dense
      id="p"
    >
      <v-toolbar-title>Validación de Folios para Pago</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-btn
        depressed
        color="primary"
        @click="enviarTunel"
        :disabled="!selectedToFile.length"
      >
        Enviar a túnel bancario
      </v-btn>
    </v-toolbar>
    <div>
      <v-row>
        <v-col
          class="d-flex"
          cols="6"
        >
          <v-file-input
            label="Buscar archivo"
            accept="text/txt"
            outlined
            multiple
            dense
            @change="onFileChange"
            v-model="selectedFile"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-expansion-panels accordion>
          <v-expansion-panel
            v-for="(item,i) in response"
            :key="i"
          >
            <v-expansion-panel-header>{{item.name}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-data-table
                :headers="responseColumns"
                :items="item.filas"
                hide-actions
                class="elevation-1"
                item-key="referencia"
                loading="true"
              >
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-row>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'AjusteEntrada',
  data: () => ({
    rows: [],
    columns: [],
    selectedSucursal: null,
    selectedFile: undefined,
    selectedFile2: undefined,
    motivo: '',
    overlay: false,
    response: [],
    showAlert: false,
    responseColumns: [
      { text: 'Referencia', value: 'referencia' },
      { text: 'Instrucción', value: 'instruccionPago' },
      { text: 'Cuenta Origen', value: 'cuentaOrigen' },
      { text: 'Cuenta Destino', value: 'cuentaDestino' },
      { text: 'Importe', value: 'importe', align: 'right' },
      { text: 'Fecha Aplicación', value: 'fechaAplicacion' },
    ],
  }),
  methods: {
    EnviarSap () {
      this.overlay = true
      const info = {
        Ajustes: this.rows,
        Sucursal: this.selectedSucursal,
        Motivo: this.motivo,
        Tipo: 'entrada'
      }
      this.$store.dispatch("postAjuste", info)
        .then(res => {
          if (res) {
            this.overlay = false
            this.rows = []
            this.selectedFile = undefined
            this.response = res.data
            this.showAlert = true
          }
        })
        .catch(err => {
          this.overlay = false
          this.response = err.data
          alert(this.response)
          console.error(err)
        })
        .finally(() => {
          this.overlay = false
        })
    },
    onFileChange (event) {

    }
  }
}
</script>

<style>
</style>