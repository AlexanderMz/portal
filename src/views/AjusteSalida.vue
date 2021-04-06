<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Ajustes de salida de inventario</v-toolbar-title>
      <v-spacer> </v-spacer>
      <v-btn
        depressed
        color="primary"
        :disabled="!selectedFile"
        style="margin-right: 10px"
        @click="EnviarSap"
      >
        Enviar a SAP
      </v-btn>
    </v-toolbar>
    <div>
      <v-row>
        <v-col
          class="d-flex"
          cols="6"
        >
          <v-file-input
            label="Buscar archivo"
            outlined
            dense
            @change="onFileChange"
            v-model="selectedFile"
          ></v-file-input>
        </v-col>
        <v-col
          class="d-flex"
          cols="6"
        >
          <v-file-input
            label="Buscar comprobante"
            outlined
            dense
            v-model="selectedFile2"
          ></v-file-input>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          class="d-flex"
          cols="6"
        >
          <v-select
            label="Cedis"
            dense
            outfilled
            :items="cedis"
            v-model="selectedSucursal"
            :item-text="getSucursalText"
            return-object
            item-value="bplId"
          ></v-select>
        </v-col>
        <v-col
          class="d-flex"
          cols="6"
        >
          <v-text-field
            dense
            label="Motivo ajuste"
            v-model="motivo"
          >

          </v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          cols="12"
          md="12"
        >
          <v-data-table
            dense
            :items="rows"
            :headers="columns"
            hide-default-footer
            disable-pagination
            fixed-header
            disable-sort
            class="elevation-1"
            style="max-height: 500px"
            height="500px"
          >

          </v-data-table>
        </v-col>
      </v-row>
    </div>
    <!--  -->
    <v-dialog
      v-model="showAlert"
      persistent
      width="600"
    >
      <v-card>
        <v-card-title class="headline">
          Documento Generado en SAP: {{response.DocNum}}
        </v-card-title>
        <v-card-text>
          <v-data-table
            dense
            :items="response.DocumentLines"
            :headers="responseColumns"
            hide-default-footer
            disable-pagination
            fixed-header
            disable-sort
            class="elevation-1"
            style="max-height: 300px"
            height="300px"
          >
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn
            text
            color="primary"
            @click="showAlert = false; response = []"
          >Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay
      style="text-align: center"
      :value="overlay"
    >
      <p>Generando ajuste</p>
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import xlsx from "xlsx";

export default {
  name: 'AjusteSalida',
  data: () => ({
    rows: [],
    columns: [],
    selectedSucursal: null,
    selectedFile: undefined,
    selectedFile2: undefined,
    motivo: '',
    overlay: false,
    response: [],
    showAlert: false,
    responseColumns: [
      { text: 'Producto', value: 'ItemCode' },
      { text: 'Descripción', value: 'ItemDescription' },
      { text: 'Ajuste', value: 'Quantity', align: 'right' },
    ],
  }),
  methods: {
    EnviarSap () {
      this.overlay = true
      const info = {
        Ajustes: this.rows,
        Sucursal: this.selectedSucursal,
        Motivo: this.motivo,
        Tipo: 'salida'
      }
      this.$store.dispatch("postAjuste", info)
        .then(res => {
          if (res) {
            this.overlay = false
            this.rows = []
            this.selectedFile = undefined
            this.response = res.data
            this.showAlert = true
          }
        })
        .catch(err => {
          this.overlay = false
          this.response = err.data
          alert(this.response)
          console.error(err)
        })
        .finally(() => {
          this.overlay = false
        })
    },
    getSucursalText (item) {
      return `${item.bplName} - ${item.bplFrName}`
    },
    getHeader (sheet) {
      const XLSX = xlsx;
      const headers = [];
      const range = XLSX.utils.decode_range(sheet["!ref"]); // worksheet['!ref'] Is the valid range of the worksheet
      let C;
      /* Get cell value start in the first row */
      const R = range.s.r; //Line / / column C
      let i = 0;
      for (C = range.s.c; C <= range.e.c; ++C) {
        var cell =
          sheet[
          XLSX.utils.encode_cell({ c: C, r: R })
          ]; /* Get the cell value based on the address  find the cell in the first row */
        var hdr = "UNKNOWN" + C; // replace with your desired default
        // XLSX.utils.format_cell Generate cell text value
        if (cell && cell.t) hdr = XLSX.utils.format_cell(cell);
        if (hdr.indexOf('UNKNOWN') > -1) {
          if (!i) {
            hdr = '__EMPTY';
          } else {
            hdr = '__EMPTY_' + i;
          }
          i++;
        }
        headers.push(hdr);
      }
      return headers;
    },
    setTable (headers, excellist) {
      const tableTitleData = []; // Store table header data
      headers.forEach((_, i) => {
        tableTitleData.push({
          text: _.toUpperCase(),
          value: _.toUpperCase(),
        });
      });
      this.columns = tableTitleData;
      this.rows = excellist;
    },
    onFileChange (event) {
      if (!/\.(xls|xlsx)$/.test(this.selectedFile.name.toLowerCase())) {
        return alert("The upload format is incorrect. Please upload xls or xlsx format");
      }
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const XLSX = xlsx;
          const workbook = XLSX.read(data, {
            type: "binary"
          });
          const wsname = workbook.SheetNames[0]; // Take the first sheet，wb.SheetNames[0] :Take the name of the first sheet in the sheets
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // Generate JSON table content，wb.Sheets[Sheet名]    Get the data of the first sheet
          ws.forEach(element => {
            element["PRODUCTO"] = typeof element["PRODUCTO"] === "string" ? element["PRODUCTO"] : '' + element["PRODUCTO"] + ''
            if (!element.hasOwnProperty("DESCRIPCION")) {
              element["DESCRIPCION"] = ''
            }
          });
          const a = workbook.Sheets[workbook.SheetNames[0]];
          const headers = this.getHeader(a)
          this.setTable(headers, ws)

        } catch (e) {
          return alert("Read failure!");;
        }
      };
      fileReader.readAsBinaryString(this.selectedFile);
    },

  },
  computed: {
    cedis () {
      return this.$store.state.ajustes.cedis
    }
  },
  mounted () {
    this.$store.dispatch("getCedis")
  }
}
</script>

<style>
</style>