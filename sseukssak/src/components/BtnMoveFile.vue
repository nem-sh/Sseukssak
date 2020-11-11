<template>
  <div style="display: inline">
    <v-btn
      class="mr-5 play-btn mt-3"
      color="var(--color-purple)"
      dark
      rounded
      @click="moveFile"
    >
      정리
    </v-btn>
    <v-dialog v-if="!mini" v-model="dialog" persistent max-width="400px">
      <v-card align="center">
        <v-card-text>
          <lottie-player
            src="https://assets6.lottiefiles.com/packages/lf20_AvXSwT.json"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px"
            loop
            autoplay
          ></lottie-player>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog
      v-else
      v-model="dialog"
      persistent
      max-width="250px"
      max-height="150px"
    >
      <v-card align="center">
        <v-card-text>
          <lottie-player
            src="https://assets1.lottiefiles.com/datafiles/bEYvzB8QfV3EM9a/data.json"
            background="transparent"
            speed="1"
            style="width: 200px; height: 150px; padding: 0"
            loop
            autoplay
          ></lottie-player>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapState, mapMutations } from "vuex";

import { BUS } from "./EventBus.js";
import { file } from "googleapis/build/src/apis/file";
import Swal from "sweetalert2";

const { shell } = require("electron").remote;
const { app } = require("electron").remote;
// 알림창
import { remote } from "electron";
const notifier = remote.require("node-notifier");
declare const __static: string;
import path from "path";

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
  computed: mapState([
    "fromDir",
    "fileList",
    "fileSortList",
    "selectedToName",
    "toLibraryList",
    "moveHistory",
    "mini",
  ]),
  methods: mapMutations([
    "changeMoveHistory",
    "changeFileSortList",
    "changeFileList",
  ]),
})
export default class BtnMoveFile extends Vue {
  fileList!: object;
  dialog: boolean = false;
  now: Date = new Date();
  moveHistory!: any[][];
  tagToDate: object = {
    "#Today": new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate()
    ),
    "#This week": new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() - this.now.getDay()
    ),
    "#This month": new Date(this.now.getFullYear(), this.now.getMonth()),
    "#Every new file": new Date(0),
  };
  tagToType: object = {
    "#Document": [
      ".ppt",
      ".pptx",
      ".doc",
      ".docx",
      ".xls",
      ".xlsx",
      ".pdf",
      ".ai",
      ".pad",
      ".hwp",
      ".txt",
      ".md",
      ".hwpx",
      ".hwt",
      ".hwtx",
      ".frm",
      ".odt",
      ".hna",
      ".kwp",
      ".hwd",
      ".jbw",
      ".wps",
      ".xml",
      ".hml",
      ".rtf",
      ".dbf",
      ".gul",
      ".html",
      ".htm",
      ".asp",
      ".php",
      ".2b",
    ],
    "#Image": [
      ".jpg",
      ".jpeg",
      ".jpe",
      ".gif",
      ".png",
      ".bmp",
      ".rle",
      ".dib",
      ".psd",
      ".pdd",
      ".raw",
      ".dcm",
      ".dc3",
      ".dic",
      ".eps",
      ".psb",
      ".pct",
      ".pict",
      ".pxr",
      ".pbm",
      ".pgm",
      ".pnm",
      ".pfm",
      ".pam",
      ".tiff",
      ".tif",
      ".cr2",
      ".srw",
      ".nrw",
    ],
    "#Video": [
      ".avi",
      ".mpg",
      ".mpeg",
      ".mpe",
      ".wmv",
      ".asf",
      ".asx",
      ".flv",
      ".rm",
      ".mov",
      ".dat",
      ".mkv",
      ".flv",
      ".mov",
      ".mp4",
    ],
    "#Audio": [".wav", ".wma", ".mp3"],
    "#Compressed": [".zip", ".apk", ".rar", ".7z", ".tar"],
  };
  fromDir!: string;
  toLibraryList!: ToLibrary[];
  selectedToName!: string;
  fileSortList!: SortList;
  duplicatedList!: any[][];
  mini!: boolean;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  changeMoveHistory!: (newList: any[]) => void;

  compareTitle(file: string, titleTags: string[]) {
    if (titleTags.length == 0) {
      return true;
    }
    for (let index = 0; index < titleTags.length; index++) {
      const title = titleTags[index];
      if (file.includes(title) == true) {
        return true;
      }
    }
    return false;
  }
  compareDate(birthTime: Date, dateTags: string[]) {
    for (let index = 0; index < dateTags.length; index++) {
      const date = dateTags[index];
      if (date[0] == "#") {
        if (this.tagToDate[date].getTime() < birthTime.getTime()) {
          return true;
        }
      } else {
        const dateLi = date.split("~");
        if (
          new Date(
            Number(dateLi[0].slice(0, 4)),
            Number(dateLi[0].slice(0, 4)),
            Number(dateLi[0].slice(0, 4))
          ).getTime() < birthTime.getTime() &&
          new Date(
            Number(dateLi[1].slice(0, 4)),
            Number(dateLi[1].slice(0, 4)),
            Number(dateLi[1].slice(0, 4)),
            23,
            59,
            59
          ).getTime() > birthTime.getTime()
        ) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  moveFile() {
    // console.log(this.toLibraryList);
    // let timerInterval;
    // Swal.fire({
    //   title: "정리 중...",
    //   timer: 200000,
    //   willOpen: () => {
    //     Swal.showLoading();
    //     timerInterval = setInterval(() => {
    //       const content = Swal.getContent();
    //     }, 100);
    //   },
    //   onClose: () => {
    //     clearInterval(timerInterval);
    //   },
    // });

    BUS.$emit("bus:refreshfile");
    BUS.$emit("bus:dupcheck");
    BUS.$emit("bus:refreshfile");

    let selectedFrom: ToLibraryDirectory[] = [];

    // 정리 그룹 선택 안했을 시
    if (this.selectedToName === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "정리 그룹을 선택해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }

    for (let index = 0; index < this.toLibraryList.length; index++) {
      if (this.toLibraryList[index].name == this.selectedToName) {
        selectedFrom = this.toLibraryList[index].directories;
        break;
      }
    }
    if (selectedFrom == []) {
      return;
    }

    this.dialog = true;

    const directories: ToLibraryDirectory[] = JSON.parse(
      JSON.stringify(selectedFrom)
    );

    for (let index = 0; index < directories.length; index++) {
      const element = directories[index];
      directories[index].path = directories[index].path.replace(
        "%from%",
        this.fromDir
      );

      if (!fs.existsSync(directories[index].path)) {
        fs.mkdirSync(directories[index].path);
      }
    }
    directories.forEach((directory: ToLibraryDirectory) => {
      directory.types = [];
      directory.typeTags.forEach((typeTag) => {
        if (typeTag[0] == "#") {
          directory.types = directory.types.concat(this.tagToType[typeTag]);
        } else {
          directory.types = directory.types.concat(typeTag);
        }
      });
    });
    const fileSortList = this.fileSortList;

    for (const idx of fileSortList.files) {
      // console.log(fileSortList, 7, idx.name);
      const a: string[][] = [];
      if (!fs.existsSync(this.fromDir + "\\" + idx.name)) {
        this.changeMoveHistory([
          idx.name,
          1,
          this.fromDir + "\\" + idx.name,
          "파일이 존재하지 않습니다.",
          new Date().getTime(),
          1,
        ]);
        continue;
      }
      directories.forEach((directory: ToLibraryDirectory) => {
        if (this.compareDate(new Date(idx.birthTime), directory.dateTags)) {
          if (this.compareTitle(idx.name, directory.titleTags)) {
            console.log(idx.name);

            let flag = false;
            directory.types.forEach((type) => {
              if (type == "." + idx.fileType || type == idx.fileType) {
                flag = true;
                return;
              }
            });
            if (directory.types.length == 0) {
              flag = true;
            }
            if (flag) {
              if (fs.existsSync(directory.path + "\\" + idx.name)) {
                Swal.fire({
                  position: "center",
                  icon: "warning",
                  title: "중복된 이름의 파일이 존재하여 자동 리네임 되었습니다",
                  showConfirmButton: false,
                  timer: 1000,
                });
                a.push([
                  this.fromDir + "\\" + idx.name,
                  directory.path + "\\" + "[중복]" + idx.name,
                ]);
              } else {
                a.push([
                  this.fromDir + "\\" + idx.name,
                  directory.path + "\\" + idx.name,
                ]);
              }
            }
          }
        }
      });
      // console.log(a, 1);
      let step;
      if (a.length > 0) {
        for (step = 0; step < a.length - 1; step++) {
          // Runs 5 times, with values of step 0 through 4.
          this.changeMoveHistory([
            idx.name,
            1,
            a[step][0],
            a[step][1],
            new Date().getTime(),
            1,
          ]);
          fs.copyFileSync(a[step][0], a[step][1]);
        }
        this.changeMoveHistory([
          idx.name,
          1,
          a[a.length - 1][0],
          a[a.length - 1][1],
          new Date().getTime(),
          1,
        ]);
        fs.renameSync(a[a.length - 1][0], a[a.length - 1][1]);
      }
    }

    setTimeout(() => {
      this.dialog = false;
      notifier.notify({
        title: "쓱싹 알림",
        message: "정리가 완료되었습니다!",
        icon: path.join(__static, "sweeping.png"),
        sound: true,
      });
    }, 2000);
    // Swal.fire({
    //   position: "center",
    //   icon: "success",
    //   title: "정리가 완료되었습니다.",
    //   showConfirmButton: false,
    //   timer: 3000,
    // });

    BUS.$emit("bus:refreshfile");
  }

  mounted() {
    BUS.$on("bus:moveFile", () => {
      this.moveFile();
    });
  }
}
</script>

<style></style>
