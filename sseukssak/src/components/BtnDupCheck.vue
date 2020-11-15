<template>
  <div>
    <!-- <a style="display: flex; align-items: center" @click="btnDupCheck()"
      ><v-img
        class="mr-2"
        max-width="25"
        contain
        height="100%"
        src="./../assets/dup.png"
        alt="rename"
      />중복파일 제거</a
    > -->
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

const AppProps = Vue.extend({
  props: {
    propName: String || null
  }
});
@Component({
  computed: mapState(["fileSortList", "fromDir", "duplicatedList"]),
  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList"
  ])
})
export default class DupCheck extends AppProps {
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
  fileList: string[] = [];
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
      properties: ["openDirectory"]
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
    let duplist = [[""]];
    console.log(this.propName);
    let dir = "";
    if (this.propName) {
      duplist = [[this.fromDir + "/" + this.propName]];
      dir = this.fromDir + "/" + this.propName;
      this.fileList = fs.readdirSync(this.fromDir + "/" + this.propName);
    } else {
      duplist = [[this.fromDir]];
      dir = this.fromDir;
      this.fileList = fs.readdirSync(this.fromDir);
    }
    const dupchecked = Array(this.fileList.length).fill(1);
    for (let j = 0; j < this.fileList.length; j++) {
      const tmpduplist = [this.fileList[j]];
      const stats = fs.statSync(dir + "/" + this.fileList[j]);
      if (stats.size == 0) {
        dupchecked[j] == 0;
      }
      if (dupchecked[j] == 1) {
        this.stat(dir + "/" + this.fileList[j], "j");
        for (let k = j + 1; k < this.fileList.length; k++) {
          if (dupchecked[k] == 1) {
            this.stat(dir + "/" + this.fileList[k], "k");
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

    this.MoveDupedFiles(dir, duplist);
  }
  MoveDupedFiles(dir: string, dupedfilelist: string[][]) {
    const dupedhistory: any[][] = [[]];
    // console.log(dupedfilelist);

    if (this.makedupFolder) {
      if (!fs.existsSync(dir + "/" + "중복 파일들")) {
        // duped files 폴더 생성 부분
        fs.mkdirSync(dir + "/" + "중복 파일들");
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
            dir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2]
          )
        ) {
          fs.renameSync(
            dir + "/" + dupedfilelist[f1][f2],
            dir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2]
          );
          dupedhistory.push([
            dupedfilelist[f1][f2],
            1,
            dir + "/" + dupedfilelist[f1][f2],
            dir + "/" + "중복 파일들" + "/" + dupedfilelist[f1][f2],
            d,
            2
          ]);
        } else {
          // console.log("dup fail");
          dupedhistory.push([
            dupedfilelist[f1][f2],
            0,
            dir + "/" + dupedfilelist[f1][f2],
            dir + "/" + dupedfilelist[f1][f2],
            d,
            2
          ]);
        }
      }
    }
    // console.log(dupedhistory);
    this.changeDuplicatedList(dupedhistory);
  }
}
</script>
