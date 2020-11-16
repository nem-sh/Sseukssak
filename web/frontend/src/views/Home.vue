<template>
  <div class="home">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <DownloadPage />
      </div>
      <div class="section">
        <SliderPage/>
      </div>
      <div class="section">
        <IntroCard :VideoName="vi1" :desTitle="desT1" :desContent="desC1"/>
      </div>
      <div class="section">
        <IntroCard :VideoName="vi2" :desTitle="desT2" :desContent="desC2"/>
      </div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadPage from "@/components/DownloadPage.vue";
import SliderPage from "@/components/SliderPage.vue";
import IntroCard from "@/components/IntroCard.vue";

@Component({
  name: "Home",
  components: {
    DownloadPage,
    SliderPage,
    IntroCard,
  },
})
export default class Home extends Vue {
  data () {
    return {
      vi1: "MoveFiles.mp4",
      vi2: "RenameFiles.mp4",
      desT1: "파일 이동",
      desC1: "사용자의 설정에 따라 특정 폴더의 파일들을 깔끔하게 정리할 수 있습니다.",
      desT2: "파일 이름 변경",
      desC2: "특정 폴더 내의 파일들의 이름을 일괄적으로 변경할 수 있습니다.",
    }
  }
  options = {
    licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
    scrollHorizontally: true,
    anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
    sectionsColor: ['', '#4BBFC3', '#7BAABE', 'beige'],
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips: ['다운로드', '전후 비교', '파일 이동', '이름 변경'],
  }
}
</script>

<style>
.home {
  font-family: "Nanum Gothic", sans-serif !important;
  font-weight: 900;
  width: 100vw;
  height: 100vh;
  -ms-user-select: none; 
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>