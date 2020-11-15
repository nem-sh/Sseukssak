<template>
  <!-- <div>
    <form action="">

    </form>
  </div> -->
  <div>

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
  <!-- <form
  target="_blank"
  method="POST"
  enctype="application/x-www-form-urlencoded"
  action="https://postman-echo.com/post"
>
  <input type="text" name="--theKey">
  <input type="submit">
</form> -->
  </div>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { mapGetters, mapMutations, mapState } from 'vuex'
import Swal from 'sweetalert2'
import Axios from 'axios'
import FormData from 'form-data'
// import {request} from 'http'
import fetch from 'electron-fetch'

const { shell } = require("electron").remote;

@Component({

})
export default class BtnImageRename extends Vue {
    
    apiRequest() {
        const URL = 'https://dapi.kakao.com/v2/vision/multitag/generate'
        const readStream = fs.createReadStream('test.jpg')
        const form = new FormData();
        
        form.append('image',readStream)

        const headers = {
            Authorization:'KakaoAK 86fa802ad9319ae7223fcff9d2020718',
            'Content-Type':'multipart/form-data'
        }

        fetch(URL,{method: 'POST', body: form, headers: headers})
          .then(res => res.json())
          .then(json => console.log(json))


        // const req = request(
        //   {
        //   host: 'https://dapi.kakao.com',
        //   path: '/v2/vision/multitag/generate',
        //   method: 'POST',
        //   headers: headers
        //   },
        //   res => {
        //     console.log(res.statusCode)
        //   }
        // )
        // form.pipe(req)
        // Axios.post(URL, form, {headers:headers})
        //     .then(res => console.log(res)) 
        //     .catch(err => console.log(err))
    }

  
}
</script>


<style>

</style>