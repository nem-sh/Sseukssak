<template>
  <div class="IntWrapper">
    <v-container style="height:100%">
      <v-row class="Card1Row d-flex align-center">
        <v-col class="ImagePart" cols="12" lg="7">
          <video aria-describedby="" autoplay="true" loop="" muted="" playsinline="" data-keepplaying class="IntroVideo">
            <source :data-src="require(`@/assets/${VideoName}`)" type="video/mp4" class="VideoPart"/>
          </video>
        </v-col>
        <v-col cols="0" lg="1"></v-col>
        <v-col class="VideoDescription d-flex flex-column" cols="12" lg="4">
          <div class="text-center">
            <div class="Card1Title pb-5">
              {{desTitle}}
            </div>
            <div class="Card1Content">
              {{desContent}}
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>

export default {
  name: "IntroCard",
  props: {
    VideoName: String,
    desTitle: String,
    desContent: String,
  },
  data () {
    return {
      done: false,
      prevRatio: 0,
      options: {
        root: null,
        rootMargin: null,
        threshold: null,
      },
      observer: null,
      target: null,
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
    ExecuteAnimation() {
      this.TextAnimation(".Card1Title", "Card1Title2")
      this.TextAnimation(".Card1Content", "Card1Content2")
    },
    isInView(entries, observer) {
      entries.forEach((entry) => {
        if (entry.intersectionRatio > this.prevRatio) {
          if (this.done == false) {
            this.done = true
            setTimeout(this.ExecuteAnimation(), 800)
          }
        } else {
          this.done = false
        }
      this.prevRatio = entry.intersectionRatio;
      });
    }
  },
  mounted() {
    this.options.root = null
    this.options.rootMargin = "0px"
    this.options.threshold = 0
    this.observer = new IntersectionObserver(this.isInView, this.options);
    this.target = document.querySelector('.VideoDescription');
    this.observer.observe(this.target);
  }
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
.Card1Row {
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
.Card1Title {
  font-size: 6vh;
}
.Card1Content {
  font-size: 3vh;
}
.Card1Title2{
    font-size: 6vh;
    animation: an 1s ease-out 1 both;
    display: inline-block;
}
.Card1Content2{
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