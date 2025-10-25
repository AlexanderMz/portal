<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Saldo Disponible</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-btn depressed color="primary" :disabled="!selectedFile" style="margin-right: 10px" @click="EnviarSap">
        Enviar
      </v-btn>
      <v-btn v-if="id > 0" depressed color="error" style="margin-right: 10px" @click="BorrarRegistros">
        Borrar
      </v-btn>
    </v-toolbar>
    <div>
      <v-row>
        <v-text-field v-model="fecha" label="Fecha" prepend-icon="event" type="date" class="col-3"
          @input="OnLoadData"></v-text-field>
        <v-col class="d-flex" cols="10">
          <v-file-input label="Buscar archivo" outlined dense @change="onFileChange"
            v-model="selectedFile"></v-file-input>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="12">
          <v-data-table dense :items="rows" :headers="columns" hide-default-footer disable-pagination fixed-header
            disable-sort class="elevation-1" style="max-height: 500px" height="500px">
          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <!--  -->
    <v-dialog v-model="showAlert" persistent>
      <v-card>
        <v-card-title class="headline">
          Proceso terminado con éxito
        </v-card-title>
        <v-card-actions>
          <v-btn text color="primary" @click="
            showAlert = false;
          response = [];
          ">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay style="text-align: center" :value="overlay">
      <p>Procesando archivo...</p>
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import moment from "moment";
import { mapActions, mapState } from "vuex";
import xlsx from "xlsx";
import { mixin } from "../../mixin";

export default {
  name: "SaldoDisponible",
  data: () => ({
    fecha: moment().format("YYYY-MM-DD"),
    selectedFile: undefined,
    overlay: false,
    response: [],
    showAlert: false,
    id: 0
  }),
  mixins: [mixin],
  mounted () {
    this.OnLoadData(this.fecha)
  },
  methods: {
    ...mapActions("inversion", ["postSaldoDisponible", "getSaldoDisponible", "deleteSaldoDisponible"]),
    EnviarSap () {
      this.overlay = true;
      const data = {
        Fecha: this.fecha,
        Archivo: this.selectedFile.name,
        Usuario: this.userName,
        Detalle: this.rows.map(item => {
          return {
            Fecha: this.fecha,
            Clabe: item['CLABE'],
            Cuenta: item['CUENTA'],
            Moneda: item['MONEDA'],
            SaldoActual: item['SALDO ACTUAL'],
            SaldoDisponible: item['SALDO DISPONIBLE'],
            SaldoRetenido: item['SALDO RETENIDO'],
            Titular: item['TITULAR / PERSONALIZACIÓN'],
          }
        })
      }
      this.postSaldoDisponible(data)
        .then((res) => {
          if (res) {
            this.overlay = false;
            this.rows = [];
            this.selectedFile = undefined;
            this.response = res.data;
            this.showAlert = true;
          }
        })
        .catch((err) => {
          this.overlay = false;
          this.response = err.data;
          alert(this.response);
          console.error(err);
        })
        .finally(() => {
          this.overlay = false;
        });
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
        } catch (e) {
          return alert("Read failure!");
        }
      };
      fileReader.readAsBinaryString(this.selectedFile);
    },
    OnLoadData (fecha) {
      this.overlay = true;
      this.getSaldoDisponible(this.fecha)
        .then((res) => {
          if (res && res.length > 0) {
            this.overlay = false;
            this.id = res[0].iD_Encabezado
            const columns = Object.keys(res[0]).map(k => {
              return {
                text: k.toUpperCase(),
                value: k,
              }
            })
            this.columns = columns
            this.rows = res;
          } else {
            this.id = 0
            this.overlay = false;
            this.rows = [];
            this.columns = []
          }
        })
        .catch((err) => {
          this.overlay = false;
          alert(this.response);
          console.error(err);
        })
        .finally(() => {
          this.overlay = false;
        });
    },
    BorrarRegistros () {
      this.overlay = true;
      this.deleteSaldoDisponible(this.id)
        .then((res) => {
          if (res) {
            this.overlay = false;
            this.rows = [];
            this.columns = []
          }
        })
        .catch((err) => {
          this.overlay = false;
          alert(this.response);
          console.error(err);
        })
        .finally(() => {
          this.overlay = false;
        });
    }
  },
  computed: {
    ...mapState("login", ["userName"]),
  }
};
</script>

<style></style>
