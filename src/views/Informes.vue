<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Informe de {{ title }}</v-toolbar-title>
      <v-spacer> </v-spacer>
      <export-excel
        class="v-btn v-btn--depressed theme--dark v-size--default primary"
        :data="rows"
        worksheet="Datos"
        :name="`reportedia${date}.xls`"
        v-if="rows.length"
      >
        <v-icon>
          save_alt
        </v-icon>
      </export-excel>
    </v-toolbar>
    <v-row dense>
      <div v-for="parametro in parameters" :key="parametro.text">
        <div v-if="parametro.type == 'fecha'">
          <v-col cols="12">
            <v-text-field
              v-model="parametro.model"
              :label="parametro.text"
              prepend-icon="event"
              type="date"
            ></v-text-field>
          </v-col>
        </div>
        <div v-if="parametro.type == 'texto'">
          <v-col cols="12">
            <v-text-field
              dense
              :label="parametro.text"
              v-model="parametro.model"
            >
            </v-text-field>
          </v-col>
        </div>
      </div>
    </v-row>
    <v-row dense>
      <v-col cols="auto">
        <v-btn
          depressed
          color="primary"
          style="margin-right: 10px"
          @click="generarConsulta"
        >
          Generar Consulta
        </v-btn>
      </v-col>
    </v-row>
    <v-row dense>
      <v-col justify="center" cols="12">
        <v-data-table
          dense
          :headers="cols"
          :items="rows"
          :search="search"
          :items-per-page="15"
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
        </v-data-table>
      </v-col>
    </v-row>
    <v-overlay style="text-align: center" :value="loading">
      <p>Obteniendo datos</p>
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
      id: "",
    };
  },
  methods: {
    ...mapActions("informes", ["getInforme", "getParametros"]),
    generarConsulta() {
      let data = {
        id: this.id,
      };
      this.getInforme(data);
    },
  },
  computed: {
    rows() {
      return this.$store.state.informes.rows;
    },
    cols() {
      return this.$store.state.informes.cols;
    },
    loading() {
      return this.$store.state.informes.loadingInfo;
    },
    title() {
      return this.$store.state.informes.title;
    },
    parameters() {
      return this.$store.state.informes.parameters;
    },
  },
  mounted() {
    this.id = this.$route.fullPath.split("/").pop();
    this.getParametros(this.id);
  },
  watch: {
    $route(to, from) {
      this.id = this.$route.fullPath.split("/").pop();
      this.getParametros(this.id);
    },
  },
};
</script>

<style></style>
