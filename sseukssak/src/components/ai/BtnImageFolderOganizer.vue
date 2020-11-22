<template>
  <div>
    <a @click="rename(folderName)" style="display: flex; align-items: center">
      <v-img
        class="mr-2"
        max-width="25"
        contain
        height="100%"
        src="./../../assets/ai.png"
        alt="AI"
      />이미지 폴더 자동 정리
    </a>
    <v-dialog v-model="dialog" scrollable max-width="380px">
      <v-card>
        <v-card-title>생성할 이미지 폴더를 선택해주세요</v-card-title>
        <v-divider></v-divider>

        <v-card-text style="height: 300px">
          <v-checkbox
            v-for="labelName in labelNameList"
            :key="labelName"
            v-model="selectedLabel"
            :label="labelName"
            :value="labelName"
          ></v-checkbox>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="red darken-1"
            text
            @click="
              dialog = false;
              labels = {};
              labelNameList = [];
              selectedLabel = [];
            "
          >
            취소
          </v-btn>
          <v-btn color="green darken-1" text @click="move()"> 완료 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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

const BtnImageFolderOganizerProps = Vue.extend({
  props: {
    folderName: String,
  },
});

@Component({
  computed: mapState(["fromDir"]),
  methods: mapMutations(["changeRenameHistory2"]),
})
export default class BtnImageFolderOganizer extends BtnImageFolderOganizerProps {
  labels: object = {};
  labelNameList: string[] = [];
  selectedLabel: string[] = [];
  fromDir!: string;
  dialog: boolean = false;
  changeRenameHistory2!: (newHistory: any[]) => void;

  oldImages = new Set();

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async apiRequest(fileName, folderName) {
    await this.sleep(500);
    const URL = "https://dapi.kakao.com/v2/vision/multitag/generate";
    const file = new File(
      [fs.readFileSync(this.fromDir + "/" + folderName + "/" + fileName)],
      fileName
    );
    console.log(file);
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
        if (res.data.result.label_kr.length === 0) {
          return;
        }
        const label = res.data.result.label_kr;
        for (let index = 0; index < label.length; index++) {
          const element = label[index];
          if (!this.labels[element]) {
            this.labelNameList.push(element);
            this.labels[element] = [fileName];
          } else {
            this.labels[element].push(fileName);
          }
        }

        // for (let i = 0; i < label.length; i++) {
        //   if (
        //     !fs.existsSync(this.fromDir + "/" + folderName + "/" + label[i])
        //   ) {
        //     fs.mkdirSync(this.fromDir + "/" + folderName + "/" + label[i]);
        //   }
        //   fs.copyFileSync(
        //     this.fromDir + "/" + folderName + "/" + fileName,
        //     this.fromDir + "/" + folderName + "/" + label[i] + "/" + fileName
        //   );
        //   this.oldImages.add(this.fromDir + "/" + folderName + "/" + fileName);
        // }
      })
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "이미지 분석 요청에 실패했습니다.",
        })
      );
  }
  async move() {
    for (let i = 0; i < this.selectedLabel.length; i++) {
      if (
        !fs.existsSync(
          this.fromDir + "/" + this.folderName + "/" + this.selectedLabel[i]
        )
      ) {
        fs.mkdirSync(
          this.fromDir + "/" + this.folderName + "/" + this.selectedLabel[i]
        );
      }

      for (
        let index = 0;
        index < this.labels[this.selectedLabel[i]].length;
        index++
      ) {
        const element = this.labels[this.selectedLabel[i]][index];

        fs.copyFileSync(
          this.fromDir + "/" + this.folderName + "/" + element,
          this.fromDir +
            "/" +
            this.folderName +
            "/" +
            this.selectedLabel[i] +
            "/" +
            element
        );
        this.oldImages.add(
          this.fromDir + "/" + this.folderName + "/" + element
        );
      }
    }
    await this.sleep(500);
    this.oldImages.forEach((fileName: any) => {
      fs.unlinkSync(fileName);
    });
    BUS.$emit("bus:refreshfile");
    this.oldImages = new Set();
    this.labels = {};
    this.labelNameList = [];
    this.selectedLabel = [];
    Swal.fire({
      icon: "success",
      title: "폴더 정리가 완료되었습니다.",
    });
    this.dialog = false;
  }
  async rename(folderName) {
    const curDir = this.fromDir + "/" + folderName;
    const files = fs.readdirSync(curDir);
    const imageFiles = files.filter(
      (fileName) =>
        fileName.includes(".png") ||
        fileName.includes(".jpg") ||
        fileName.includes(".PNG") ||
        fileName.includes(".JPG")
    );
    if (imageFiles.length === 0) {
      return Swal.fire({
        icon: "error",
        title: "폴더 내에 이미지 파일이 없습니다!",
      });
    }
    for (let i = 0; i < imageFiles.length; i++) {
      await this.apiRequest(imageFiles[i], folderName);
    }
    this.selectedLabel = this.labelNameList;
    this.dialog = true;
  }
}
</script>

<style></style>
