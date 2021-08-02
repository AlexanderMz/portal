<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App',
  mounted () {
    this.$vuetify.theme.isDark = (localStorage.getItem('dark') == 'true')
  },
};
</script>