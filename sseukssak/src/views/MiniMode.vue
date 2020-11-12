<template>
  <v-container class="mini-mode position-p">
    <div class="position-c d-flex">
      <lottie-player src="https://assets3.lottiefiles.com/packages/lf20_h59xofz0.json"  background="transparent"  speed="1"  style="width: 250px; height: 200px;"  loop  autoplay></lottie-player>
      <div class="my-auto">
        <BtnMoveFile/>
      </div>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="250px"
        max-height="120px"
      >
      <v-card align="center">
        <v-card-text>
          <lottie-player
            class="pt-3"
            src="https://assets1.lottiefiles.com/datafiles/bEYvzB8QfV3EM9a/data.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 80px;"
            loop
            autoplay
          ></lottie-player>
        </v-card-text>
      </v-card>
    </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

import { BUS } from "../components/EventBus.js";

import BtnMoveFile from "@/components/BtnMoveFile.vue";

@Component({
  components: {
    BtnMoveFile
  },
})

export default class MiniMode extends Vue {
  dialog: boolean = false;

  mounted() {
    BUS.$on("bus:miniLoading", () => {
      this.dialog = true;
    });

    BUS.$on("bus:miniLoadingEnd", () => {
      this.dialog = false;
    });
  }
}
</script>
<style>
.mini-mode {
  padding-top: 28px;
  /* background-color: var(--color-purple); */
  width: 100%;
  height: 100%;
}

.play-btn {
  /* width: 70px; */
  /* height: 70px; */
  /* background: radial-gradient( var(--color-purple), 60%, rgba(255, 255, 255, 1) 62%); */
  /* border-radius: 50%; */
  position: relative;
  display: block;
  font-weight: bold;
  box-shadow: 0px 0px 25px 3px var(--color-purple);
}

/* triangle */
.play-btn::after {
  /* content: "정리"; */
  color: white;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translateX(-50%) translateY(-50%);
}

/* pulse wave */
.play-btn:before {
  content: "";
  position: absolute;
  width: 150%;
  height: 150%;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  -webkit-animation: pulsate1 2s;
  animation: pulsate1 2s;
  -webkit-animation-direction: forwards;
  animation-direction: forwards;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-timing-function: steps;
  animation-timing-function: steps;
  opacity: 1;
  border-radius: 28px;
  border: 5px solid rgba(255, 255, 255, .75);
  top: -25%;
  left: -25%;
  background: rgba(198, 16, 0, 0);
}

@-webkit-keyframes pulsate1 {
  0% {
    -webkit-transform: scale(0.6);
    transform: scale(0.6);
    opacity: 1;
    box-shadow: inset 0px 0px 25px 3px rgba(255, 255, 255, 0.75), 0px 0px 25px 10px rgba(255, 255, 255, 0.75);
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
    box-shadow: none;

  }
}

@keyframes pulsate1 {
  0% {
    -webkit-transform: scale(0.6);
    transform: scale(0.6);
    opacity: 1;
    box-shadow: inset 0px 0px 25px 3px rgba(255, 255, 255, 0.75), 0px 0px 25px 10px rgba(255, 255, 255, 0.75);
  }
  100% {
    -webkit-transform: scale(1, 1);
    transform: scale(1);
    opacity: 0;
    box-shadow: none;

  }
}
</style>