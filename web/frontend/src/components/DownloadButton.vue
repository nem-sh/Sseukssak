<template>
  <button @click="download">
      다운로드
  </button>
</template>

<script>
// import axios from "axios";
import fileDownload from "js-file-download"
import myImage from "../assets/logo.png"

export default {
    data () {
        return {
            SERVER_URL: "서버 유얼엘"
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
            fileDownload(myImage, "myFileBabe.png")
        },
    }
}
</script>

<style>

</style>