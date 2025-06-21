<template>
  <v-container>
    <v-toolbar dense id="p">
      <v-toolbar-title
        >Aplicación de pagos | Facturas con descuentos</v-toolbar-title
      >
      <v-spacer> </v-spacer>
      <v-row justify="end">
        <v-col>
          <v-btn
            depressed
            color="primary"
            @click="generaUnoxUno"
            :disabled="!selectedToFile.length"
          >
            Preaplicación
          </v-btn>
        </v-col>
        <v-col>
          <v-btn
            class="col"
            depressed
            color="primary"
            @click="generaUnoxUno"
            :disabled="!selectedToFile.length"
          >
            Generar Operación
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <div>
      <v-row no-gutters>
        <v-col class="d-flex" cols="2" md="2">
          <v-checkbox
            dense
            label="Manual"
            v-model="value"
            value="value"
          ></v-checkbox>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="fecha"
            label="Fecha"
            prepend-icon="event"
            type="date"
            disabled
          ></v-text-field>
        </v-col>
      </v-row>
      <!-- Sociedad & Sucursal -->
      <v-row>
        <v-col class="d-flex" cols="3" md="3">
          <v-select
            label="Sociedad o Empresa"
            dense
            solo
            :items="sociedades"
            v-model="selectedSociedad"
            :item-text="getSociedadText"
            item-value="u_CompnyName"
            return-object
            @input="cargarDatos"
            :disabled="selectedToFile.length > 0"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-select
            label="Surcural"
            dense
            solo
            :items="sucursales"
            v-model="selectedSucursal"
            :item-text="getSucursalText"
            return-object
            item-value="bplName"
            @input="cargarDatos2"
            :disabled="selectedToFile.length > 0"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-select
            label="Cuenta Bancaria"
            dense
            solo
            :items="cuentas"
            :item-text="getCuentaText"
            item-value="glAccount"
            @input="cargarDatos3"
            :disabled="selectedToFile.length > 0"
          ></v-select>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-select
            label="Cliente"
            dense
            solo
            :items="customers"
            :item-text="getCustomerText"
            item-value="cardCode"
            @input="cargarDatos4"
            :disabled="selectedToFile.length > 0"
          ></v-select>
        </v-col>
      </v-row>
      <!-- Descuentos -->
      <v-row align="start">
        <v-col cols="4">
          <v-select
            label="Pago edo. Cta"
            dense
            solo
            :items="pagosCta"
            :item-text="getPagoCtaText"
            item-value="glAccount"
          ></v-select>
        </v-col>
        <v-col cols="3">
          <v-select
            dense
            solo
            :items="typeDiscounts"
            v-model="tipoDescuento1"
            item-text="itemName"
            label="Tipo de descuento 1"
            append
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-text-field v-model="descuento1" @change="recalculateAll()">
            <template v-slot:append>
              <v-icon>
                percent
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            dense
            solo
            :items="typeDiscounts"
            v-model="tipoDescuento2"
            item-text="itemName"
            label="Tipo de descuento 2"
            append
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-text-field v-model="descuento2" @change="recalculateAll()">
            <template v-slot:append>
              <v-icon>
                percent
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col class="d-flex" cols="4" md="4">
          <v-file-input
            label="Adjuntar template"
            outlined
            dense
            @change="onFileChange"
            v-model="selectedFile"
          ></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-select
            dense
            solo
            :items="typeDiscounts"
            v-model="tipoDescuento3"
            item-text="itemName"
            label="Tipo de descuento 3"
            append
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-text-field v-model="descuento3" @change="recalculateAll()"
            ><template v-slot:append>
              <v-icon>
                percent
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            dense
            solo
            :items="typeDiscounts"
            v-model="tipoDescuento4"
            item-text="itemName"
            label="Tipo de descuento 4"
            append
          ></v-select>
        </v-col>
        <v-col cols="1">
          <v-text-field v-model="descuento4" @change="recalculateAll()">
            <template v-slot:append>
              <v-icon>
                percent
              </v-icon>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
      <!-- Tablas -->
      <v-row>
        <v-col cols="4" md="4">
          <v-data-table
            dense
            v-if="!loadTable"
            v-model="selected"
            :headers="headers"
            :items="pendingBills"
            :search="search"
            :items-per-page="15"
            disable-sort
            fixed-header
            item-key="name"
            class="elevation-1"
            ref="table"
            :height="tableHeight"
            id="tablemain"
          >
            <template v-slot:top>
              <v-banner sticky icon="search" flat>
                <v-text-field
                  v-model="search"
                  label="Buscar transferencia"
                  class="mx-4"
                  @keydown.stop.enter="handlerEvent"
                ></v-text-field>
              </v-banner>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="addItem(item)">
                forward
              </v-icon>
            </template>
            <template v-slot:[`item.saldoVencido`]="{ item }">
              <span> {{ item.saldoVencido | currency }} </span>
            </template>
            <template v-slot:[`item.docDate`]="{ item }">
              <span> {{ item.docDate | textcrop2(10) }} </span>
            </template>
          </v-data-table>
          <v-skeleton-loader
            v-if="loadTable"
            class="mx-auto"
            type="table"
          ></v-skeleton-loader>
        </v-col>
        <v-col cols="8" md="8">
          <v-data-table
            dense
            :headers="headers2"
            :items="selectedToFile"
            class="elevation-1"
            hide-default-footer
            disable-pagination
            disable-sort
            :fixed-header="true"
            :height="tableHeight"
            id="tabledetalle"
          >
            <template v-slot:top>
              <v-row no-gutters>
                <v-col cols="8" sm="6" md="8">
                  <v-btn
                    rounded
                    icon
                    title="Eliminar todos"
                    @click="selectedToFile = []"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                  {{ selectedToFile.length }} seleccionadas | Total:
                  {{ getTotal | currency }}
                </v-col>
                <v-col>
                  <v-checkbox
                    class="pa-0 ma-1"
                    dense
                    label="Timbrar Pago"
                    v-model="value"
                    value="value"
                  ></v-checkbox>
                </v-col>
              </v-row>
              <v-dialog v-model="dialogDelete" max-width="600px">
                <v-card>
                  <v-card-title class="headline"
                    >¿Esta seguro que desea borrar esta factura?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancelar</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="deleteItem(item)">
                delete
              </v-icon>
            </template>
            <template v-slot:[`item.saldoVencido`]="{ item }">
              <span> {{ item.saldoVencido | currency }} </span>
            </template>
            <template v-slot:[`item.total1`]="{ item }">
              <span> {{ item.total1 | currency }} </span>
            </template>
            <template v-slot:[`item.total2`]="{ item }">
              <span> {{ item.total2 | currency }} </span>
            </template>
            <template v-slot:[`item.total3`]="{ item }">
              <span> {{ item.total3 | currency }} </span>
            </template>
            <template v-slot:[`item.total4`]="{ item }">
              <span> {{ item.total4 | currency }} </span>
            </template>
            <template v-slot:[`item.total`]="{ item }">
              <v-chip color="green" dark>
                <span> {{ item.total | currency }} </span>
              </v-chip>
            </template>
            <template v-slot:[`item.rebajesoDevoluciones`]="{ item }">
              <v-edit-dialog
                :return-value.sync="item.rebajesoDevoluciones"
                @save="recalculate(item)"
              >
                {{ item.rebajesoDevoluciones | currency }}
                <template v-slot:input>
                  <v-text-field
                    v-model="item.rebajesoDevoluciones"
                    :label="item.docNum"
                    single-line
                    counter
                    type="number"
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <!-- Dialog -->
    <v-dialog v-model="showdialog" persistent width="700">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Resultado
        </v-card-title>
        <v-card-text>
          <v-list subheader two-line>
            <v-subheader inset>Archivos</v-subheader>

            <v-list-item v-for="(file, index) in archivos" :key="index">
              <v-list-item-avatar>
                <v-icon class="grey lighten-1" dark>
                  attachment
                </v-icon>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="file"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-btn
                  icon
                  :href="'ftp://192.168.1.206/' + file"
                  target="_blank"
                >
                  <v-icon color="grey lighten-1">information</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="showdialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay style="text-align: center" :value="overlay">
      <p>Generando dispersion de pagos</p>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-overlay style="text-align: center" :z-index="zIndex" :value="showResult">
      <p>{{ Respuesta }}</p>
      <v-btn depressed color="primary" @click="showResult = false">
        Aceptar
      </v-btn>
    </v-overlay>
  </v-container>
</template>

<script>
import Vue from "vue";
import { mapActions } from "vuex";
//const setClass = new Set()
export default {
  name: "Dispersion",
  data: () => ({
    archivos: [],
    Respuesta: "",
    dialog: false,
    value: false,
    dialogDelete: false,
    editedIndex: -1,
    search: "",
    selected: [],
    items: [],
    selectedToFile: [],
    selectedSociedad: null,
    selectedSucursal: null,
    loadSucural: false,
    loadRest: false,
    loadTable: false,
    overlay: false,
    isGenerate: true,
    zIndex: 0,
    headers: [
      { text: "Folio", value: "docNum" },
      { text: "Saldo Pendiente", value: "saldoVencido", align: "right" },
      { text: "Vencimiento", value: "docDate", align: "right" },
      { text: "Add", value: "actions" },
    ],
    headers2: [
      { text: "", value: "actions" },
      // { text: "Factura", value: "docNum" },
      { text: "Saldo Pendiente", value: "saldoVencido" },
      // { text: "Vencimiento", value: "docDate" },
      { text: "Rebaja o Devol.", value: "rebajesoDevoluciones" },
      { text: "Dcto. 1", value: "descuento1" },
      { text: "Total dcto. 1", value: "total1" },
      { text: "Dcto. 2", value: "descuento2" },
      { text: "Total dcto. 2", value: "total2" },
      { text: "Dcto. 3", value: "descuento3" },
      { text: "Total dcto. 3", value: "total3" },
      { text: "Dcto. 4", value: "descuento4" },
      { text: "Total dcto. 4", value: "total4" },
      { text: "Total del pago", value: "total" },
    ],
    showdialog: false,
    showResult: false,
    selectedFile: undefined,
    fecha: new Date().toISOString().substr(0, 10),
    descuento1: 0,
    descuento2: 0,
    descuento3: 0,
    descuento4: 0,
    tipoDescuento1: null,
    tipoDescuento2: null,
    tipoDescuento3: null,
    tipoDescuento4: null,
  }),
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    ...mapActions("dispersion", [
      "getSucursales",
      "getSociedades",
      "getCuentas",
      "getAllTransfers",
      "generarTxtUnoxUno",
      "limpiar",
    ]),
    ...mapActions("credito", [
      "getCustomers",
      "getPagosCta",
      "getPendingBill",
      "getTypeDiscounts",
    ]),
    getSociedadText(item) {
      return `${item.code} - ${item.u_CompnyName}`;
    },
    getSucursalText(item) {
      return `${item.bplName} - ${item.bplFrName}`;
    },
    getOperacionText(item) {
      return `${item.d} - ${item.n}`;
    },
    getCuentaText(item) {
      return `${item.glAccount} - ${item.acctName}`;
    },
    getCustomerText(item) {
      return `${item.cardCode} - ${item.cardName}`;
    },
    getPagoCtaText(item) {
      return `${Vue.filter("currency")(item.credAmnt)} - ${item.referencia}`;
    },
    cargarDatos(sociedad) {
      this.loadSucural = true;
      this.getSucursales(sociedad.u_DB).then((res) => {
        this.loadSucural = false;
      });
      this.getTypeDiscounts({
        sociedad: sociedad.u_DB,
      }).then(() => {});
    },
    cargarDatos2(sucursal) {
      this.loadRest = true;
      this.getCuentas({
        sociedad: this.selectedSociedad.u_DB,
        sucursal: sucursal.bplName,
      }).then((res) => {
        this.loadRest = false;
      });
      this.getCustomers({
        sociedad: this.selectedSociedad.u_DB,
        sucursal: sucursal.bplFrName,
      }).then((res) => {
        this.loadRest = false;
      });
    },
    cargarDatos3(cuenta) {
      this.getPagosCta({
        sociedad: this.selectedSociedad.u_DB,
        cuenta,
      }).then((res) => {});
    },
    cargarDatos4(cliente) {
      this.loadTable = true;
      this.getPendingBill({
        sociedad: this.selectedSociedad.u_DB,
        sucursal: this.selectedSucursal.bplFrName,
        cliente,
      }).then((res) => {
        this.loadTable = false;
      });
    },
    // cargarDatos3() {
    //   this.loadTable = true;
    //   this.getAllTransfers().then((res) => {
    //     this.loadTable = false;
    //   });
    // },
    handlerEvent(e) {
      if (this.$refs.table._data.internalCurrentItems.length > 0) {
        this.selectedToFile.push(
          this.$refs.table._data.internalCurrentItems[0]
        );
        this.selectedToFile = [...new Set(this.selectedToFile)];
        this.search = "";
      } else alert("Tranferencia no encontrada, intente de nuevo.");
    },
    addItem(item) {
      item.descuento1 = this.descuento1;
      item.descuento2 = this.descuento2;
      item.descuento3 = this.descuento3;
      item.descuento4 = this.descuento4;
      this.selectedToFile.push(item);
      this.selectedToFile = [...new Set(this.selectedToFile)];
    },
    deleteItem(item) {
      this.editedIndex = this.selectedToFile.indexOf(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.selectedToFile.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    recalculate(item) {
      item.descuento1 = this.descuento1;
      item.descuento2 = this.descuento2;
      item.descuento3 = this.descuento3;
      item.descuento4 = this.descuento4;
      item.total1 =
        item.saldoVencido -
        item.rebajesoDevoluciones -
        ((item.saldoVencido - +item.rebajesoDevoluciones) * item.descuento1) /
          100;
      item.total2 = item.total1 - (item.total1 * item.descuento2) / 100;
      item.total3 = item.total2 - (item.total2 * item.descuento3) / 100;
      item.total4 = item.total3 - (item.total3 * item.descuento4) / 100;
      item.total = item.total4;
    },
    recalculateAll() {
      this.selectedToFile.forEach((item) => this.recalculate(item));
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
    generaUnoxUno() {
      this.overlay = true;
      let data = {
        transferencias: this.selectedToFile,
        g: this.isGenerate ? 1 : 0,
      };
      this.generarTxtUnoxUno(data)
        .then((res) => {
          if (res != null) {
            if (!Array.isArray(res)) {
              this.overlay = false;
              this.showResult = true;
              this.Respuesta = res;
            } else {
              this.archivos = res;
              this.overlay = false;
              this.showdialog = true;
            }
            this.cancelProcess();
          }
        })
        .catch((err) => {
          this.overlay = false;
          console.log(err);
        });
    },
    cancelProcess() {
      this.search = "";
      this.selectedToFile = [];
      this.limpiar();
      this.getAllTransfers();
    },
    onFileChange(event) {
      if (!this.selectedFile) {
        this.rows = [];
        return;
      }
      if (!/\.(xls|xlsx)$/.test(this.selectedFile.name.toLowerCase())) {
        return alert(
          "The upload format is incorrect. Please upload xls or xlsx format"
        );
      }
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const XLSX = xlsx;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet

          const a = workbook.Sheets[workbook.SheetNames[0]];
          const headers = this.getHeader(a);
          this.setTable(headers, ws);
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(this.selectedFile);
    },
  },
  computed: {
    tableHeight() {
      return window.innerHeight - 30;
    },
    pendingBills() {
      return this.$store.state.credito.pendingBills;
    },
    getValuesFromSet() {
      return this.selectedToFile.entries().next().value;
    },
    getTotal() {
      return this.selectedToFile.reduce((a, b) => a + (b["docTotal"] || 0), 0);
    },
    sociedades() {
      return this.$store.state.dispersion.sociedades;
    },
    sucursales() {
      return this.$store.state.dispersion.sucursales;
    },
    cuentas() {
      return this.$store.state.dispersion.cuentas;
    },
    customers() {
      return this.$store.state.credito.customers;
    },
    pagosCta() {
      return this.$store.state.credito.pagos;
    },
    typeDiscounts() {
      return this.$store.state.credito.typeDiscounts;
    },
  },
  mounted() {
    this.limpiar();
    //this.getAllTransfers();
    this.getSociedades();
  },
};
</script>

<style scoped></style>
