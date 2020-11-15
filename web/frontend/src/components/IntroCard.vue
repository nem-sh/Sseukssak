<template>
  <div class="IntWrapper">
    <v-container class="IntroBox">
      <v-row class="TheRow">
        <v-col class="ImagePart" cols="12" md="8">
          <video aria-describedby="" autoplay="true" loop="" muted="" playsinline="" data-keepplaying class="IntroVideo">
            <source :data-src="require(`@/assets/${VideoName}`)" type="video/mp4" class="VideoPart"/>
          </video>
        </v-col>
        <v-col class="VideoDescription" cols="12" md="4" v-spacer="3">
          <v-row class="DesTitle">
            {{desTitle}}
          </v-row>
          <v-spacer></v-spacer>
          <v-row class="DesContent">
            {{desContent}}
          </v-row>
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
.IntroBox {
  height: 85vh;
  width: 65vw;
}
.IntroVideo {
  width: 100%;
  height: 100%;
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
  margin-top: 10vw;
  height: 15%;
  width: 100%;
  justify-content: center;
  font-size: 5vh;
}
.DesContent {
  height: 20%;
  width: 100%;
}
</style>