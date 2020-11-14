<template>
  <a
    @click="apiRequest"
    style="display: flex; align-items: center"
  >
    <v-img
        class="mr-2"
        max-width="25"
        contain
        height="100%"
        src="./../../assets/ai.png"
        alt="AI"
    />이미지 이름 자동 변경
  </a>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { mapGetters, mapMutations, mapState } from 'vuex'
import Swal from 'sweetalert2'
import Axios from 'axios'


const { shell } = require("electron").remote;

@Component({

})
export default class BtnImageRename extends Vue {
    
    apiRequest() {
        const URL = 'https://dapi.kakao.com/v2/vision/multitag/generate'
        const formData = new FormData();
        formData.append('image',fs.readFileSync('test.jpg').toString())
        const data = {
            'image':fs.readFileSync('test.jpg')
        }
        const headers = {
            Authorization:'KakaoAK 86fa802ad9319ae7223fcff9d2020718',
            'Content-Type':'multipart/form-data'
        }
        console.log(data)
        Axios.post(URL, formData, {headers:headers})
            .then(res => console.log(res)) 
            .catch(err => console.log(err))
    }

  
}
</script>


<style>

</style>