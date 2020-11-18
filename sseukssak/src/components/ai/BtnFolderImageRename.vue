<template>
  <a @click="rename(folderName)" style="display: flex; align-items: center">
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

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import Swal from "sweetalert2";
import Axios from "axios";
import { BUS } from "../EventBus.js";
const { shell } = require("electron").remote;

const BtnFolderImageRenameProps = Vue.extend({
  props: {
    folderName: String,
  }
});

@Component({
  computed: mapState(["fromDir"]),
  methods: mapMutations(["changeRenameHistory2"])
})
export default class BtnFolderImageRename extends BtnFolderImageRenameProps {
  fromDir!: string;
  changeRenameHistory2!: (newHistory: any[]) => void;

  sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  async apiRequest(fileName, folderName) {
    await this.sleep(500)
    const URL = "https://dapi.kakao.com/v2/vision/multitag/generate";
    const file = new File(
      [fs.readFileSync(this.fromDir + "/" + folderName+ '/' + fileName)],
      fileName
    );
    console.log(file)
    if (file.size > 2000000) {
      return Swal.fire({
        icon: "error",
        title: " 이미지 크기가 너무 큽니다!"
      });
    }
    const form = new FormData();
    form.append("image", file);

    const headers = {
      Authorization: "KakaoAK 86fa802ad9319ae7223fcff9d2020718",
      "Content-Type": "multipart/form-data"
    };

    Axios.post(URL, form, { headers: headers })
      .then((res) => {
        console.log(res);
        if (res.data.result.label_kr.length === 0) {
          return Swal.fire({
            icon: "info",
            title: "이미지 분석 결과가 없습니다."
          });
        }
        const ext = fileName.includes("jpg") ? ".jpg" : ".png";
        let newFileName = res.data.result.label_kr
          .join("_")
          .replace("/", "_");
        const time = new Date().setTime(Date.now());
        let dupNum = 1
        const originName = newFileName
        while (fs.existsSync(this.fromDir + "/" + folderName+ '/' +  newFileName + ext)) {
            newFileName = originName+dupNum
            dupNum ++;
        }
        
          fs.renameSync(
            this.fromDir + "/" + folderName+ '/' + fileName,
            this.fromDir + "/" + folderName+ '/' + newFileName + ext
          )
        

          BUS.$emit("bus:refreshfile");
          Swal.fire({
            icon: "success",
            title: "이미지 파일 이름이 성공적으로 변경되었습니다!"
          });
          this.changeRenameHistory2([]);
          this.changeRenameHistory2([
            fileName + " => " + newFileName + ext,
            1,
            this.fromDir + "/" + folderName+ '/' + fileName,
            this.fromDir + "/" + folderName+ '/' + newFileName + ext,
            time,
            3
          ]);
        
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "이미지 분석 요청에 실패했습니다."
        })
      );
  }

  rename(folderName){
    const files=fs.readdirSync(this.fromDir+'/'+folderName)
    const imageFiles = files.filter(fileName => 
        fileName.includes('.png') || 
        fileName.includes('.jpg') ||
        fileName.includes('.PNG') || 
        fileName.includes('.JPG')
        )
    if (imageFiles.length===0){
        return Swal.fire({
        icon: "error",
        title: "폴더 내에 이미지 파일이 없습니다!"
      });
    }
    imageFiles.forEach(fileName=>{        
        this.apiRequest(fileName,folderName)
    })
  }
}
</script>

<style></style>
