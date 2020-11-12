<template>
  <div style="display: inline">
    <v-btn
      class="mr-5"
      color="var(--color-purple)"
      dark
      rounded
      @click="RestoreMoveFile"
    >
      되돌리기
    </v-btn>
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
import { mapState, mapMutations } from "vuex";
import { tagToTypeList } from "../api/tagToType";
import { BUS } from "./EventBus.js";
import {
  ToLibrary2,
  ToLibraryDirectory2,
  SortList,
  RestoreMoveListUnit,
} from "../api/interface";
// import { file } from "googleapis/build/src/apis/file";

// const { shell } = require("electron").remote;
// const { app } = require("electron").remote;
// const shellContextMenu = require("shell-context-menu").remote;

@Component({
  computed: mapState([
    "fromDir",
    "fileList",
    "fileSortList",
    "selectedToName",
    "toLibraryList",
    "moveHistory",
    "restoreMoveList",
  ]),
  methods: mapMutations([
    "changeMoveHistory",
    "changeFileSortList",
    "changeFileList",
    "changeRestoreMoveList",
  ]),
})
export default class BtnMoveFile extends Vue {
  restoreMoveList!: RestoreMoveListUnit[];
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
  tagToType: object = tagToTypeList;
  fromDir!: string;
  toLibraryList!: ToLibrary2[];
  selectedToName!: string;
  fileSortList!: SortList;
  duplicatedList!: any[][];

  changeRestoreMoveList!: (newList: RestoreMoveListUnit[]) => void;
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
    this.dialog = true;

    BUS.$emit("bus:refreshfile");
    BUS.$emit("bus:dupcheck");
    BUS.$emit("bus:refreshfile");
    console.log(123);
    let selectedFrom: ToLibraryDirectory2[] = [];
    const tempRestoreMoveList: RestoreMoveListUnit[] = [];
    for (let index = 0; index < this.toLibraryList.length; index++) {
      if (this.toLibraryList[index].name == this.selectedToName) {
        selectedFrom = this.toLibraryList[index].directories;
        break;
      }
    }
    if (selectedFrom == []) {
      return;
    }

    const directories: ToLibraryDirectory2[] = JSON.parse(
      JSON.stringify(selectedFrom)
    );

    for (let index = 0; index < directories.length; index++) {
      const element = directories[index];
      element.path = directories[index].path.replace("%from%", this.fromDir);

      if (!fs.existsSync(element.path)) {
        fs.mkdirSync(element.path);
      }
    }
    directories.forEach((directory: ToLibraryDirectory2) => {
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
      directories.forEach((directory: ToLibraryDirectory2) => {
        directory.types.forEach((type) => {
          if (this.compareDate(new Date(idx.birthTime), directory.dateTags)) {
            if (this.compareTitle(idx.name, directory.titleTags)) {
              if (type == "." + idx.fileType) {
                if (fs.existsSync(directory.path + "\\" + idx.name)) {
                  alert(
                    "중복된 이름의 파일이 존재하여 자동 리네임 되었습니다."
                  );
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
                return;
              }
            }
          }
        });
      });
      let step;
      if (a.length > 0) {
        for (step = 0; step < a.length - 1; step++) {
          try {
            fs.copyFileSync(a[step][0], a[step][1]);
            this.changeMoveHistory([
              idx.name,
              1,
              a[step][0],
              a[step][1],
              new Date().getTime(),
              1,
            ]);
            tempRestoreMoveList.push({
              type: "copy",
              from: a[step][0],
              to: a[step][1],
            });
          } catch (e) {
            console.log("error!");
          }
        }
        try {
          fs.renameSync(a[a.length - 1][0], a[a.length - 1][1]);
          this.changeMoveHistory([
            idx.name,
            1,
            a[a.length - 1][0],
            a[a.length - 1][1],
            new Date().getTime(),
            1,
          ]);
          tempRestoreMoveList.push({
            type: "move",
            from: a[step][0],
            to: a[step][1],
          });
        } catch (error) {
          console.log("error!");
        }
      }
    }
    this.changeRestoreMoveList(tempRestoreMoveList);
    // this.dialog = false;
    alert("정리가 완료되었습니다.");

    BUS.$emit("bus:refreshfile");
  }
  RestoreMoveFile() {
    for (let index = 0; index < this.restoreMoveList.length; index++) {
      const element = this.restoreMoveList[index];
      if (element["type"] == "move") {
        console.log(123);
      } else if (element["type"] == "copy") {
        console.log(123);
      }
    }
    console.log(1);
  }
}
</script>

<style></style>
