<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Informe tunel bancario</v-toolbar-title>
    </v-toolbar>
    <v-row>
      <!-- <v-col
        cols="6"
        sm="6"
        md="4"
      >
        <v-dialog
          ref="dialog"
          v-model="modal"
          :return-value.sync="dateIni"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateIni"
              label="Fecha Inicial"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateIni"
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="setDateIni"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col> -->
      <v-col
        cols="6"
        sm="6"
        md="4"
      >
        <v-dialog
          ref="dialog1"
          v-model="modal1"
          :return-value.sync="dateFin"
          persistent
          width="290px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dateFin"
              label="Fecha final"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dateFin"
            scrollable
          >
            <v-spacer></v-spacer>
            <v-btn
              text
              color="primary"
              @click="modal = false"
            >
              Cancel
            </v-btn>
            <v-btn
              text
              color="primary"
              @click="cargarDatos"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row justify="space-around">
      <v-col
        v-for="rounded in [50, 60, 80, 79]"
        :key="rounded"
        cols="12"
        md="4"
      >
        <v-sheet
          class="pa-12"
          color="grey lighten-3"
        >
          <div></div>
          <v-sheet
            rounded
            class="mx-auto"
            height="100"
            width="100"
          ></v-sheet>
          <div></div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
        <v-expansion-panels
          accordion
          focusable
        >
          <v-expansion-panel
            v-for="(item,i) in getRegistros"
            :key="i"
          >
            <v-expansion-panel-header>
              <v-row no-gutters>
                <v-col cols="2">
                  {{item.folio}}
                </v-col>
                <v-col cols="3">
                  {{item.fecha}}
                </v-col>
                <v-col cols="5">
                  {{item.confirmacion}}
                </v-col>
                <v-col cols="2">
                  {{item.sucursal}}
                </v-col>
              </v-row>
            </v-expansion-panel-header>
            <v-expansion-panel-content>

              <v-data-table
                dense
                :headers="responseColumns"
                :items="item.detalle"
                hide-default-footer
                class="elevation-1"
                item-key="id"
                loading="true"
              >
              </v-data-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
    <v-overlay
      style="text-align: center"
      :value="overlay"
    >
      <p>Generando informe</p>
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>

export default {
  data () {
    return {
      search: '',
      modal: false,
      modal1: false,
      dateIni: new Date().toISOString().substr(0, 10),
      dateFin: new Date().toISOString().substr(0, 10),
      selected: [],
      overlay: false,
      responseColumns: [
        { text: 'Operacion', value: 'operacion' },
        { text: 'Descripcion', value: 'descripcion' },
        { text: 'Cuenta Origen', value: 'cuentaOrigen' },
        { text: 'Cuenta Destino', value: 'cuentaDestino' },
        { text: 'Referencia', value: 'referencia' },
        { text: 'Importe', value: 'importe', align: 'end' },
        { text: 'Fecha Ejecucion', value: 'fechaEjecucion', align: 'end' },
        { text: 'Titular', value: 'titulardelaCuenta' },
        { text: 'Confirmacion', value: 'confirmacion' },
      ],
    }
  },
  methods: {
    setDateIni () {
      this.$refs.dialog.save(this.dateIni)
    },
    cargarDatos () {
      this.$refs.dialog1.save(this.dateFin)
      this.overlay = true
      this.$store.dispatch("getInforme", { FechaFin: this.dateFin })
        .then(() => this.overlay = false)
        .catch(() => this.overlay = false)
        .finally(() => this.overlay = false)
    },
  },
  computed: {
    getRegistros () {
      return this.$store.state.tunel.datosInforme.detalle
    },
    getData () {
      return this.$store.state.tunel.datosInforme.generados
    }
  }
}
</script>

<style>
</style>