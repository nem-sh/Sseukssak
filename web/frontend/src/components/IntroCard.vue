<template>
  <div class="IntWrapper">
    <v-container style="height:100%">
      <v-row class="TheRow d-flex align-center">
        <v-col class="ImagePart" cols="12" md="7">
          <video aria-describedby="" autoplay="true" loop="" muted="" playsinline="" data-keepplaying class="IntroVideo">
            <source :data-src="require(`@/assets/${VideoName}`)" type="video/mp4" class="VideoPart"/>
          </video>
        </v-col>
        <v-col md="1"></v-col>
        <v-col class="VideoDescription d-flex flex-column" cols="12" md="4">
          <div class="text-center">
            <div class="DesTitle pb-5">
              {{desTitle}}
            </div>
            <v-spacer></v-spacer>
            <div class="DesContent">
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
    }
  },
  methods: {
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
</style>