<template>
  <a @click="apiRequest" style="display: flex; align-items: center">
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
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import Swal from "sweetalert2";
import Axios from "axios";
import { BUS } from "../EventBus.js";
const { shell } = require("electron").remote;

const BtnImageRenameProps = Vue.extend({
  props: {
    fileName: String,
  },
});

@Component({
  computed: mapState(["fromDir"]),
  methods: mapMutations([
    "changeRenameHistory2"
  ]),
})
export default class BtnImageRename extends BtnImageRenameProps {
  fromDir!: string;
  changeRenameHistory2!: (newHistory: any[]) => void

  apiRequest() {
    const URL = "https://dapi.kakao.com/v2/vision/multitag/generate";
    const file = new File(
      [fs.readFileSync(this.fromDir + "/" + this.fileName)],
      this.fileName
    );
    if (file.size > 2000000) {
      return Swal.fire({
        icon: "error",
        title: " 이미지 크기가 너무 큽니다!",
      });
    }
    const form = new FormData();
    form.append("image", file);

    const headers = {
      Authorization: "KakaoAK 86fa802ad9319ae7223fcff9d2020718",
      "Content-Type": "multipart/form-data",
    };

    Axios.post(URL, form, { headers: headers })
      .then((res) => {
        console.log(res);
        if (res.data.result.label_kr.length === 0) {
          return Swal.fire({
            icon: "info",
            title: "이미지 분석 결과가 없습니다.",
          });
        }
        const ext = this.fileName.includes("jpg") ? ".jpg" : ".png";
        const newFileName = res.data.result.label_kr
          .join("_")
          .replace("/", "_");
        const time = new Date().setTime(Date.now())

        if (fs.existsSync(this.fromDir + "/" + newFileName + ext)) {
          Swal.fire({
            icon: "error",
            title: "변경하려는 파일 이름과 중복되는 이름이 이미 존재합니다.",
          });
        } else {
          fs.renameSync(
            this.fromDir + "/" + this.fileName,
            this.fromDir + "/" + newFileName + ext
          );

          BUS.$emit("bus:refreshfile");
          Swal.fire({
            icon: "success",
            title: "이미지 파일 이름이 성공적으로 변경되었습니다!",
          });
          this.changeRenameHistory2([
            this.fileName + " => " + newFileName+ext,
            1,
            this.fromDir+'\\'+this.fileName,
            this.fromDir+'\\'+newFileName+ext,
            time,
            3,
          ])
          console.log('chk')
        }
      })
      .catch((err) =>
        Swal.fire({
          icon: "error",
          title: "이미지 분석 요청에 실패했습니다.",
        })
      );
  }
}
</script>


<style>
</style>