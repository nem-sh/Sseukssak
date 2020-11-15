<template>
  <v-app>
    <!-- <v-app-bar v-if="Checker" app color="#7288da" dark class="appBar">
      <div class="LogoBox">
        <img :src="require(`@/assets/sweeping.png`)" alt="No Image" class="TopLogoImage"/>
      Sseukssak
      </div>
      <div class="BarDownload">
        <button @click="download()" class="TopDownButton">다운로드</button>
      </div>
    </v-app-bar> -->

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
      // Checker: this.$store.state.showAppBar,
      options: {
        licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        autoScrolling: true,
        scrollHorizontally: true,
      },
    };
  },
  methods: {
    // download() {
    //   const link = document.createElement("a");
    //   link.href = "http://k3b304.p.ssafy.io/static/sseukssak.exe";
    //   link.setAttribute("download", "sseukssak.exe");
    //   document.body.appendChild(link);
    //   link.click();
    // },
  },
  computed: {
  }
});
</script>
<style scoped>
.appbar {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.LogoBox {
  margin: auto;
  font-size: 5vh;
  font-family: "Nanum Gothic", sans-serif !important;
  font-weight: 900;
}
.TopLogoImage {
  height: 5vh;
}
.TopDownButton {
  border: 0;
  outline: 0;
}
</style>