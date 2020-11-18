<template>
  <div class="IntWrapper">
    <v-container style="height:100%">
      <v-row class="TheRow d-flex align-center">
        <v-col class="VideoDescription d-flex flex-column" cols="12" md="4">
          <div class="text-center">
            <div class="DesTitle pb-5">
              {{desTitle}}
            </div>
            <div class="DesContent">
              {{desContent}}
            </div>
          </div>
        </v-col>
        <v-col md="1"></v-col>
        <v-col class="ImagePart" cols="12" md="7">
          <video aria-describedby="" autoplay="true" loop="" muted="" playsinline="" data-keepplaying class="IntroVideo">
            <source :data-src="require(`@/assets/${VideoName}`)" type="video/mp4" class="VideoPart"/>
          </video>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "IntroCard2",
  props: {
    VideoName: String,
    desTitle: String,
    desContent: String,
    curpage: String,
  },
  data () {
    return {
    }
  },
  methods: {
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