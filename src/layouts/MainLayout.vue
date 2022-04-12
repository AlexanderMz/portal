<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Menu
            </v-list-item-title>
            <v-list-item-subtitle>
              Opciones
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>
              home
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              Inicio
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense expand nav v-for="menu in doneMenu" :key="menu.Id">
        <v-list-group no-action exact-path link="false">
          <template #activator>
            <v-list-item-icon>
              <v-icon>
                {{ menu.Icon }}
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title> {{ menu.Tag }} </v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item-group>
            <v-list-item
              v-model="selectedItem"
              v-for="sub in menu.SubMenu"
              :key="sub.Id"
              exact-path
              :link="false"
              :to="sub.Path"
              @click="navegar(sub)"
            >
              <v-list-item-icon>
                <v-icon> </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{ sub.Tag }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list-group>
      </v-list>

      <v-footer absolute>
        <v-col class="text-center" cols="12">
          <strong>@mm v5.0 | {{ new Date().getFullYear() }} | 04 </strong>
        </v-col>
      </v-footer>
    </v-navigation-drawer>

    <v-app-bar app fixed id="appbar">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Portal GOVI</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn @click="darkMode" icon v-bind="attrs" v-on="on">
            <v-icon>{{
              $vuetify.theme.isDark ? "light_mode" : "dark_mode"
            }}</v-icon>
          </v-btn>
        </template>
        <span>{{ $vuetify.theme.isDark ? "Claro" : "Oscuro" }}</span>
      </v-tooltip>
      <v-btn @click="salir" icon>
        <v-icon>logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-fade-transition appear>
        <router-view />
      </v-fade-transition>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "MainLayout",
  data: () => ({
    selectedItem: 1,
    drawer: null,
  }),
  methods: {
    ...mapActions("config", ["getMenu"]),
    salir() {
      localStorage.removeItem("jwt");
      this.$router.push({ name: "login" });
    },
    darkMode() {
      this.$vuetify.theme.isDark = !this.$vuetify.theme.isDark;
      this.dark = this.$vuetify.theme.isDark;
      localStorage.setItem("dark", this.$vuetify.theme.isDark ? true : false);
    },
    navegar(item) {
      this.$store.commit("informes/SET_TITLE", item.Tag);

      this.$router.push({ path: item.Path, params: item.id });
    },
  },
  computed: {
    ...mapGetters("config", ["doneMenu"]),
  },
  mounted() {
    this.getMenu();
  },
};
</script>
