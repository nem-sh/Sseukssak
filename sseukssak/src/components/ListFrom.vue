<template>
  <v-container>
    <div class="ma-5">
      <h3>
        <div @click="select = 0" style="display: inline; cursor: pointer">
          <div v-if="select == 0" style="display: inline">전체보기</div>
          <div v-if="select != 0" style="display: inline; color: #e0e0e0">
            전체보기
          </div>
        </div>
        |
        <div @click="select = 1" style="display: inline; cursor: pointer">
          <div v-if="select == 1" style="display: inline">오늘 생성된</div>
          <div v-if="select != 1" style="display: inline; color: #e0e0e0">
            오늘 생성된
          </div>
        </div>
        |
        <div @click="select = 2" style="display: inline; cursor: pointer">
          <div v-if="select == 2" style="display: inline">오늘 수정된</div>
          <div v-if="select != 2" style="display: inline; color: #e0e0e0">
            오늘 수정된
          </div>
        </div>
      </h3>
    </div>

    <h5>directories</h5>
    <v-list v-if="fromDir">
      <div>
        <v-list-item @click="enterDirectory('')">상위 폴더로</v-list-item>
      </div>
    </v-list>
    <v-list v-for="directory in fileSortList.directories" :key="directory.file">
      <div
        v-if="
          select == 0 ||
            (select == 1 && compareTime(directory.birthTime)) ||
            (select == 2 && compareTime(directory.updatedTime))
        "
      >
        <v-list-item @click="enterDirectory(directory.file)">{{
          directory
        }}</v-list-item>
      </div>
    </v-list>
    <h5>files</h5>
    <v-list v-for="file in fileSortList.files" :key="file.file">
      <div
        v-if="
          select == 0 ||
            (select == 1 && compareTime(file.birthTime)) ||
            (select == 2 && compareTime(file.updatedTime))
        "
      >
        <v-list-item @click="openFile(file.file)">{{ file }}</v-list-item>
      </div>
    </v-list>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import fs from 'fs';
import { mapMutations, mapState } from 'vuex';
import childProcess from 'child_process';
// event bus call
import { BUS } from './EventBus.js';

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
  components: {},
  computed: mapState(['fileSortList', 'fromDir']),
  methods: mapMutations(['changeDir', 'changeFileList', 'changeFileSortList'])
})
export default class ListFrom extends Vue {
  now: Date = new Date();
  select: number = 0;

  mounted() {
    // 본 함수는 기존 코드를 복붙하여 사용하였습니다.
    // 디렉토리 호출 함수를 나눠서 mounted에서 해당 함수만 호출시킬 필요가 있습니다.
    BUS.$on('bus:refreshfile', () => {
      console.log('called selectdir component function');
      const fileList = fs.readdirSync(this.fromDir);
      console.log(fileList);
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
      this.changeFileList(fileList);
      this.changeFileSortList(fileSortList);
    });
  }

  fromDir!: string;
  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  openFile(file: string) {
    // const { spawn } = require("child_process");
    childProcess.execSync('"' + this.fromDir + '\\' + file + '"');
  }
  compareTime(time: number) {
    const timeValue = new Date(time);
    if (
      timeValue.getMonth() == this.now.getMonth() &&
      timeValue.getFullYear() == this.now.getFullYear() &&
      timeValue.getDate() == this.now.getDate()
    ) {
      return true;
    }
    return false;
  }
  async enterDirectory(enteredDirectory: string) {
    let fileList: string[] = [];
    if (enteredDirectory == '') {
      const dir: string[] = this.fromDir.split('\\');
      dir.pop();
      this.changeDir(dir.join('\\'));
      fileList = fs.readdirSync(this.fromDir);
    } else {
      fileList = fs.readdirSync(this.fromDir + '\\' + enteredDirectory);
      this.changeDir(this.fromDir + '\\' + enteredDirectory);
    }

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
