<template>
  <v-container>
    <v-toolbar dense id="p">
      <v-toolbar-title>Informe de Operaciones</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary">Actualizar</v-btn>
    </v-toolbar>
    <div>
      <v-row>
        <v-text-field
          v-model="fecha"
          label="Fecha"
          prepend-icon="event"
          type="date"
          class="col-3"
          @input="getReportHeaderMethod"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          label="Buscar Operaciones"
          class="mx-4"
          prepend-inner-icon="search"
          v-model="search"
        ></v-text-field>
      </v-row>
      <v-skeleton-loader
        boilerplate
        type="table"
        v-if="loading"
      ></v-skeleton-loader>
      <!-- <v-expansion-panels v-else accordion>
        <v-expansion-panel v-for="(item, i) in items" :key="i">
          <v-expansion-panel-header>
            <v-row dense no-gutters>
              <v-col cols="2">
                {{ item.folioPago }}
              </v-col>
              <v-col cols="3">
                {{ item.cliente }}
              </v-col>
              <v-col cols="5">
                {{ item.sucursal }}
              </v-col>
              <v-col cols="2">
                <span> {{ item.totalAPagar | currency }} </span>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-data-table
              dense
              :headers="headers"
              :items="items"
              hide-default-footer
              disable-pagination
              disable-sort
              class="elevation-1"
              item-key="id"
              loading="true"
            >
              <template v-slot:[`item.importe`]="{ item }">
                <span> {{ item.importe | currency }} </span>
              </template>
            </v-data-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels> -->
      <v-data-table
        v-else
        :headers="headers"
        :items="items"
        class="elevation-1"
        item-key="folioPago"
        :loading="loadingDetail"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        @item-expanded="onItemExpanded"
      >
        <template v-slot:[`item.totalAPagar`]="{ item }">
          <v-chip color="green" dark>
            <span> {{ item.totalAPagar | currency }} </span>
          </v-chip>
        </template>
        <template v-slot:[`item.cliente`]="{ item }">
            <span> {{ item.cardCode }} - {{ item.cliente }}  </span>
        </template>
        <template v-slot:[`item.fecha`]="{ item }">
              <span> {{ item.fecha | textcrop2(10) }} </span>
            </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              dense
              :headers="headersDetails"
              :items="itemsDetails"
              hide-default-footer
              disable-pagination
              disable-sort
              class="elevation-1"
              item-key="id"
              :loading="loadingDetail"
            >
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
  name: "CreditReport",
  data: () => ({
    loading: false,
    singleExpand: false,
    loadingDetail: false,
    expanded: [],
    fecha: moment().format("YYYY-MM-DD"),
    items: [],
    itemsDetails: [],
    headers: [
      { text: "Cliente", value: "cliente" },
      { text: "Folio", value: "folioPago" },
      { text: "Sucursal", value: "sucursal" },
      { text: "Estado", value: "estatus" },
      { text: "Folio SAP", value: "folioSAP" },
      { text: "Fecha", value: "fecha" },
      { text: "Total a Pagar", value: "totalAPagar", align: "right" },
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
    ...mapActions("credito", ["getReportHeader", "getReportDetail"]),
    async getReportHeaderMethod() {
      this.loading = false;
      this.items = await this.getReportHeader(this.fecha);
      this.loading = this.items.length == 0;
    },
    async onItemExpanded({ item, value }) {
      if (value) {
        this.loadingDetail = true;
        this.itemsDetails = await this.getReportDetail(item.folioPago);
        this.loadingDetail = false;
        return;
      }
      this.itemsDetails = [];
    },
  },
  mounted() {
    this.getReportHeaderMethod();
  },
};
</script>
