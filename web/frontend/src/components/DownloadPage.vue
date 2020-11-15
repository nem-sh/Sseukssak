<template>
  <v-container class="OuterDiv">
    <video autoplay data-keepplaying muted loop id="myVideo">
      <source src="../assets/BackGroundVideo.mp4" type="video/mp4" />
    </video>

    <!-- Optional: some overlay text to describe the video -->
    <v-row class="content">
      <v-col cols="4"> </v-col>
      <v-col cols="4" class="midPart">
        <v-row class="FirstRow">
          <span>원클릭 폴더 관리 앱</span>
          <span class="forD">for DeskTop</span>
        </v-row>
        <v-row class="SecondRow">
          <v-col cols="4" class="LogoPart">
            <img
              :src="require(`@/assets/sweeping.png`)"
              alt="No Image"
              class="LogoImage"
            />
          </v-col>
          <v-col cols="8" class="NamePart"> Sseukssak </v-col>
        </v-row>
        <v-row class="ThirdRow">
          <button class="DownloadButton" @click="download()">다운로드</button>
        </v-row>
      </v-col>
      <v-col cols="4"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "DownloadPage",
  data() {
    return {
      sliderValue: 95,
    };
  },
  methods: {
    // ImgSliderOnInput () {
    //   const ImageSlider = document.querySelector(".ImgSlider input")
    //   const showImg = document.querySelector(".images .img-2")
    //   const dragLine = document.querySelector(".ImgSlider .drag-line")
    //   const sliderVal = ImageSlider.value;
    //   dragLine.style.left = sliderVal + "%";
    //   showImg.style.width = sliderVal + "%";
    // },
    download() {
      const link = document.createElement("a");
      link.href = "http://k3b304.p.ssafy.io/static/sseukssak.exe";
      link.setAttribute("download", "sseukssak.exe");
      document.body.appendChild(link);
      link.click();
    },
  },
};
</script>

<style>
.OuterDiv {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
}
.midPart {
  height: 100%;
}
.FirstRow {
  height: 40%;
  width: 100%;
  justify-content: center;
}
.SecondRow {
  height: 40%;
  width: 100%;
  padding-top: 0 !important;
  padding-left: 0 !important;
  padding-bottom: 0 !important;
  justify-content: center;
}
.ThirdRow {
  height: 20%;
  width: 100%;
  justify-content: center;
}
.LogoPart {
  height: 100%;
  width: 100%;
  padding: 0 !important;
}
.NamePart {
  height: 100%;
  width: 100%;
  padding-left: 0 !important;
  font-size: 4vw;
}
.LogoImage {
  width: 80%;
  height: 80%;
}
.DownloadButton {
  margin: auto;
  height: 80%;
  border-radius: 50px;
  width: 50%;
  background-color: white;
  text-align: center;
  font-size: 2vw !important;
  color: black;
}
.forD {
  font-size: 1.5vw;
  padding-bottom: 3vw;
}
#myVideo {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
}
.LogoBox {
  margin: auto;
  font-size: 5vh;
  font-family: "Nanum Gothic", sans-serif !important;
  font-weight: 900;
  height: 60px;
}
.midPart {
  text-align: center;
  font-size: 6vh;
}
/* Add some content at the bottom of the video/page */
.content {
  position: fixed;
  /* bottom: 0; */
  /* background: rgba(0, 0, 0, 0.5); */
  color: #f1f1f1;
  height: 60%;
  width: 100%;
  padding: 20px;
}

/* Style the button used to pause/play the video */
#myBtn {
  width: 200px;
  font-size: 18px;
  padding: 10px;
  border: none;
  background: #000;
  color: #fff;
  cursor: pointer;
}

.DownloadButton:hover {
  background: #ddd;
  color: black;
}
</style>