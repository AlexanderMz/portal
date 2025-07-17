<template>
  <v-container>
    <v-toolbar dense id="p">
      <v-toolbar-title>Ejecutar Preaplicaciones</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-row justify="end">
        <v-col>
          <v-btn class="col" depressed color="primary" :disabled="!selected.length"
            @click="updateAutorizacionPreaplicacionesMethod">
            Aplicar Operaciones
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <div>
      <v-row dense class="align-center">
        <v-col class="d-flex" cols="6">
          <v-text-field label="Buscar Operaciones" class="mx-4" prepend-inner-icon="search"
            v-model="search"></v-text-field>
        </v-col>
        <v-col class="d-flex" cols="3">
          Registros cargados:
          {{ items.length }}
        </v-col>
        <v-col class="d-flex" cols="3">
          Registros seleccionados:
          {{ selected.length }}
        </v-col>
      </v-row>
      <v-skeleton-loader boilerplate type="table" v-if="loading"></v-skeleton-loader>
      <v-row dense v-else>
        <v-col class="d-flex">
          <v-data-table class="elevation-1" item-key="folioPago" v-model="selected" :headers="headers" :items="items"
            :loading="loadingDetail" :search="search" :single-expand="singleExpand" :expanded.sync="expanded"
            show-expand show-select @item-expanded="onItemExpanded">
            <template v-slot:[`item.totalAPagar`]="{ item }">
              <v-chip color="green" dark>
                <span> {{ item.totalAPagar | currency }} </span>
              </v-chip>
            </template>
            <template v-slot:[`item.cliente`]="{ item }">
              <span> {{ item.cardCode }} - {{ item.cliente }} </span>
            </template>
            <template v-slot:[`item.fecha`]="{ item }">
              <span> {{ item.fecha | textcrop2(10) }} </span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn disabled color="primary" icon="" small v-on="on" v-bind="attrs"
                    @click="irAPago(item.folioPago)">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
            <template v-slot:expanded-item="{ headers, item }">
              <td :colspan="headers.length">
                <v-data-table dense :headers="headersDetails" :items="itemsDetails" hide-default-footer
                  disable-pagination disable-sort class="elevation-1" item-key="id" :loading="loadingDetail">
                  <template v-slot:[`item.saldoVencido`]="{ item }">
                    <span> {{ item.saldoVencido | currency }} </span>
                  </template>
                  <template v-slot:[`item.descuento1`]="{ item }">
                    <span> {{ item.descuento1 | currency }} </span>
                  </template>
                  <template v-slot:[`item.descuento2`]="{ item }">
                    <span> {{ item.descuento2 | currency }} </span>
                  </template>
                  <template v-slot:[`item.descuento3`]="{ item }">
                    <span> {{ item.descuento3 | currency }} </span>
                  </template>
                  <template v-slot:[`item.descuento4`]="{ item }">
                    <span> {{ item.descuento4 | currency }} </span>
                  </template>
                  <template v-slot:[`item.totalPago`]="{ item }">
                    <v-chip color="green" dark>
                      <span> {{ item.totalPago | currency }} </span>
                    </v-chip>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "AutorizacionPreaplicaciones",
  data: () => ({
    loading: false,
    singleExpand: false,
    loadingDetail: false,
    expanded: [],
    selected: [],
    items: [],
    itemsDetails: [],
    search: "",
    headersDetails: [
      { text: "Factura", value: "factura" },
      { text: "Saldo Vencido", value: "saldoVencido", align: "right" },
      { text: "Desc 1", value: "descuento1", align: "right" },
      { text: "Desc 2", value: "descuento2", align: "right" },
      { text: "Desc 3", value: "descuento3", align: "right" },
      { text: "Desc 4", value: "descuento4", align: "right" },
      { text: "Total Pago", value: "totalPago", align: "right" },
    ],
    headers: [
      { text: "Cliente", value: "cliente" },
      { text: "Folio", value: "folioPago" },
      { text: "Sucursal", value: "sucursal" },
      { text: "Estado", value: "estatus" },
      { text: "Folio SAP", value: "folioSAP" },
      { text: "Fecha", value: "fecha" },
      { text: "Total a Pagar", value: "totalAPagar", align: "right" },
      { text: "", value: "actions" },
      { text: "", value: "data-table-expand" },
    ],
  }),
  mounted () {
    this.getAutorizacionPreaplicacionesMethod()
  },
  methods: {
    ...mapActions("credito", ["getAutorizacionPreaplicaciones", "updateAutorizacionPreaplicaciones", "getReportDetail", "getPagoByFolio"]),
    async getAutorizacionPreaplicacionesMethod () {
      this.loading = false;
      this.items = await this.getAutorizacionPreaplicaciones();
      this.loading = this.items.length == 0;
    },
    async updateAutorizacionPreaplicacionesMethod () {
      this.loading = false;
      this.selected.forEach(async (item) => {
        await this.updateAutorizacionPreaplicaciones(item.folioPago);
      });
      this.loading = this.items.length == 0;
      this.getAutorizacionPreaplicacionesMethod()
    },
    async onItemExpanded ({ item, value }) {
      if (value) {
        this.loadingDetail = true;
        this.itemsDetails = await this.getReportDetail(item.folioPago);
        this.loadingDetail = false;
        return;
      }
      this.itemsDetails = [];
    },
    irAPago (folioPago) {
      this.$store.commit("credito/SET_PAGO", null); // Limpiar pago anterior
      this.$store.commit("credito/SET_ERROR", null);
      this.$store.commit("credito/SET_PAGO", { folioPago }); // Setear folioPago temporalmente
      this.$router.push({ name: "Pagos" });
    },
  },
};
</script>

<style></style>
