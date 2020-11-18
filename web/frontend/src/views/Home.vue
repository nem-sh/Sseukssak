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
        <IntroCard :VideoName="vi1" :desTitle="desT1" :desContent="desC1" :curpage="curpage"/>
      </div>
      <div class="section">
        <IntroCard2 :VideoName="vi2" :desTitle="desT2" :desContent="desC2" :curpage="curpage" />
      </div>
      <div class="section">
        <ContactUs />
      </div>
    </full-page>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DownloadPage from "@/components/DownloadPage.vue";
import SliderPage from "@/components/SliderPage.vue";
import IntroCard from "@/components/IntroCard.vue";
import IntroCard2 from "@/components/IntroCard2.vue";
import ContactUs from "@/components/ContactUs.vue";

@Component({
  name: "Home",
  components: {
    DownloadPage,
    SliderPage,
    IntroCard,
    IntroCard2,
    ContactUs
  },
})
export default class Home extends Vue {
  data () {
    return {
      vi1: "MoveFiles.mp4",
      vi2: "RenameFiles.mp4",
      desT1: "파일 정리",
      desC1: "사용자의 설정에 따라 특정 폴더의 파일들을 깔끔하게 정리할 수 있습니다.",
      desT2: "파일/폴더명 변경",
      desC2: "여러 파일 및 폴더 이름을 일괄적으로 변경할 수 있습니다.",
      curpage: "firstPage",
    }
  }
  options = {
    licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
    scrollHorizontally: true,
    anchors: ['firstPage', 'secondPage', 'thirdPage', 'fourthPage'],
    sectionsColor: ['', '#4BBFC3', '#7BAABE', 'beige', ""],
    navigation: true,
    navigationPosition: 'left',
    navigationTooltips: ['다운로드', '전후 비교', '파일 정리', '이름 변경', "팀 소개"],
    onSlideLeave: function(section, origin, destination, direction){
		// const leavingSlide = this;

		//leaving the first slide of the 2nd Section to the right
		if(section.index == 1 && origin.index == 0){
      console.log("Leaving the fist slide!!");
      console.log(direction)
		}
    },
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