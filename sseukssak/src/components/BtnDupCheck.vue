<template>
  <div>
    <v-btn icon @click="DuplicateCheck(fileList)">
      <v-icon>mdi-shopping-search</v-icon>
      중복파일체크
    </v-btn>
  </div>
</template>
<script lang="ts">
// import { dir } from 'console'
// import * as func from './js'

// const { shell } = require('electron')
import Vue from "vue";
import Component from "vue-class-component";

// import { mapState, mapMutations } from 'vuex'
const { dialog } = require("electron").remote;
import fs from "fs";
// const path = require('path')
// const byte = require('bytes')
// const Datastore = require('nedb-promises')
// const DBFile = Datastore.create('dbFiles.db')
import { mapMutations, mapState } from "vuex";
// import BtnSelectFromDir from './BtnSelectFromDir.vue'
import { BUS } from "./EventBus.js";

@Component({
  computed: mapState(["fileSortList", "fromDir", "duplicatedList", "fileList"]),
  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
  ]),
})
export default class DupCheck extends Vue {
  dir: string = "";
  fromDir!: string;
  files: string[] = [];
  duplicatedList!: string[][];
  fileList!: string[];

  changeDuplicatedList!: (newList: string[][]) => void;

  flag: boolean = false;
  filepath: string = "";
  extension: string = "";
  stats: string[] = [];

  checkingQueuej: object = {};
  checkingQueuek: object = {};

  read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;

    this.flag = true;
    // this.fromDir = rs[0]

    this.files = fs.readdirSync(this.fromDir);
    // this.fetch()
  }

  selectfile(item) {
    let extIdx = -999;
    for (let i = 0; i < item.length; i++) {
      if (item[i] == "." && i >= extIdx) {
        extIdx = i;
      }
    }
    if (extIdx == -999) {
      this["extension"] = "folder";
    } else {
      this["extension"] = item.substr(extIdx, item.length);
    }
    // console.log(this.extension)
    this["filepath"] = this.fromDir + "\\" + item;
  }
  stat(filepath, q) {
    if (q == "j") {
      this.checkingQueuej = fs.statSync(filepath);
    } else if (q == "k") {
      this.checkingQueuek = fs.statSync(filepath);
    }
  }
  DuplicateCheck(fileList: string[]) {
    const duplist = [[this.fromDir]];
    const dupchecked = Array(fileList.length).fill(1);
    for (let j = 0; j < fileList.length; j++) {
      const tmpduplist = [fileList[j]];
      if (dupchecked[j] == 1) {
        this.stat(this.fromDir + "\\" + fileList[j], "j");
        for (let k = j + 1; k < fileList.length; k++) {
          if (dupchecked[k] == 1) {
            this.stat(this.fromDir + "\\" + fileList[k], "k");
            // 중복 검증 부분

            if (this.checkingQueuej["size"] == this.checkingQueuek["size"]) {
              if (
                this.checkingQueuej["mtimeMs"] == this.checkingQueuek["mtimeMs"]
              ) {
                // console.log(this.checkingQueuej, this.checkingQueuek)
                tmpduplist.push(fileList[k]);
                dupchecked[k] = 0;
              }
            }
          }
        }
      }
      if (tmpduplist.length > 1) {
        duplist.push(tmpduplist);
      }
    }
    console.log(duplist);

    this.changeDuplicatedList(duplist);
    this.MoveDupedFiles(duplist);
  }
  MoveDupedFiles(dupedfilelist: string[][]) {
    if (!fs.existsSync(this.fromDir + "\\" + "duplicated files")) {
      // duped files 폴더 생성 부분
      fs.mkdirSync(this.fromDir + "\\" + "duplicated files");
    }
    let movedfiles = 0;
    let alreadyexistfiles = 0;
    for (let f1 = 1; f1 < dupedfilelist.length; f1++) {
      for (let f2 = 1; f2 < dupedfilelist[f1].length; f2++) {
        // 옮기는 폴더에 같은 이름의 파일이 있는 경우는 옮기지 말아야 함.
        if (
          !fs.existsSync(
            this.fromDir +
              "\\" +
              "duplicated files" +
              "\\" +
              dupedfilelist[f1][f2]
          )
        ) {
          fs.renameSync(
            this.fromDir + "\\" + dupedfilelist[f1][f2],
            this.fromDir +
              "\\" +
              "duplicated files" +
              "\\" +
              dupedfilelist[f1][f2]
          );
          movedfiles += 1;
        } else {
          alreadyexistfiles += 1;
        }
      }
    }
    // 결과창 출력문
    if (movedfiles == 0 && alreadyexistfiles == 0) {
      alert("중복된 파일이 없습니다.");
    } else if (movedfiles != 0) {
      alert(
        movedfiles +
          "개의 복제된 파일을 duplicated files 폴더로 이동시켰습니다."
      );
    }
    // 두 문장의 출력문의 조건을 손봐야 함
    if (alreadyexistfiles != 0) {
      alert(
        alreadyexistfiles +
          "개의 파일이 duplicated files 폴더에 같은 이름이 존재하여, 이동을 실패하였습니다."
      );
    }
    // 옮긴 디렉토리를 리로드하는 작업이 필요함.
    // this.files = fs.readdirSync(this.fromDir)
    BUS.$emit("bus:refreshfile");
  }
}
</script>
