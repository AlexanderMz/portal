<template>
    <v-container>
        <v-toolbar dense id="p">
            <v-toolbar-title>Ejecutar Preaplicaciones</v-toolbar-title>
            <v-spacer> </v-spacer>
            <v-row justify="end">
                <v-col>
                    <v-btn class="col" depressed color="primary">
                        Aplicar Operaciones
                    </v-btn>
                </v-col>
            </v-row>
        </v-toolbar>
        <div>
            <v-row dense>
                <v-col class="d-flex" cols="6">
                    <v-text-field label="Buscar Operaciones" class="mx-4" prepend-inner-icon="search"
                        @keydown.stop.enter="handlerEvent"></v-text-field>
                </v-col>
                <v-col class="d-flex" cols="3">
                    Registros cargados:
                    {{ getRegistros.length }}
                </v-col>
                <v-col class="d-flex" cols="3">
                    Registros seleccionados:
                    {{ selectedTxt.length }}
                </v-col>
            </v-row>
            <v-row dense>
                <v-col class="d-flex">
                    <v-expansion-panels accordion focusable>
                        <v-expansion-panel v-for="(item, i) in getRegistros" :key="i">
                            <v-expansion-panel-header>
                                <v-row no-gutters>
                                    <v-col cols="1">
                                        <v-checkbox hide-details class="shrink mr-2 mt-0" dense style="margin-top: 0px"
                                            v-model="selectedTxt" :value="item.id" @click.stop=""></v-checkbox>
                                    </v-col>
                                    <v-col cols="9"> {{ item.name }} - {{ item.nombre }} </v-col>
                                    <v-col cols="2">
                                        {{ item.totalImporte | currency }}
                                    </v-col>
                                </v-row>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-data-table dense :headers="responseColumns" :items="item.filas" hide-default-footer
                                    class="elevation-1" item-key="referencia" loading="true">
                                </v-data-table>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-col>
            </v-row>
        </div>
    </v-container>
</template>
<script>
import { mapActions } from "vuex";
export default {
    name: "TunelBancarioServicio",
    data: () => ({
        selectedFile: undefined,
        motivo: "",
        overlay: false,
        selectedTxt: [],
        showAlert: false,
        showResult: false,
        Respuesta: "",
        responseColumns: [
            { text: "Id", value: "referencia" },
            { text: "Cliente", value: "cuentaOrigen" },
            { text: "Monto Pago", value: "referencia1", align: "end" },
            { text: "Sucursal", value: "importe", },
            { text: "Agente CyC", value: "importe", },
            { text: "Fecha", value: "fechaAplicacion", align: "end" },
            { text: "Descuento", value: "referencia1", align: "end" },
        ],
        header: [
            { text: "Id", value: "referencia" },
            { text: "Cliente", value: "cuentaOrigen" },
            { text: "Monto Pago", value: "referencia1", align: "end" },
            { text: "Sucursal", value: "importe", },
            { text: "Agente CyC", value: "importe", },
            { text: "Fecha", value: "fechaAplicacion", align: "end" },
            { text: "Descuento", value: "referencia1", align: "end" },
        ],
    }),
    methods: {
        ...mapActions("tunel", ["postTunelServicio", "postUploadServicio"]),
        handlerEvent () {

        },
        enviarTunel () {
            this.overlay = true;
            this.postTunelServicio(this.selectedTxt)
                .then((res) => {
                    if (res) {
                        this.overlay = false;
                        this.showResult = true;
                        this.Respuesta = res.data;
                        this.selectedFile = undefined;
                    }
                })
                .catch((err) => {
                    this.overlay = false;
                    alert(err);
                    console.error(err);
                })
                .finally(() => {
                    this.overlay = false;
                });
        },
        onFileChange (event) {
            if (!this.selectedFile) return;
            this.selectedTxt = [];
            this.overlay = true;
            var formData = new FormData();
            this.selectedFile.forEach((element) => {
                formData.append("files", element);
            });
            this.postUploadServicio(formData)
                .then((res) => {
                    if (res) {
                        this.overlay = false;
                        this.selectedFile = undefined;
                    }
                })
                .catch((err) => {
                    this.overlay = false;
                    alert(err);
                    console.error(err);
                })
                .finally(() => {
                    this.selectedTxt = [];
                    this.overlay = false;
                });
        },
    },
    computed: {
        getRegistros () {
            return this.$store.state.tunel.resultado;
        },
    },
};
</script>

<style></style>
