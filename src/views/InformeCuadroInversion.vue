<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Cuadro de Inversion</v-toolbar-title>
      <v-spacer> </v-spacer>
      <export-excel
        class="v-btn v-btn--depressed theme--dark v-size--default primary"
        :data="data"
        worksheet="Datos"
        :name="`reportedia${date}.xls`"
        v-if="data.length"
      >
        <v-icon>
          cloud_download
        </v-icon>
      </export-excel>
    </v-toolbar>
    <v-row dense>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu1"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[0]"
              label="Fecha Inicial Cuadro de Inversion"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[0]" @input="menu1 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu2"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[1]"
              label="Fecha Final Cuadro de Inversion"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[1]" @input="menu2 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu3"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[2]"
              label="Fecha Saldo Diario"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[2]" @input="menu3 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu4"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[3]"
              label="Fecha Inicial Documento"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[3]" @input="menu4 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu5"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[4]"
              label="Fecha Final Documento"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[4]" @input="menu5 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu6"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[5]"
              label="Fecha Inicial Contabilizaron"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[5]" @input="menu6 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="2" sm="2" md="2">
        <v-menu
          v-model="menu7"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="date[6]"
              label="Fecha Inicial Contabilizaron"
              prepend-icon="event"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date[6]" @input="menu7 = false" scrollable>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col>
        <v-btn depressed color="primary" @click="cargarDatos">
          Consultar
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col justify="center" cols="12">
        <v-data-table
          dense
          v-model="selected"
          :headers="headers"
          :items="data"
          :search="search"
          :items-per-page="15"
          item-key="cuenta"
          class="elevation-1"
          ref="table"
        >
          <template v-slot:top>
            <v-text-field
              v-model="search"
              label="Filtrar resultados"
              class="mx-4"
            ></v-text-field>
          </template>
          <template v-slot:[`item.saldoDiario`]="{ item }">
            <span> {{ item.saldoDiario | currency }} </span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-overlay style="text-align: center" :value="overlay">
      <p>Calculando saldo diario</p>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data() {
    return {
      search: "",
      menu1: false,
      menu2: false,
      menu3: false,
      menu4: false,
      menu5: false,
      menu6: false,
      menu7: false,
      date: [
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
        new Date().toISOString().substr(0, 10),
      ],
      selected: [],
      data: [],
      overlay: false,
      headers: [
        { text: "Empresa", value: "empresa" },
        { text: "Cuenta", value: "cuenta" },
        { text: "NombreCuenta", value: "nombreCuenta" },
        { text: "SaldoDiario", value: "saldoDiario" },
        { text: "Transfers", value: "transfers" },
        { text: "Importe Sin Domiciliados", value: "importe Sin Domiciliados" },
        { text: "Importe Domiciliado", value: "importe Domiciliado" },
        {
          text: "Domiciliados EDC (CFE,DOMICILIACION)",
          value: "domiciliados EDC (CFE,DOMICILIACION)",
        },
        {
          text: "Comisiones EDC (IVA,COMISION)",
          value: "comisiones EDC (IVA,COMISION)",
        },
        { text: "Total", value: "total" },
        { text: "Depositos", value: "depositos" },
        { text: "Depositos Cuenta Propia", value: "depositos Cuenta Propia" },
        { text: "Cheques Devolucion", value: "cheques Devolucion" },
        { text: "Tesoreria", value: "tesoreria" },
        { text: "Tipo de Cambio", value: "tipo de Cambio" },
        { text: "Fecha", value: "fecha" },
      ],
    };
  },
  methods: {
    ...mapActions("informes", { getInfo: "getCuadroInversion" }),
    cargarDatos() {
      const fechas = this.date.map((d) => d.replaceAll("-", "")).join(",");

      this.overlay = true;
      this.getInfo(fechas)
        .then((data) => {
          this.overlay = false;
          this.data = data;
        })
        .catch(() => (this.overlay = false))
        .finally(() => (this.overlay = false));
    },
  },
};
</script>

<style></style>
