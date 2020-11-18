<template>
  <div class="IntWrapper">
    <v-container style="height:100%">
      <v-row class="TheRow d-flex align-center">
        <v-col class="ImagePart" cols="12" lg="7">
          <video aria-describedby="" autoplay="true" loop="" muted="" playsinline="" data-keepplaying class="IntroVideo">
            <source :data-src="require(`@/assets/${VideoName}`)" type="video/mp4" class="VideoPart"/>
          </video>
        </v-col>
        <v-col cols="0" lg="1"></v-col>
        <v-col class="VideoDescription d-flex flex-column" cols="12" lg="4">
          <div class="text-center">
            <div class="DesTitle pb-5">
              {{desTitle}}
            </div>
            <div class="DesContent">
              {{desContent}}
            </div>
          </div>
        </v-col>
      </v-row>
      <button @click="MyTest()">
        TESTING
      </button>
    </v-container>
  </div>
</template>

<script>
// import fullpage from "fullpage.js";

export default {
  name: "IntroCard",
  props: {
    VideoName: String,
    desTitle: String,
    desContent: String,
  },
  data () {
    return {
    }
  },
  methods: {
    // isElementInViewport (el) {

    // // Special bonus for those using jQuery
    // if (typeof jQuery === "function" && el instanceof jQuery) {
    //     el = el[0];
    // }

    // var rect = el.getBoundingClientRect();

    // return (
    //     rect.top >= 0 &&
    //     rect.left >= 0 &&
    //     rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
    //     rect.right <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    // );
    // },
    TextAnimation (el, elcs) {
      const text = document.querySelector(el);
      let newDom = '';
      const animationDelay = 6;

        for(let i = 0; i < text.innerText.length; i++)
        {
            newDom += `<span class="${elcs}">` + (text.innerText[i] == ' ' ? '&nbsp;' : text.innerText[i])+ '</span>';
        }

        text.innerHTML = newDom;
        const length = text.children.length;

        for(let i = 0; i < length; i++)
        {
            text.children[i].style['animation-delay'] = animationDelay * i + 'ms';
        }
    },
    MyTest() {
      this.TextAnimation(".DesTitle", "DesTitle2")
      this.TextAnimation(".DesContent", "DesContent2")
    }
  },
}
</script>

<style>
.IntWrapper {
  width: 100%;
  height: 100%;
}

.IntroVideo {
  /* width: 100%;
  height: 100%; */
  width: 700px;
  box-shadow: 0px 0px 20px #000;
}
.VideoPart {
  height: 100%;
  width: 100%;
}
.TheRow {
  width: 100%;
  height: 100%;
  justify-content: center;
}
.VideoDescription {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-content: center;
  font-size: 3.5vh;
  color: black;
}
.DesTitle {
  font-size: 6vh;
}
.DesContent {
  font-size: 3vh;
}
.right {
  animation: showItemRight-data-v-0e7b0bfa 1s!important;
}
.DesTitle2{
    font-size: 6vh;
    animation: an 1s ease-out 1 both;
    display: inline-block;
}
.DesContent2{
    font-size: 3vh;
    animation: an 1s ease-out 1 both;
    display: inline-block;
}

@keyframes an{
  from{
    opacity: 0;
    transform: perspective(500px) translate3d(-35px, -40px, -150px) rotate3d(1, -1, 0, 35deg);
  }
  to{
    opacity: 1;
    transform: perspective(500px) translate3d(0, 0, 0);
  }
}
</style>