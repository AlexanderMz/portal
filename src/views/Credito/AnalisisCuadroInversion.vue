<template>
  <v-container>
    <v-toolbar dense id="p">
      <v-toolbar-title>Analisis Cuadro de Inversion</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary">Actualizar</v-btn>
    </v-toolbar>
    <div>
      <v-row>
        <v-text-field v-model="fecha" label="Fecha" prepend-icon="event" type="date" class="col-3"
          @input="getReportHeaderMethodCuadroInversion"></v-text-field>
        <v-text-field v-model="tipoCambio" label="Tipo de Cambio" prepend-icon="money" type="number"
          class="col-3"></v-text-field>
      </v-row>
      <v-row>
        <v-text-field label="Buscar Cuentas" class="mx-4" prepend-inner-icon="search" v-model="search"></v-text-field>
      </v-row>
      <v-skeleton-loader boilerplate type="table" v-if="loading"></v-skeleton-loader>
      <v-data-table v-else :headers="headers" :items="items" class="elevation-1" item-key="cuentas"
        :loading="loadingDetail" :search="search" :single-expand="singleExpand" :expanded.sync="expanded" show-expand
        @item-expanded="onItemExpanded">
        <template v-slot:[`item.rendiminetoDiario`]="{ item }">
          <v-chip color="green" dark>
            <span> {{ item.rendiminetoDiario | currency }} </span>
          </v-chip>
        </template>
        <template v-slot:[`item.saldoDiario`]="{ item }">
          <span> {{ item.saldoDiario | currency }} </span>
        </template>
        <template v-slot:[`item.compra`]="{ item }">
          <span> {{ item.compra | currency }} </span>
        </template>
        <template v-slot:[`item.venta`]="{ item }">
          <span> {{ item.venta | currency }} </span>
        </template>
        <template v-slot:[`item.actualChequera`]="{ item }">
          <span> {{ item.actualChequera | currency }} </span>
        </template>
        <template v-slot:[`item.saldoInversion`]="{ item }">
          <span> {{ item.saldoInversion | currency }} </span>
        </template>
        <template v-slot:[`item.totalBanorte`]="{ item }">
          <span> {{ item.totalBanorte | currency }} </span>
        </template>
        <template v-slot:[`item.depositos`]="{ item }">
          <span> {{ item.depositos | currency }} </span>
        </template>
        <template v-slot:[`item.depositosVenta`]="{ item }">
          <span> {{ item.depositosVenta | currency }} </span>
        </template>
        <template v-slot:[`item.transferencias`]="{ item }">
          <span> {{ item.transferencias | currency }} </span>
        </template>
        <template v-slot:[`item.depositosMes`]="{ item }">
          <span> {{ item.depositosMes | currency }} </span>
        </template>
        <template v-slot:[`item.chequeMes`]="{ item }">
          <span> {{ item.chequeMes | currency }} </span>
        </template>
        <template v-slot:[`item.dolaresTCDia`]="{ item }">
          <span> {{ item.dolaresTCDia | currency }} </span>
        </template>
        <template v-slot:[`item.dolaresTCDiario`]="{ item }">
          <span> {{ item.dolaresTCDiario | currency }} </span>
        </template>
        <template v-slot:[`item.granTotal`]="{ item }">
          <span> {{ item.granTotal | currency }} </span>
        </template>
        <template v-slot:[`item.banorte`]="{ item }">
          <span> {{ item.banorte | currency }} </span>
        </template>
        <template v-slot:[`item.banamex`]="{ item }">
          <span> {{ item.banamex | currency }} </span>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table dense :headers="headersDetails" :items="itemsDetails" hide-default-footer disable-pagination
              disable-sort class="elevation-1" item-key="id" :loading="loadingDetail">
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
    </div>
  </v-container>
</template>
<script>
import moment from "moment";
import { mapActions } from "vuex";

export default {
  name: "AnalisisCuadroInversion",
  data: () => ({
    loading: false,
    singleExpand: false,
    loadingDetail: false,
    expanded: [],
    fecha: moment().format("YYYY-MM-DD"),
    tipoCambio: 0,
    items: [],
    itemsDetails: [],
    headers: [
      { text: "Almacen", value: "almacen" },
      { text: "Cuentas", value: "cuentas" },
      { text: "Rendimineto Diario", value: "rendiminetoDiario", align: "right" },
      { text: "Saldo Diario", value: "saldoDiario", align: "right" },
      { text: "Compra", value: "compra", align: "right" },
      { text: "Venta", value: "venta", align: "right" },
      { text: "Actual Chequera", value: "actualChequera", align: "right" },
      { text: "Saldo Inversion", value: "saldoInversion", align: "right" },
      { text: "Total Banorte", value: "totalBanorte", align: "right" },
      { text: "Depositos", value: "depositos", align: "right" },
      { text: "Depositos Venta", value: "depositosVenta", align: "right" },
      { text: "Transferencias", value: "transferencias", align: "right" },
      { text: "Depositos Mes", value: "depositosMes", align: "right" },
      { text: "Cheque Mes", value: "chequeMes", align: "right" },
      { text: "Dolares TC Dia", value: "dolaresTCDia", align: "right" },
      { text: "Dolares TC Diario", value: "dolaresTCDiario", align: "right" },
      { text: "GranTotal", value: "granTotal", align: "right" },
      { text: "Banorte", value: "banorte", align: "right" },
      { text: "Banamex", value: "banamex", align: "right" },
      { text: "Santander", value: "santander", align: "right" },
      { text: "", value: "data-table-expand" },
    ],
    headersDetails: [
      { text: "Factura", value: "factura" },
      { text: "Saldo Vencido", value: "saldoVencido", align: "right" },
      { text: "Desc 1", value: "descuento1", align: "right" },
      { text: "Desc 2", value: "descuento2", align: "right" },
      { text: "Desc 3", value: "descuento3", align: "right" },
      { text: "Desc 4", value: "descuento4", align: "right" },
      { text: "Total Pago", value: "totalPago", align: "right" },
    ],
    search: "",
  }),
  methods: {
    ...mapActions("credito", ["getReportHeaderCuadroInversion", "getReportDetailCuadroInversion"]),
    async getReportHeaderMethodCuadroInversion () {
      this.loading = false;
      this.items = await this.getReportHeaderCuadroInversion(this.fecha);
      this.loading = this.items.length == 0;
    },
    async onItemExpanded ({ item, value }) {
      if (value) {
        this.loadingDetail = true;
        this.itemsDetails = await this.getReportDetailCuadroInversion(item.cuentas);
        this.loadingDetail = false;
        return;
      }
      this.itemsDetails = [];
    },
  },
  mounted () {
    this.getReportHeaderMethodCuadroInversion();
  },
};
</script>
