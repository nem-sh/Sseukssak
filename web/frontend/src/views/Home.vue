<template>
  <div class="home">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <DownloadPage />
      </div>
      <div class="section">
        <div class="slide">
          <Intro1 />
        </div>
        <div class="slide"><Intro2 /></div>
        <div class="slide"><Intro3 /></div>  
      </div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadPage from "@/components/DownloadPage.vue";
import Intro1 from "@/components/Intro1.vue"
import Intro2 from "@/components/Intro2.vue"
import Intro3 from "@/components/Intro3.vue"


@Component({
  name: "Home",
  components: {
    DownloadPage,
  },
})
export default class Home extends Vue {
  options = {
    licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
    autoScrolling: true,
    scrollHorizontally: true,
  };
}
</script>

<style>
.home {
  font-family: 'Jua', sans-serif;;
}
</style>