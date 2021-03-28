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
            @change="onFileChange2"
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
    <v-overlay :value="overlay">
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
    overlay: false
  }),
  methods: {
    getSucursalText (item) {
      return `${item.bplId} - ${item.bplFrName}`
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
      //const tableMapTitle = {}; // Set table content for Chinese and English
      headers.forEach((_, i) => {
        //tableMapTitle[_] = _;
        tableTitleData.push({
          text: _.toUpperCase(),
          value: _.toUpperCase(),
        });
      });
      //console.log("tableTitleData", tableTitleData);
      // Mapping table content attribute name is English
      // const newTableData = [];
      // excellist.forEach(_ => {
      //   const newObj = {};
      //   Object.keys(_).forEach(key => {
      //     newObj[tableMapTitle[key]] = _[key];
      //   });
      //   newTableData.push(newObj);
      // });
      // console.log('newTableData', newTableData);
      this.columns = tableTitleData;
      //this.rows = newTableData;
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
          console.log(ws)
          //const excellist = [];  // Clear received data
          // Edit data
          // for (var i = 0; i < ws.length; i++) {
          //   excellist.push(ws[i]);
          // }
          const a = workbook.Sheets[workbook.SheetNames[0]];
          const headers = this.getHeader(a)
          this.setTable(headers, ws)

        } catch (e) {
          return alert("Read failure!");;
        }
      };
      fileReader.readAsBinaryString(this.selectedFile);
    },
    onFileChange2 () {

    },
    EnviarSap () {
      this.overlay = true
      const info = {
        Ajustes: this.rows,
        Sucursal: this.selectedSucursal,
        Motivo: this.motivo
      }
      if (this.$store.dispatch("postSalida", info)) {
        this.overlay = false
        this.rows = []
        this.selectedFile = undefined
      }
    }

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