<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>UUID's Estatus de Cancelación</v-toolbar-title>
      <v-spacer> </v-spacer>
      <export-excel
        class="v-btn v-btn--depressed theme--dark v-size--default primary"
        :data="sd_aldia"
        worksheet="Datos"
        :name="`reportedia${date}.xls`"
        v-if="sd_aldia.length"
      >
        <v-icon>
          cloud_download
        </v-icon>
      </export-excel>
    </v-toolbar>
    <v-row dense>
      <v-col justify="center" cols="12">
        <v-data-table
          dense
          v-model="selected"
          :headers="headers"
          :items="sd_aldia"
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
          <template v-slot:[`item.total_UUID`]="{ item }">
            <span> {{ item.total_UUID | currency }} </span>
          </template>
          <template v-slot:[`item.estatus`]="{ item }">
            <v-chip color="green" dark> {{ item.estatus }} </v-chip>
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
      modal: false,
      date: new Date().toISOString().substr(0, 10),
      selected: [],
      overlay: false,
      headers: [
        { text: "Emisor", value: "rfC_Emisor" },
        { text: "Receptor", value: "rfC_Receptor" },
        { text: "UUID", value: "uuid" },
        { text: "Total", value: "total_UUID", align: "right" },
        { text: "Estado", value: "estatus" },
        { text: "Motivo", value: "motivo" },
      ],
    };
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    ...mapActions("informes", { getInfo: "getUUIDStatus" }),
    cargarDatos() {
      this.overlay = true;
      this.getInfo()
        .then(() => (this.overlay = false))
        .catch(() => (this.overlay = false))
        .finally(() => (this.overlay = false));
    },
  },
  computed: {
    sd_aldia() {
      return this.$store.state.informes.uuidlist;
    },
  },
};
</script>

<style></style>
