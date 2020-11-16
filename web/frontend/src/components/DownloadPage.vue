<template>
  <v-container class="OuterDiv">
    <video autoplay data-keepplaying muted loop id="myVideo">
      <source src="../assets/version01.mp4" type="video/mp4" />
    </video>
    <v-row class="content">
      <v-col cols="0" xs="1" sm="2" md="4"> 

      </v-col>
      <v-col cols="12" xs="10" sm="8" md="4" class="midPart">
        <v-row class="FirstRow">
          <v-row class="OneClick">
            원클릭 파일 정리
          </v-row>
          <v-row class="forD">
            for DeskTop
          </v-row>
        </v-row>
        <v-row class="SecondRow">
          <v-col cols="4" class="LogoPart">
            <img
              :src="require(`@/assets/sweeping.png`)"
              alt="No Image"
              class="LogoImage"
            />
          </v-col>
          <v-col cols="8" class="NamePart">SseukSsak</v-col>
        </v-row>
        <v-row class="ThirdRow">
          <v-col cols="6" class="DC">
            <button class="DownloadButton" @click="downloadWin()">
              <i class="fab fa-windows fa-lg"></i> for Windows
              </button>
          </v-col>
          <v-col cols="6" class="DC">
            <button class="DownloadButton" @click="downloadMac()">
              <i class="fab fa-apple fa-lg"></i> for Mac
              </button>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="0" xs="1" sm="2" md="4"> </v-col>
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
    downloadWin() {
      const link = document.createElement("a");
      link.href = "http://k3b304.p.ssafy.io/static/sseukssak_win.exe";
      link.setAttribute("download", "sseukssak_Win.exe");
      document.body.appendChild(link);
      link.click();
    },
    downloadMac() {
      const link = document.createElement("a");
      link.href = "http://k3b304.p.ssafy.io/static/sseukssak_mac.exe";
      link.setAttribute("download", "sseukssak_Mac.exe");
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
.DC {
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
  margin: 0 !important;
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
  height: 100%;
  border-radius: 50px;
  width: 100%;
  background-color: white;
  text-align: center;
  font-size: 1.8vw;
  padding-top: 0.5vh;
  color: black;
}
.OneClick {
  justify-content: center;
  height: 40%;
  width: 100%;
  font-size: 3vw;
}
.forD {
  justify-content: center;
  height: 60%;
  width: 100%;
  font-size: 1.5vw;
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
  color: #f1f1f1;
  height: 60%;
  width: 100%;
  /* padding: 20px; */
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