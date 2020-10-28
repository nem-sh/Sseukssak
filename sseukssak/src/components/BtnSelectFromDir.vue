<template>
  <v-btn @click="read"> 찾기 </v-btn>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import fs from 'fs';
import { mapMutations, mapState } from 'vuex';

const { dialog } = require('electron').remote;

interface SortList {
  directories: Directory[];
  files: File[];
}
interface File {
  fileType: string;
  file: string;
  birthTime: number;
  updatedTime: number;
}
interface Directory {
  file: string;
  birthTime: number;
  updatedTime: number;
}

@Component({
  computed: mapState(['fromDir']),
  methods: mapMutations(['changeDir', 'changeFileList', 'changeFileSortList'])
})
export default class BtnSelectFromDir extends Vue {
  fromDir!: string;

  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;

  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ['openDirectory']
    });
    if (!rs) return;
    this.changeDir(rs[0]);
    const fileList = fs.readdirSync(this.fromDir);

    const fileSortList: SortList = { directories: [], files: [] };
    let fileType = '';
    fileList.forEach((file: string) => {
      const fileSplit = file.split('.');
      if (fs.lstatSync(this.fromDir + '/' + file).isDirectory()) {
        const birthTime = fs.lstatSync(this.fromDir + '/' + file).birthtimeMs;
        const updatedTime = Math.max(
          fs.lstatSync(this.fromDir + '/' + file).mtimeMs,
          fs.lstatSync(this.fromDir + '/' + file).ctimeMs
        );
        fileSortList.directories.push({
          file: file,
          birthTime: birthTime,
          updatedTime: updatedTime
        });
      } else {
        fileType = fileSplit[fileSplit.length - 1].toLowerCase();
        const birthTime = fs.lstatSync(this.fromDir + '/' + file).birthtimeMs;
        const updatedTime = Math.max(
          fs.lstatSync(this.fromDir + '/' + file).mtimeMs,
          fs.lstatSync(this.fromDir + '/' + file).ctimeMs
        );
        fileSortList.files.push({
          file: file,
          fileType: fileType,
          birthTime: birthTime,
          updatedTime: updatedTime
        });
      }
    });
    this.changeFileSortList(fileSortList);
    this.changeFileList(fileList);
  }
}
</script>

<style></style>
