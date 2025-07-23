<template>
  <v-container>
    <v-toolbar dense>
      <v-toolbar-title>Acceso directo</v-toolbar-title>
    </v-toolbar>
    <v-row v-for="(menu, index) in doneMenu" :key="index" no-gutters>
      <v-col cols="12">
        <v-subheader>{{ menu.Tag }}</v-subheader>
      </v-col>
      <v-col v-for="(item, i) in menu.SubMenu" :key="i" cols="12" sm="6" md="3" lg="3" class="pa-1">
        <v-hover v-slot="{ hover }">
          <v-card color="#26c6da" dark max-width="400" @click="navegar(item)">
            <v-card-title>
              <v-icon large left>
                link
              </v-icon>
              <span class="title font-weight-light">{{ item.Tag }}</span>
            </v-card-title>

            <v-card-text class="headline font-weight-bold"> </v-card-text>

            <v-card-actions>
              <v-list-item class="grow"> </v-list-item>
            </v-card-actions>
            <v-fade-transition>
              <v-overlay v-if="hover" absolute color="#036358">
                <span class="subtitle-2">{{ item.Tag }}</span>
              </v-overlay>
            </v-fade-transition>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  data () {
    return {
      items: [],
      oItems: [],
    };
  },
  computed: {
    ...mapGetters("config", ["doneMenu"]),
  },
  methods: {
    navegar (item) {
      this.$store.commit("config/SET_CANCREATE", item.CanCreate);
      this.$store.commit("informes/SET_TITLE", item.Tag);
      this.$router.push({ path: item.Path, params: item.CanCreate });
    },
  }
};
</script>
