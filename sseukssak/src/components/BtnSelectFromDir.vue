<template>
  <v-btn icon @click="read">
    <i class="far fa-folder-open fa-2x"></i>
  </v-btn>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs, { realpath } from "fs";
import { mapMutations, mapState } from "vuex";

const { dialog } = require("electron").remote;
import { shell } from "electron";
const { app } = require("electron").remote;
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
  computed: mapState(["fromDir"]),
  methods: mapMutations(["changeDir", "changeFileList", "changeFileSortList"]),
})
export default class BtnSelectFromDir extends Vue {
  fromDir!: string;

  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;

  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;
    this.changeDir(rs[0]);
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
  }
}
</script>

<style></style>
