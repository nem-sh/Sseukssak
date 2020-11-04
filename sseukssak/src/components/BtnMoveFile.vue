<template>
  <div style="display: inline">
    <v-btn
      class="mr-5"
      color="var(--color-purple)"
      dark
      rounded
      @click="moveFile"
    >
      정리
    </v-btn>
    <!-- <v-dialog v-model="dialog" persistent max-width="400px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="mr-5"
          color="var(--color-purple)"
          dark
          rounded
          @click="moveFile"
          v-bind="attrs"
          v-on="on"
        >
          정리
        </v-btn>
      </template>
      <v-card align="center">
        <v-card-text>
          <lottie-player
            src="https://assets7.lottiefiles.com/packages/lf20_7PhD2J.json"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px"
            loop
            autoplay
          ></lottie-player>
          <lottie-player
            src="https://assets6.lottiefiles.com/packages/lf20_AvXSwT.json"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px"
            loop
            autoplay
          ></lottie-player>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="var(--color-purple)" text @click="dialog = false">
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapState } from "vuex";

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
  computed: mapState([
    "fromDir",
    "fileList",
    "fileSortList",
    "selectedToName",
    "toLibraryList",
  ]),
})
export default class BtnMoveFile extends Vue {
  dialog: boolean = false;
  now: Date = new Date();
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
      ".pdf",
      ".ai",
      ".pad",
      ".hwp",
      ".txt",
      ".md",
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
    console.log("111", this.fileSortList);
    // this.dialog = true;
    BUS.$emit("bus:refreshfile");
    BUS.$emit("bus:dupcheck");
    BUS.$emit("bus:refreshfile");
    console.log(this.tagToDate);
    console.log(1);
    let selectedFrom: ToLibrary = { name: "", directories: [] };
    for (let index = 0; index < this.toLibraryList.length; index++) {
      if (this.toLibraryList[index].name == this.selectedToName) {
        selectedFrom = this.toLibraryList[index];
        break;
      }
    }
    if (selectedFrom.name == "") {
      return;
    }

    const directories: ToLibraryDirectory[] = selectedFrom.directories;
    directories.forEach((directory: ToLibraryDirectory) => {
      directory.path = directory.path.replace("%from%", this.fromDir);
      if (!fs.existsSync(directory.path)) {
        console.log(1);
        fs.mkdirSync(directory.path);
      }
    });
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
    console.log("222", this.fileSortList);

    for (const idx in this.fileSortList.files) {
      const a: string[][] = [];

      directories.forEach((directory: ToLibraryDirectory) => {
        directory.types.forEach((type) => {
          if (
            this.compareDate(
              new Date(this.fileSortList.files[idx].birthTime),
              directory.dateTags
            )
          ) {
            if (
              this.compareTitle(
                this.fileSortList.files[idx].name,
                directory.titleTags
              )
            ) {
              if (type == "." + this.fileSortList.files[idx].fileType) {
                if (
                  fs.existsSync(
                    directory.path + "\\" + this.fileSortList.files[idx].name
                  )
                ) {
                  alert(
                    "중복된 이름의 파일이 존재하여 자동 리네임 되었습니다."
                  );
                  a.push([
                    this.fromDir + "\\" + this.fileSortList.files[idx].name,
                    directory.path +
                      "\\" +
                      "[중복]" +
                      this.fileSortList.files[idx].name,
                  ]);
                } else {
                  a.push([
                    this.fromDir + "\\" + this.fileSortList.files[idx].name,
                    directory.path + "\\" + this.fileSortList.files[idx].name,
                  ]);
                }
                return;
              }
            }
          }
        });
      });
      console.log(a, 1);
      let step;
      if (a.length > 0) {
        for (step = 0; step < a.length - 1; step++) {
          // Runs 5 times, with values of step 0 through 4.

          fs.copyFileSync(a[step][0], a[step][1]);
        }
        fs.renameSync(a[a.length - 1][0], a[a.length - 1][1]);
      }
    }
    // this.dialog = false;
    alert("정리가 완료되었습니다.");
    BUS.$emit("bus:refreshfile");
  }
}
</script>

<style></style>
