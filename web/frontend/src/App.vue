<template>
  <v-app>
    <v-app-bar app color="primary" dark>Sseukssak </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",
  data() {
    return {
      options: {
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        autoScrolling: true,
        scrollHorizontally: true,
      },
    };
  },

  components: {},
});
</script>
