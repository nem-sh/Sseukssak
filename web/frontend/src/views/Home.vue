<template>
  <div class="home">
    <full-page ref="fullpage" :options="options" id="fullpage">
      <div class="section">
        <DownloadPage />
      </div>
      <div class="section">
        <div class="slide">
          <IntroCard :picture="pic1" :descriptions="des1" />
        </div>
        <div class="slide">
          <IntroCard :picture="pic2" :descriptions="des2" />
        </div>
      </div>
      <div class="section">
        <div class="slide">
          <IntroCard :picture="pic3" :descriptions="des3" />
        </div>
        <div class="slide">
          <IntroCard :picture="pic4" :descriptions="des4" />
        </div>
      </div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadPage from "@/components/DownloadPage.vue";
import IntroCard from "@/components/IntroCard.vue";


@Component({
  name: "Home",
  components: {
    DownloadPage,
    IntroCard,
  },
})
export default class Home extends Vue {
  data () {
    return {
      pic1: "FromToPic.png",
      pic2: "FromToPic2.png",
      pic3: "RenamePic.png",
      pic4: "RenamePic2.png",
      des1: "정리를 원하는 폴더와 해당 폴더의 파일들이 이동할 폴더들을 지정합니다.",
      des2: "어떤 조건의 파일들을 어떤 폴더로 이동시킬 것인지 자유롭게 설정할 수 있습니다.",
      des3: "특정 폴더에서 이름 변경을 원하는 파일들을 선택합니다.",
      des4: "머릿말, 꼬릿말 등을 통해 체계적으로 파일 이름을 관리할 수 있습니다."
    }
  }
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
  height: 100vh;
  background-color: lightblue;
}
.OuterDiv {
  height: 85vh;
  margin-bottom: 10vh;
  padding-top: 0;
  width: 65vw;;
}
.slide {
  justify-content: center;
}
</style>