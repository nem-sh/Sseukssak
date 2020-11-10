<template>
    <v-container class="OuterDiv">
      <v-row class="BigRow">
        <v-col
          cols="12"
          sm="8"
        >
          <div class="wrapper">
            <div class="images">
              <div class="img-1"></div>
              <div class="img-2"></div>
            </div>
            <div class="ImgSlider">
              <div class="drag-line">
                <span></span>
              </div>
              <input type="range" min="0" max="100" :value="sliderValue" @input="ImgSliderOnInput">
            </div>
          </div>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
          <v-row class="TopRow">
            파일 정리가 귀찮다면?
          </v-row>
          <v-row class="MidRow">
            지금 Sseukssak 하세요!
          </v-row>
          <v-row class="BotRow">
            <v-btn
              class="DownloadButton"
              rounded
              elevation="5"
              @click="download()"
            >다운로드</v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import fileDownload from "js-file-download"

export default {
    data () {
        return {
          sliderValue: 95,
        }
    },
    methods: {
      ImgSliderOnInput () {
        const ImageSlider = document.querySelector(".ImgSlider input")
        const showImg = document.querySelector(".images .img-2")
        const dragLine = document.querySelector(".ImgSlider .drag-line")
        const sliderVal = ImageSlider.value;
        dragLine.style.left = sliderVal + "%";
        showImg.style.width = sliderVal + "%";
      },
        download () {
            // axios({
            //     url: this.SERVER_URL,
            //     method: "GET",
            //     responseType: "blob"
            // })
            // .then((response) =>{
            //     const url = window.URL.createObjectURL(new Blob([response.data]))
            //     const link = document.createElement('a');
            //     link.href = url;
            //     link.setAttribute("download", "File_Name")
            //     document.body.appendChild(link);
            //     link.click();
            // })
                // .catch((err) => {
                //     console.log(err.response)
                // })
            // fileDownload(myImage, "Downloaded_File.png")
            // const url = window.URL.createObjectURL(new Blob([myImage]))
            // const link = document.createElement('a');
            // link.href = url;
            // link.setAttribute("download", "File_Name.png")
            // document.body.appendChild(link);
            // link.click();
            fileDownload("hi", "Sseukssak Setup")
        },
    },
}
</script>

<style>
.OuterDiv {
  height: 100vh;
  width: 100vw;
}
.BigRow {
  height: 80%;
  width: 100%;
    
}
.wrapper{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background: #fff;
  border: 7px solid #fff;
  box-shadow: 0px 0px 15px rgba(0,0,0,0.15);
}
.wrapper .images{
  height: 100%;
  width: 100%;
  display: flex;
}
.wrapper .images .img-1{
  height: 100%;
  width: 100%;
  background: url("../assets/After.png") no-repeat;
  /* background: url("images/car.jpg") no-repeat; */
}
.wrapper .images .img-2{
  position: absolute;
  height: 100%;
  width: 98%;
  /* filter: blur(5px); */
  background: url("../assets/Before.png") no-repeat;
  /* background: url("images/car.png") no-repeat; */
}
.wrapper .ImgSlider{
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 99;
}
.wrapper .ImgSlider input{
  width: 100%;
  outline: none;
  background: none;
  -webkit-appearance: none;
}
.ImgSlider input::-webkit-slider-thumb{
  height: 80vh;
  width: 3px;
  background: none;
  -webkit-appearance: none;
  cursor: pointer;
}
.ImgSlider .drag-line{
  width: 3px;
  height: 80vh;
  position: absolute;
  left: 98%;
  pointer-events: none;
}
.ImgSlider .drag-line::before,
.ImgSlider .drag-line::after{
  position: absolute;
  content: "";
  width: 100%;
  height: 40vh;
  background: #fff;
}
.ImgSlider .drag-line::before{
  top: 0;
}
.ImgSlider .drag-line::after{
  bottom: 0;
}
.ImgSlider .drag-line span{
  height: 42px;
  width: 42px;
  border: 3px solid #fff;
  position: absolute;
  top: 47%;
  left: 10%;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.ImgSlider .drag-line span::before,
.ImgSlider .drag-line span::after{
  position: absolute;
  content: "";
  top: 50%;
  border: 10px solid transparent;
  border-bottom-width: 0px;
  border-right-width: 0px;
  transform: translate(-50%, -50%) rotate(45deg);
}
.ImgSlider .drag-line span::before{
  left: 40%;
  border-left-color: #fff;
}
.ImgSlider .drag-line span::after{
  left: 68%;
  border-top-color: #fff;
}
.TopRow {
  height: 25%;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2vw;
}
.MidRow {
  height: 25%;
  width: 100%;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 2vw;
}
.BotRow {
  height: 50%;
  width: 100%;
  justify-content: center;
  align-items: center;
}
.DownloadButton {
  height: 20% !important;
  width: 60%;
  background-color: white;
  text-align: center;
  font-size: 2vw !important;
}
</style>