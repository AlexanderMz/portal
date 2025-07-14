<template>
  <v-container>
    <v-toolbar dense id="p">
      <v-toolbar-title>Aplicación de pagos | Facturas con descuentos</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-row justify="end">
        <v-col>
          <v-btn depressed color="primary" @click="guardarPago(1)" :disabled="!selectedToFile.length">
            Preaplicación
          </v-btn>
        </v-col>
        <v-col>
          <v-btn class="col" depressed color="primary" @click="guardarPago(2)"
            :disabled="canCreate && !selectedToFile.length">
            Generar Operación
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <div>
      <v-row class="align-center">
        <v-col class="d-flex" cols="2" md="2">
          <v-checkbox dense label="Manual" v-model="value" value="value"></v-checkbox>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="fecha" label="Fecha" prepend-icon="event" type="date" disabled></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-text-field v-model="fechaPago" label="Fecha Pago" prepend-icon="event" type="date"></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-combobox label="Forma de Pago" dense solo :items="formasPagos" v-model="selectedFormaPago"
            item-text="descr" return-object item-value="fidValue" :disabled="selectedToFile.length > 0"></v-combobox>
        </v-col>
      </v-row>
      <!-- Sociedad & Sucursal -->
      <v-row>
        <v-col class="d-flex" cols="3" md="3">
          <v-select label="Sociedad o Empresa" dense solo :items="sociedades" v-model="selectedSociedad"
            :item-text="getSociedadText" item-value="u_CompnyName" return-object @input="cargarDatos"
            :disabled="selectedToFile.length > 0"></v-select>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-combobox label="Surcural" dense solo :items="sucursales" v-model="selectedSucursal"
            :item-text="getSucursalText" return-object item-value="bplName" @input="cargarDatos2"
            :disabled="selectedToFile.length > 0"></v-combobox>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-combobox label="Cuenta Bancaria" dense solo :items="cuentas" :item-text="getCuentaText"
            item-value="glAccount" v-model="selectedCuenta" return-object @input="cargarDatos3"
            :disabled="selectedToFile.length > 0"></v-combobox>
        </v-col>
        <v-col class="d-flex" cols="3" md="3">
          <v-combobox label="Cliente" dense solo :items="customers" :item-text="getCustomerText" item-value="cardCode"
            v-model="selectedCustomer" return-object @input="cargarDatos4"
            :disabled="selectedToFile.length > 0"></v-combobox>
        </v-col>
      </v-row>
      <!-- Descuentos -->
      <v-row align="start">
        <v-col cols="4">
          <v-combobox label="Pago edo. Cta" dense solo :item-text="getPagoCtaText" item-value="glAccount"
            v-model="selectedPagoCta" :disabled="selectedToFile.length > 0"
            @click="() => (this.showdialogCta = true)"></v-combobox>
        </v-col>
        <v-col cols="3">
          <v-select dense solo :items="[{ itemName: 'Especial' }, { itemName: 'Pronto Pago' }]" v-model="tipoDescuento1"
            item-text="itemName" label="Tipo de descuento 1" append :disabled="selectedToFile.length > 0"></v-select>
        </v-col>
        <v-col cols="1">
          <v-select v-model="descuento1" :items="porcentageTipoDcto(tipoDescuento1)" @change="recalculateAll()"
            :disabled="selectedToFile.length > 0" append-outer-icon="percent">
          </v-select>
        </v-col>
        <v-col cols="3">
          <v-select dense solo :items="[{ itemName: 'Especial' }, { itemName: 'Pronto Pago' }]" v-model="tipoDescuento2"
            item-text="itemName" label="Tipo de descuento 2" append :disabled="selectedToFile.length > 0"></v-select>
        </v-col>
        <v-col cols="1">
          <v-select v-model="descuento2" :items="porcentageTipoDcto(tipoDescuento2)" @change="recalculateAll()"
            :disabled="selectedToFile.length > 0" append-outer-icon="percent">
          </v-select>
        </v-col>
      </v-row>
      <v-row align="start">
        <v-col class="d-flex" cols="4" md="4">
          <v-file-input label="Adjuntar template" outlined dense @change="onFileChange"
            v-model="selectedFile"></v-file-input>
        </v-col>
        <v-col cols="3">
          <v-select dense solo :items="[{ itemName: 'Especial' }, { itemName: 'Pronto Pago' }]" v-model="tipoDescuento3"
            item-text="itemName" label="Tipo de descuento 3" append :disabled="selectedToFile.length > 0"></v-select>
        </v-col>
        <v-col cols="1">
          <v-select v-model="descuento3" :items="porcentageTipoDcto(tipoDescuento3)" @change="recalculateAll()"
            :disabled="selectedToFile.length > 0" append-outer-icon="percent">
          </v-select>
        </v-col>
        <v-col cols="3">
          <v-select dense solo :items="[{ itemName: 'Especial' }, { itemName: 'Pronto Pago' }]" v-model="tipoDescuento4"
            item-text="itemName" label="Tipo de descuento 4" append :disabled="selectedToFile.length > 0"></v-select>
        </v-col>
        <v-col cols="1">
          <v-select v-model="descuento4" :items="porcentageTipoDcto(tipoDescuento4)" @change="recalculateAll()"
            :disabled="selectedToFile.length > 0" append-outer-icon="percent">
          </v-select>
        </v-col>
      </v-row>
      <!-- Tablas -->
      <v-row>
        <v-col cols="4" md="4">
          <v-data-table dense v-if="!loadTable" v-model="selected" :headers="headers" :items="pendingBills"
            :search="search" :items-per-page="25" disable-sort fixed-header item-key="name" class="elevation-1"
            ref="table" :height="tableHeight" id="tablemain">
            <template v-slot:top>
              <v-banner sticky icon="search" flat>
                <v-text-field v-model="search" label="Buscar transferencia" class="mx-4"
                  @keydown.stop.enter="handlerEvent"></v-text-field>

                <template v-slot:actions>
                  {{ pendingBills.length }}
                </template>
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
          <v-skeleton-loader v-if="loadTable" class="mx-auto" type="table"></v-skeleton-loader>
        </v-col>
        <v-col cols="8" md="8">
          <v-data-table dense :headers="headers2" :items="selectedToFile" class="elevation-1" hide-default-footer
            disable-pagination disable-sort :fixed-header="true" :height="tableHeight" id="tabledetalle">
            <template v-slot:top>
              <v-row no-gutters>
                <v-col cols="8" sm="6" md="8">
                  <v-btn rounded icon title="Eliminar todos" @click="deleteAll">
                    <v-icon>delete</v-icon>
                  </v-btn>
                  {{ selectedToFile.length }} seleccionadas | Total:
                  {{ getTotal | currency }}
                </v-col>
                <v-col>
                  <v-checkbox class="pa-0 ma-1" dense label="Timbrar Pago" v-model="timbrarPago"></v-checkbox>
                </v-col>
              </v-row>
              <v-dialog v-model="dialogDelete" max-width="600px">
                <v-card>
                  <v-card-title class="headline">¿Esta seguro que desea borrar esta factura?</v-card-title>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
            <template v-slot:[`item.docDate`]="{ item }">
              <span> {{ item.docDate | textcrop2(10) }} </span>
            </template>
            <template v-slot:[`item.rebajesoDevoluciones`]="{ item }">
              <v-chip :color="item.rebajesoDevoluciones != item.saldoVencido
            ? 'red'
            : 'blue'
            " dark>
                <v-edit-dialog :return-value.sync="item.rebajesoDevoluciones" @save="recalculate(item)">
                  {{ item.rebajesoDevoluciones | currency }}
                  <template v-slot:input>
                    <v-text-field v-model="item.rebajesoDevoluciones" :label="item.docNum" single-line counter
                      type="number"></v-text-field>
                  </template>
                </v-edit-dialog>
              </v-chip>
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
                <v-btn icon :href="'ftp://192.168.1.206/' + file" target="_blank">
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
    <v-dialog v-model="showdialogCta" persistent width="800">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          Seleccionar cuenta
        </v-card-title>
        <v-card-text>
          <v-data-table :items="pagosCta" :items-per-page="10" :search="searchCta" :headers="[
            { text: 'Valor', value: 'credAmnt' },
            { text: 'Fecha', value: 'dueDate' },
            { text: 'Referencia', value: 'referencia' },
          ]" class="elevation-1" item-key="sequence" disable-sort fixed-header single-select show-select every-item
            @item-selected="({ item }) => {
            this.selectedPagoCta = item;
            this.showdialogCta = false;
          }
            ">
            <template v-slot:top>
              <v-banner sticky icon="search" flat>
                <v-text-field v-model="searchCta" label="Buscar transferencia" class="mx-4"></v-text-field>
              </v-banner>
            </template>
            <template v-slot:[`item.credAmnt`]="{ item }">
              <span> {{ item.credAmnt | currency }} </span>
            </template>
            <template v-slot:[`item.dueDate`]="{ item }">
              <span> {{ item.dueDate | textcrop2(10) }} </span>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn text color="primary" @click="showdialogCta = false">Cerrar</v-btn>
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
import moment from "moment";
import Vue from "vue";
import { mapActions } from "vuex";
import xlsx from "xlsx";
import { mixin } from "../../mixin";
//const setClass = new Set()
export default {
  name: "Pagos",
  data: () => ({
    archivos: [],
    Respuesta: "",
    dialog: false,
    value: false,
    timbrarPago: true,
    dialogDelete: false,
    editedIndex: -1,
    search: "",
    searchCta: "",
    selected: [],
    items: [],
    selectedToFile: [],
    selectedSociedad: null,
    selectedSucursal: null,
    selectedCuenta: null,
    selectedCustomer: null,
    selectedPagoCta: null,
    selectedFormaPago: null,
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
      { text: "Factura", value: "docNum" },
      { text: "Vencimiento", value: "docDate" },
      { text: "Saldo Pendiente", value: "saldoVencido" },
      { text: "Monto a Pagar", value: "rebajesoDevoluciones" },
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
    showdialogCta: false,
    showResult: false,
    selectedFile: undefined,
    fecha: moment().format("YYYY-MM-DD"),
    fechaPago: moment().format("YYYY-MM-DD"),
    descuento1: 0,
    descuento2: 0,
    descuento3: 0,
    descuento4: 0,
    tipoDescuento1: null,
    tipoDescuento2: null,
    tipoDescuento3: null,
    tipoDescuento4: null,
    canCreate: localStorage.getItem("canCreate") || true,
    formasPagos: [
      { fidValue: '01', descr: 'Efectivo' },
      { fidValue: '02', descr: 'Cheque nominativo' },
      { fidValue: '03', descr: 'Transferencia electrónica de fondos' },
      { fidValue: '04', descr: 'Tarjeta de crédito' },
      { fidValue: '28', descr: 'Tarjeta de débito' },
      { fidValue: '99', descr: 'Por definir' },
    ]
  }),
  mixins: [mixin],
  watch: {
    dialog (val) {
      val || this.close();
    },
    dialogDelete (val) {
      val || this.closeDelete();
    },
  },
  methods: {
    ...mapActions("dispersion", [
      "getSucursales",
      "getSociedades",
      "getCuentas",
      "limpiar",
    ]),
    ...mapActions("credito", [
      "getCustomers",
      "getPagosCta",
      "getPendingBill",
      "getTypeDiscounts",
      "insertarPago",
      "limpiarCredito",
      "deleteItemPending",
      "addItemPending"
    ]),
    getSociedadText (item) {
      return `${item.code} - ${item.u_CompnyName}`;
    },
    getSucursalText (item) {
      return `${item.bplName} - ${item.bplFrName}`;
    },
    getOperacionText (item) {
      return `${item.d} - ${item.n}`;
    },
    getCuentaText (item) {
      return `${item.glAccount} - ${item.acctName}`;
    },
    getCustomerText (item) {
      return `${item.cardCode} - ${item.cardName}`;
    },
    getPagoCtaText (item) {
      return `${Vue.filter("currency")(item.credAmnt)} - ${item.referencia}`;
    },
    cargarDatos (sociedad) {
      this.loadSucural = true;
      this.getSucursales(sociedad.u_DB).then((res) => {
        this.loadSucural = false;
      });
      // this.getTypeDiscounts({
      //   sociedad: sociedad.u_DB,
      // }).then(() => {});
    },
    cargarDatos2 (sucursal) {
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
    cargarDatos3 (cuenta) {
      this.getPagosCta({
        sociedad: this.selectedSociedad.u_DB,
        cuenta: cuenta.glAccount,
      }).then((res) => { });
    },
    cargarDatos4 (cliente) {
      this.loadTable = true;
      this.getPendingBill({
        sociedad: this.selectedSociedad.u_DB,
        sucursal: this.selectedSucursal.bplFrName,
        cliente: cliente.cardCode,
      }).then((res) => {
        this.loadTable = false;
      });
    },
    handlerEvent (e) {
      if (this.$refs.table._data.internalCurrentItems.length > 0) {
        this.selectedToFile.push(
          this.$refs.table._data.internalCurrentItems[0]
        );
        this.selectedToFile = [...new Set(this.selectedToFile)];
        this.search = "";
      } else alert("Tranferencia no encontrada, intente de nuevo.");
    },
    addItem (item) {
      item.descuento1 = this.descuento1;
      item.descuento2 = this.descuento2;
      item.descuento3 = this.descuento3;
      item.descuento4 = this.descuento4;
      item.rebajesoDevoluciones = item.saldoVencido;
      this.recalculate(item);
      this.selectedToFile.push(item);
      this.selectedToFile = [...new Set(this.selectedToFile)];
      this.deleteItemPending(item)
    },
    deleteAll () {
      this.selectedToFile = []
      this.cargarDatos4(this.selectedCustomer)
    },
    deleteItem (item) {
      this.editedIndex = this.selectedToFile.indexOf(item);
      this.dialogDelete = true;
    },
    deleteItemConfirm () {
      this.addItemPending(this.selectedToFile[this.editedIndex])
      this.selectedToFile.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    resolveExcel () {
      if (this.pendingBills.length === 0) {
        alert("Debe cargar las facturas pendientes antes de continuar")
        return;
      }
      this.rows.forEach(f => {
        const item = this.pendingBills.find(p => Number.parseInt(p.docNum) === f.Folio)
        this.addItem(item)
      })

    },
    recalculate (item) {
      item.descuento1 = this.descuento1;
      item.descuento2 = this.descuento2;
      item.descuento3 = this.descuento3;
      item.descuento4 = this.descuento4;
      item.total1 =
        item.rebajesoDevoluciones -
        (+item.rebajesoDevoluciones * item.descuento1) / 100;
      item.total2 = item.total1 - (item.total1 * item.descuento2) / 100;
      item.total3 = item.total2 - (item.total2 * item.descuento3) / 100;
      item.total4 = item.total3 - (item.total3 * item.descuento4) / 100;
      item.total = item.total4;
    },
    recalculateAll () {
      this.selectedToFile.forEach(this.recalculate);
    },
    closeDelete () {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedIndex = -1;
      });
    },
    async guardarPago (tipoOp) {
      try {
        let user = localStorage.getItem("user");
        const totalAPagar = this.getTotal.toFixed(2);
        const totalPorPagar = this.selectedPagoCta.credAmnt.toFixed(2);
        if (Number.parseFloat(totalPorPagar) < Number.parseFloat(totalAPagar)) {
          alert("El saldo sobrepasa el valor de la cuenta");
          return;
        }
        const pago = {
          fecha: this.fecha,
          fechaPago: this.fechaPago,
          sociedad: this.selectedSociedad.u_DB,
          sucursal: this.selectedSucursal.bplFrName,
          bplId: this.selectedSucursal.bplId,
          idCuenta: this.selectedCuenta.glAccount,
          cuenta: this.selectedCuenta.acctName,
          cardCode: this.selectedCustomer.cardCode,
          cardName: this.selectedCustomer.cardName,
          monto: this.selectedPagoCta.credAmnt,
          referencia: this.selectedPagoCta.referencia,
          idEdoCta: this.selectedPagoCta.sequence,
          descuento1: this.tipoDescuento1 || "",
          porcDesc1: this.descuento1,
          descuento2: this.tipoDescuento2 || "",
          porcDesc2: this.descuento2,
          descuento3: this.tipoDescuento3 || "",
          porcDesc3: this.descuento3,
          descuento4: this.tipoDescuento4 || "",
          porcDesc4: this.descuento4,
          totalAPagar,
          estatus: "",
          comentarios: "",
          tipoOp,
          usuario: user,
          fidValue: selectedFormaPago.fidValue,
          detalles: this.selectedToFile.map((detalle, index) => {
            return {
              docEntry: detalle.docEntry,
              docNum: detalle.docNum,
              saldoVencido: detalle.saldoVencido,
              rebjDev: detalle.rebajesoDevoluciones,
              montoDcto1:
                (+detalle.rebajesoDevoluciones * detalle.descuento1) / 100,
              tDcto1: detalle.total1,
              montoDcto2: (detalle.total1 * detalle.descuento2) / 100,
              tDcto2: detalle.total2,
              montoDcto3: (detalle.total2 * detalle.descuento3) / 100,
              tDcto3: detalle.total3,
              montoDcto4: (detalle.total3 * detalle.descuento4) / 100,
              tDcto4: detalle.total4,
              totalPago: detalle.total4,
              manual: +this.value,
              tipo: "",
              estatus: "",
              comentarios: "",
              uuid: detalle.uuid,
              transId: detalle.transId
            };
          }),
        };

        try {
          const result = await this.insertarPago(pago);
          console.log("Pago insertado con éxito:", result);
          alert("Pago insertado con éxito");
          this.cancelProcess();
        } catch (e) {
          console.error("Error al insertar pago:", e);
          alert("Error al insertar pago");
        }
      } catch (error) {
        alert("Debe seleccionar todas las opciones");
      }
    },
    cancelProcess () {
      this.search = "";
      this.selectedToFile = [];
      this.limpiar();
      this.limpiarCredito();
    },
    onFileChange (event) {
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
          this.resolveExcel()
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(this.selectedFile);
    },
    porcentageTipoDcto (tipoDescuento) {
      return tipoDescuento == "Especial"
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9]
        : [1, 2, 3];
    },
  },
  computed: {
    tableHeight () {
      return window.innerHeight - 30;
    },
    pendingBills () {
      return this.$store.state.credito.pendingBills.sort((a, b) => {
        if (a.docNum > b.docNum) {
          return 1;
        }
        return -1
      });
    },
    getValuesFromSet () {
      return this.selectedToFile.entries().next().value;
    },
    getTotal () {
      return this.selectedToFile.reduce((a, b) => a + (b["total4"] || 0), 0);
    },
    sociedades () {
      return this.$store.state.dispersion.sociedades;
    },
    sucursales () {
      return this.$store.state.dispersion.sucursales;
    },
    cuentas () {
      return this.$store.state.dispersion.cuentas;
    },
    customers () {
      return this.$store.state.credito.customers;
    },
    pagosCta () {
      return this.$store.state.credito.pagos;
    },
    typeDiscounts () {
      return this.$store.state.credito.typeDiscounts;
    },
    rules () {
      return [
        (value) => {
          if (this.tipoDescuento3 === "Especial") {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
              return "Input must be a number.";
            }
            if (parsedValue >= 1 && parsedValue <= 10) {
              return true;
            }
            return `El rango para este tipo de descuentos es de ${1} y ${10}.`;
          }
        },
        (value) => {
          if (this.tipoDescuento3 === "Pronto Pago") {
            const parsedValue = parseFloat(value);
            if (isNaN(parsedValue)) {
              return "Input must be a number.";
            }
            if (parsedValue <= 3) {
              return true;
            }
            return `El máximo para este tipo de descuentos es de ${3}.`;
          }
        },
      ];
    },
  },
  mounted () {
    this.limpiar();
    this.limpiarCredito();
    this.getSociedades();
  },
};
</script>

<style scoped></style>
