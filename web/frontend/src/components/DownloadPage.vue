<template>
    <v-container class="OuterDiv">
      <v-row class="TopRow">
        <img src="../assets/myLogo.png" alt="Image Gone!!" class="LogoImage"/>
      </v-row>
      <v-row class="BottomRow">
        <v-col
          cols="12"
          sm="4"
        >
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
        <v-btn
          class="DownloadButton"
          rounded
          elevation="5"
          @click="download()"
        >다운로드</v-btn>
        </v-col>
        <v-col
          cols="12"
          sm="4"
        >
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import myLogo from "../assets/myLogo.png"
import fileDownload from "js-file-download"

export default {
    data () {
        return {
            SERVER_URL: "서버 유얼엘",
            backImage: "",

        }
    },
    methods: {
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
            fileDownload(myLogo, "myFileBabe.png")
        },
    }
}
</script>

<style>
.OuterDiv {
    height: 100vh;
    width: 100vw;
    background-color: lightblue;
}
.TopRow {
    height: 60%;
    display: flex;
    justify-content: center;
    align-content: center;
}
.BottomRow {
    height: 40%;
}
.LogoImage {
    height: 100%;
    width: 80%;
}
.DownloadButton {
    height: 30% !important;
    width: 100%;
    background-color: white;
    text-align: center;
    font-size: 40px !important;
}
</style>