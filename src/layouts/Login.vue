<template>
  <v-app id="inspire">
    <v-main>
      <v-container
        fluid
        fill-height
        justify-center
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            md="7"
            sm="8"
          >
            <v-sheet rounded="lg">
              <v-row
                class="ma-0"
                style="height: 80vh; align-content: center;"
              >
                <v-col
                  cols="12"
                  md="3"
                  class="pa-0"
                >
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-card
                    elevation="2"
                    color="#26c6da"
                  >
                    <v-img
                      class="white--text pt-5"
                      height="33px"
                      src="../assets/sap.png"
                      position="left top"
                      contain
                    >
                    </v-img>
                    <v-card-title>PORTAL GOVI</v-card-title>

                    <v-card-subtitle class="pb-0">
                      Inicio de sessión
                    </v-card-subtitle>
                    <v-divider light />
                    <v-card-text class="pt-4">
                      <div>
                        <v-form
                          v-model="valid"
                          ref="form"
                        >
                          <v-text-field
                            label="Usuario"
                            v-model="username"
                            :rules="emailRules"
                            required
                            solo
                            prepend-inner-icon="people"
                          ></v-text-field>
                          <v-text-field
                            label="Contraseña"
                            v-model="password"
                            type="password"
                            :rules="passwordRules"
                            required
                            solo
                            prepend-inner-icon="password"
                          ></v-text-field>
                          <v-card-actions>
                            <v-btn
                              block
                              @click="submit"
                              :class=" { '#26c6da white--text' : valid, disabled: !valid }"
                            >Entrar</v-btn>
                          </v-card-actions>
                        </v-form>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  class="pa-0"
                >
                </v-col>
              </v-row>

            </v-sheet>
          </v-col>
          <v-overlay :value="overlay">
            <v-progress-circular
              indeterminate
              size="64"
            ></v-progress-circular>
          </v-overlay>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "login",
  data () {
    return {
      valid: false,
      overlay: false,
      e1: false,
      password: '',
      passwordRules: [
        (v) => !!v || 'Contraseña es requerida',
      ],
      username: '',
      emailRules: [
        (v) => !!v || 'Usuario es requerida'
      ],
    }
  },
  methods: {
    ...mapActions("login", ['login']),
    submit () {
      if (this.$refs.form.validate()) {
        this.overlay = true
        this.login({ UserName: this.username, Password: this.password })
          .then(res => {
            if (res) {
              localStorage.setItem('jwt', escape(JSON.stringify({ email: this.email, jwt: this.password })))
              localStorage.setItem('user', this.username)
              localStorage.setItem('pass', this.password)
              this.overlay = false

              this.$router.push('/')
            }
            this.loadTable = false
          })
          .catch(err => {

          })
      }
    },
    clear () {
      this.$refs.form.reset()
    }
  },
}
</script>

<style>
</style>