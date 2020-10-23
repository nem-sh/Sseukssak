<template>
  <v-btn @click="read"> 찾기 </v-btn>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
const { dialog } = require("electron").remote;

interface FromSortList {
  folder: string[];
  file: object[];
}

@Component({
  computed: mapState(["fromDir"]),
  methods: mapMutations(["changeDir", "changeFileList", "changeFileSortList"]),
})
export default class BtnSelectFromDir extends Vue {
  fromDir!: string;

  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: FromSortList) => void;
  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;
    this.changeDir(rs[0]);
    const fileList = fs.readdirSync(this.fromDir);

    const fileSortList: FromSortList = { folder: [], file: [] };
    let fileType = "";
    fileList.forEach((file: string) => {
      const fileSplit = file.split(".");
      if (fs.lstatSync(this.fromDir + "/" + file).isDirectory()) {
        fileSortList.folder.push(file);
      } else {
        fileType = fileSplit[fileSplit.length - 1].toLowerCase();
        fileSortList.file.push({ file: file, fileType: fileType });
      }
    });
    this.changeFileSortList(fileSortList);
    this.changeFileList(fileList);
  }
}
</script>

<style>
</style>