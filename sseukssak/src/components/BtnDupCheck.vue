<template>
  <div></div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
const { dialog } = require('electron').remote;
import fs from 'fs';

import { mapMutations, mapState } from 'vuex';

import { BUS } from './EventBus.js';

@Component({
  computed: mapState(['fileSortList', 'fromDir', 'duplicatedList', 'fileList']),
  methods: mapMutations([
    'changeDir',
    'changeFileList',
    'changeFileSortList',
    'changeDuplicatedList'
  ])
})
export default class DupCheck extends Vue {
  mounted() {
    BUS.$on('bus:dupcheck', () => {
      this.DuplicateCheck(this.fileList);
    });
  }
  dir: string = '';
  fromDir!: string;
  files: string[] = [];
  duplicatedList!: any[][];
  fileList!: string[];

  changeDuplicatedList!: (newList: any[][]) => void;

  flag: boolean = false;
  filepath: string = '';
  extension: string = '';
  stats: string[] = [];

  checkingQueuej: object = {};
  checkingQueuek: object = {};

  read() {
    const rs = dialog.showOpenDialogSync({
      properties: ['openDirectory']
    });
    if (!rs) return;

    this.flag = true;
    // this.fromDir = rs[0]

    this.files = fs.readdirSync(this.fromDir);
    // this.fetch()
  }
  stat(filepath, q) {
    if (q == 'j') {
      this.checkingQueuej = fs.statSync(filepath);
    } else if (q == 'k') {
      this.checkingQueuek = fs.statSync(filepath);
    }
  }
  DuplicateCheck(fileList: string[]) {
    const duplist = [[this.fromDir]];
    const dupchecked = Array(fileList.length).fill(1);
    for (let j = 0; j < fileList.length; j++) {
      const tmpduplist = [fileList[j]];
      if (dupchecked[j] == 1) {
        this.stat(this.fromDir + '\\' + fileList[j], 'j');
        for (let k = j + 1; k < fileList.length; k++) {
          if (dupchecked[k] == 1) {
            this.stat(this.fromDir + '\\' + fileList[k], 'k');
            // 중복 검증 부분

            if (this.checkingQueuej['size'] == this.checkingQueuek['size']) {
              if (
                this.checkingQueuej['mtimeMs'] == this.checkingQueuek['mtimeMs']
              ) {
                // console.log(this.checkingQueuej, this.checkingQueuek)
                tmpduplist.push(fileList[k]);
                dupchecked[k] = 0;
              }
            }
          }
        }
      }
      if (tmpduplist.length > 1) {
        duplist.push(tmpduplist);
      }
    }
    console.log(duplist);

    this.MoveDupedFiles(duplist);
  }
  MoveDupedFiles(dupedfilelist: string[][]) {
    const dupedhistory: any[][] = [[]];
    if (!fs.existsSync(this.fromDir + '\\' + 'duplicated files')) {
      // duped files 폴더 생성 부분
      fs.mkdirSync(this.fromDir + '\\' + 'duplicated files');
    }
    // let movedfiles = 0;
    // let alreadyexistfiles = 0;
    for (let f1 = 1; f1 < dupedfilelist.length; f1++) {
      for (let f2 = 1; f2 < dupedfilelist[f1].length; f2++) {
        // 옮기는 폴더에 같은 이름의 파일이 있는 경우는 옮기지 말아야 함.
        const d = new Date(Date.now());

        if (
          !fs.existsSync(
            this.fromDir +
              '\\' +
              'duplicated files' +
              '\\' +
              dupedfilelist[f1][f2]
          )
        ) {
          fs.renameSync(
            this.fromDir + '\\' + dupedfilelist[f1][f2],
            this.fromDir +
              '\\' +
              'duplicated files' +
              '\\' +
              dupedfilelist[f1][f2]
          );
          dupedhistory.push([
            dupedfilelist[f1][f2],
            1,
            this.fromDir + '\\' + dupedfilelist[f1][f2],
            this.fromDir +
              '\\' +
              'duplicated files' +
              '\\' +
              dupedfilelist[f1][f2],
            d,
            2
          ]);
        } else {
          dupedhistory.push([
            dupedfilelist[f1][f2],
            0,
            this.fromDir + '\\' + dupedfilelist[f1][f2],
            this.fromDir + '\\' + dupedfilelist[f1][f2],
            d,
            2
          ]);
        }
      }
    }
    this.changeDuplicatedList(dupedhistory);
  }
}
</script>
