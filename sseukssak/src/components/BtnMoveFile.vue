<template>
  <v-btn @click="moveFile"> 정리 </v-btn>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapState } from "vuex";
interface ToLibrary {
  name: string;
  directories: ToLibraryDirectory[];
}
interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
  types: string[];
}
interface SortList {
  directories: object[];
  files: File[];
}
interface File {
  fileType: string;
  file: string;
  birthTime: number;
  updatedTime: number;
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
  moveFile() {
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
      directory.types = [];
      directory.typeTags.forEach((typeTag) => {
        if (typeTag[0] == "#") {
          directory.types = directory.types.concat(this.tagToType[typeTag]);
        } else {
          directory.types = directory.types.concat(typeTag);
        }
      });
    });
    console.log(this.fileSortList.files);
    for (const idx in this.fileSortList.files) {
      const a: string[][] = [];

      directories.forEach((directory: ToLibraryDirectory) => {
        directory.types.forEach((type) => {
          if (type == "." + this.fileSortList.files[idx].fileType) {
            a.push([
              this.fromDir + "\\" + this.fileSortList.files[idx].file,
              directory.path + "\\" + this.fileSortList.files[idx].file,
            ]);
            return;
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
  }
}
</script>

<style>
</style>