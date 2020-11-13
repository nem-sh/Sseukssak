<template>
  <v-btn icon large @click="read(true)">
    <i class="far fa-folder-open fa-2x" style="color:var(--color-purple)"></i>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs, { realpath } from "fs";
import { mapMutations, mapState } from "vuex";
import { BUS } from "./EventBus.js";
const { dialog } = require("electron").remote;
import { shell } from "electron";
const { app } = require("electron").remote;

import Swal from "sweetalert2";
const homeDir = require("os").homedir();
const desktopDir = `${homeDir}\\Desktop`;

interface SortList {
  directories: Directory[];
  files: File[];
}
interface File {
  fileType: string;
  name: string;
  birthTime: number;
  updatedTime: number;
  icon: string;
}
interface Directory {
  name: string;
  birthTime: number;
  updatedTime: number;
}

@Component({
  computed: mapState(["fromDir", "firstOpen"]),
  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeFirstOpenValue",
  ]),
})
export default class BtnSelectFromDir extends Vue {
  fromDir!: string;
  firstOpen!: boolean;

  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  changeFirstOpenValue!: () => void;

  async read(open) {
    this.changeFirstOpenValue();
    if (open) {
      const rs = dialog.showOpenDialogSync({
        properties: ["openDirectory"],
      });
      if (!rs) return;
      this.changeDir(rs[0]);
    } else {
      this.changeDir(desktopDir);
    }
    try {
      const fileList = fs.readdirSync(this.fromDir);

      const fileSortList: SortList = { directories: [], files: [] };
      fileList.forEach((name: string) => {
        const fileSplit = name.split(".");
        if (fs.lstatSync(this.fromDir + "/" + name).isDirectory()) {
          const birthTime = fs.lstatSync(this.fromDir + "/" + name).birthtimeMs;
          const updatedTime = Math.max(
            fs.lstatSync(this.fromDir + "/" + name).mtimeMs,
            fs.lstatSync(this.fromDir + "/" + name).ctimeMs
          );
          fileSortList.directories.push({
            name: name,
            birthTime: birthTime,
            updatedTime: updatedTime,
          });
        } else {
          const fileType = fileSplit[fileSplit.length - 1].toLowerCase();
          const birthTime = fs.lstatSync(this.fromDir + "/" + name).birthtimeMs;
          const updatedTime = Math.max(
            fs.lstatSync(this.fromDir + "/" + name).mtimeMs,
            fs.lstatSync(this.fromDir + "/" + name).ctimeMs
          );
          let iconPath = this.fromDir + "/" + name;
          if (name.includes(".lnk")) {
            try {
              iconPath = shell.readShortcutLink(iconPath).target;
            } catch {
              iconPath = this.fromDir + "/" + name;
            }
          }
          let realIcon = "";
          app.getFileIcon(iconPath).then((fileIcon) => {
            realIcon = fileIcon.toDataURL();
            fileSortList.files.push({
              name: name,
              fileType: fileType,
              birthTime: birthTime,
              updatedTime: updatedTime,
              icon: realIcon,
            });
          });
        }
      });
      this.changeFileSortList(fileSortList);
      this.changeFileList(fileList);
    } catch (error) {
      this.changeDir(desktopDir);
      Swal.fire({
        position: "center",
        icon: "warning",
        title: `해당 경로는 권한이 없습니다.`,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }
  mounted() {
    if (this.firstOpen) {
      this.read(false);
    }
  }
}
</script>

<style></style>
