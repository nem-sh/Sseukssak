<template>
  <div class="home">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <div class="slide">쓱싹쓱싺!</div>
        <div class="slide">쓱싹쓱싺! 쓱싹쓱싺!</div>
      </div>
      <div class="section">Second section ...</div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  name: "Home",
  components: {
    HelloWorld,
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
