<template>
  <div>
    <!-- <v-btn color="var(--color-purple)" dark rounded @click="btnDupCheck()">
      중복제거
    </v-btn> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
const { dialog } = require("electron").remote;
import fs from "fs";

import { mapMutations, mapState } from "vuex";

import { BUS } from "./EventBus.js";
interface ToLibrary {
  name: string;
  directories: ToLibraryDirectory[];
}
interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
  titleTags: string[];
  types: string[];
}
interface SortList {
  directories: object[];
  files: File[];
}
interface File {
  fileType: string;
  name: string;
  birthTime: number;
  updatedTime: number;
  icon: string;
}
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
  mounted() {
    // console.log("mounted at dupcheck");
    BUS.$on("bus:dupcheck", () => {
      this.DuplicateCheck();
    });
  }
  dir: string = "";
  fromDir!: string;
  files: string[] = [];
  duplicatedList!: any[][];
  fileList!: string[];
  fileSortList!: SortList;

  makedupFolder: boolean = false;

  changeDuplicatedList!: (newList: any[][]) => void;

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
  stat(filepath, q) {
    if (fs.existsSync(filepath)) {
      if (q == "j") {
        this.checkingQueuej = fs.statSync(filepath);
      } else if (q == "k") {
        this.checkingQueuek = fs.statSync(filepath);
      }
    }
  }

  btnDupCheck() {
    this.DuplicateCheck();
    BUS.$emit("bus:refreshfile");
  }
  // DuplicateCheck(fileList: string[]) {
  DuplicateCheck() {
    // console.log(this.fileList);
    const duplist = [[this.fromDir]];
    const dupchecked = Array(this.fileList.length).fill(1);
    for (let j = 0; j < this.fileList.length; j++) {
      const tmpduplist = [this.fileList[j]];
      const stats = fs.statSync(this.fromDir + "/" + this.fileList[j]);
      if (stats.size == 0) {
        dupchecked[j] == 0;
      }
      if (dupchecked[j] == 1) {
        this.stat(this.fromDir + "/" + this.fileList[j], "j");
        for (let k = j + 1; k < this.fileList.length; k++) {
          if (dupchecked[k] == 1) {
            this.stat(this.fromDir + "/" + this.fileList[k], "k");
            // 중복 검증 부분

            if (this.checkingQueuej["size"] == this.checkingQueuek["size"]) {
              if (
                this.checkingQueuej["mtimeMs"] == this.checkingQueuek["mtimeMs"]
              ) {
                // console.log(this.checkingQueuej, this.checkingQueuek)
                tmpduplist.push(this.fileList[k]);
                dupchecked[k] = 0;
              }
            }
          }
        }
      }
      if (tmpduplist.length > 1) {
        duplist.push(tmpduplist);
        this.makedupFolder = true;
      }
    }
    // console.log(duplist);

    this.MoveDupedFiles(duplist);
  }
  MoveDupedFiles(dupedfilelist: string[][]) {
    const dupedhistory: any[][] = [[]];

    if (this.makedupFolder) {
      if (!fs.existsSync(this.fromDir + "/" + "중복 파일들")) {
        // duped files 폴더 생성 부분
        fs.mkdirSync(this.fromDir + "/" + "중복 파일들");
      }
    }

    // let movedfiles = 0;
    // let alreadyexistfiles = 0;
    for (let f1 = 1; f1 < dupedfilelist.length; f1++) {
      for (let f2 = 1; f2 < dupedfilelist[f1].length; f2++) {
        // 옮기는 폴더에 같은 이름의 파일이 있는 경우는 옮기지 말아야 함.
        const d = new Date().setTime(Date.now());

        if (
          !fs.existsSync(
            this.fromDir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2]
          )
        ) {
          fs.renameSync(
            this.fromDir + "/" + dupedfilelist[f1][f2],
            this.fromDir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2]
          );
          dupedhistory.push([
            dupedfilelist[f1][f2],
            1,
            this.fromDir + "/" + dupedfilelist[f1][f2],
            this.fromDir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2],
            d,
            2,
          ]);
        } else {
          // console.log("dup fail");
          dupedhistory.push([
            dupedfilelist[f1][f2],
            0,
            this.fromDir + "/" + dupedfilelist[f1][f2],
            this.fromDir + "/" + dupedfilelist[f1][f2],
            d,
            2,
          ]);
        }
      }
    }
    this.changeDuplicatedList(dupedhistory);
  }
}
</script>
