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
          disabled
          class="col-3"
        ></v-text-field>
      </v-row>
      <v-row>
        <v-text-field
          label="Buscar Operaciones"
          class="mx-4"
          prepend-inner-icon="search"
        ></v-text-field>
      </v-row>
      <v-skeleton-loader boilerplate type="table"></v-skeleton-loader>
    </div>
  </v-container>
</template>
<script></script>
