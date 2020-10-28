<template>
  <v-container>
    <h1 class="my-5 text-center">통일한 파일명 변경</h1>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="12">
        <h4 class="text-center">2. 변경할 형식 정하기</h4>
      </v-col>
      <v-col cols="4">
        <span class="font-weight-bold">파일명 앞</span>
        <v-radio-group v-model="filterFront" @change="change">
          <v-radio label="생성 날짜" value="1"></v-radio>
          <v-radio label="사용자 지정" value="2"></v-radio>
          <v-text-field
            v-show="filterFront == '2'"
            v-model="changeFileName1"
            @input="change"
            :rules="nameRules"
            :counter="10"
            label="파일명 앞에 추가할 문자"
            required
          ></v-text-field>
          <v-radio label="없음" value="3"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col cols="4">
        <span class="font-weight-bold">파일명</span>
        <v-radio-group v-model="filterMiddle" @change="change">
          <v-radio label="기존 파일명" value="1"></v-radio>
          <v-radio label="사용자 지정" value="2"></v-radio>
          <v-text-field
            v-show="filterMiddle == '2'"
            v-model="changeFileName2"
            @input="change"
            :rules="nameRules"
            :counter="20"
            label="사용자 지정 파일명"
            required
          ></v-text-field>
        </v-radio-group>
      </v-col>
      <v-col cols="4">
        <span class="font-weight-bold">파일명 뒤</span>
        <v-radio-group v-model="filterBack" @change="change">
          <v-radio label="숫자(수정 날짜 오름차순)" value="1"></v-radio>
          <v-radio label="사용자 지정" value="2" :disabled="isDisabled"></v-radio>
          <v-text-field
            v-show="filterBack == '2'"
            v-model="changeFileName3"
            @input="change"
            :rules="nameRules"
            :counter="10"
            label="파일명 뒤에 추가할 문자"
            required
          ></v-text-field>
          <v-radio label="없음" value="3" :disabled="isDisabled"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-row>
      <v-col cols="4">
        <div>
          <h4 class="text-center">1. 변경할 파일들 선택</h4>
        </div>
        <div class="text-right mr-10 mb-2">
          <v-btn icon @click="read()">
            <p>폴더 열기</p>
          </v-btn>
        </div>
        <p class="text-center" v-show="fileList.length <= 0">
          폴더를 선택해주세요 :)
        </p>
        <v-checkbox
          @change="sortBeforeItems"
          v-model="beforeItems"
          v-for="file in fileList"
          :key="file.name"
          :label="file.name"
          :value="file"
        ></v-checkbox>
      </v-col>
      <v-col cols="8">
        <div>
          <h4 class="text-center">3. 확인 후 rename</h4>
          <div class="text-right mb-2">
            <v-btn color="error" @click="rename">
              Rename
            </v-btn>
          </div>
        </div>
        <v-row>
          <v-col cols="6">
            <p>기존 파일명(마지막 수정 날짜 오래된 순)</p>
            <v-divider></v-divider>
            <v-list-item v-for="(item, i) in beforeItems" :key="i">
              <v-list-item-content>
                {{ i + 1 }}. {{ item.name }}
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-col cols="6">
            <p>바뀔 파일명</p>
            <v-divider></v-divider>
            <v-list-item v-for="(item, i) in afterItems" :key="i">
              <v-list-item-content>
                {{ i + 1 }}. {{ item.name }}
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import fs from "fs";
import path from "path";
const { dialog } = require("electron").remote;

interface FileInfo {
  name: string;
  path: string;
  time: Date;
}

@Component({})
export default class Rename extends Vue {
  dialog: boolean = false;
  changeFileName1: string = "";
  changeFileName2: string = "";
  changeFileName3: string = "";
  nameRules: object = [
    (v) => !!v || "It is required",
    (v) => v.length <= 20 || "It must be less than 20 characters",
  ];
  fileList: Array<FileInfo> = [];
  beforeItems: Array<FileInfo> = [];
  afterItems: Array<FileInfo> = [];
  dir: string = "";
  filterFront: string = "3";
  filterMiddle: string = "1";
  filterBack: string = "3";

  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;
    this.dir = rs[0];
    const files = fs.readdirSync(this.dir);
    if (!files.length) return;
    this.fileList = [];
    this.beforeItems = [];
    this.afterItems = [];
    for (const v of files) {
      const p = path.join(this.dir, v);
      const stat = fs.statSync(p);
      const item = {
        name: v,
        path: p,
        time: stat.mtime,
      };
      await this.fileList.push(item);
    }
  }

  change() {
    this.afterItems = [];
    this.beforeItems.forEach((item, i) => {
      // 확장자
      const _lastDot = item.name.lastIndexOf(".");
      const _fileType = item.name.substring(_lastDot, item.name.length);
      // 이름 변경
      const tmp = Object.assign({}, item, {
        name: this.front(item) + this.middle(item) + this.back(item, i+1) + _fileType,
      });
      this.afterItems.push(tmp);
    });
  }

  rename() {
    if ((this.filterFront == "2" && !this.changeFileName1) || (this.filterMiddle == "2" && !this.changeFileName2) || (this.filterBack == "2" && !this.changeFileName3)) {
      alert("빈칸을 작성해주세요");
    } else if (this.changeFileName1.length > 10 || this.changeFileName2.length > 20 || this.changeFileName3.length > 10) {
      alert("지정된 길이에 맞게 입력해주세요");
    } else if (this.beforeItems.length <= 0) {
      alert("변경할 파일이 없습니다");
    } else {
      // 예외처리 하기~~(변경할 파일명이 이미 기존 폴더 내에 존재하는 경우)
      
      this.beforeItems.forEach((item, i) => {
        const o = path.join(this.dir, item.name);
        const n = path.join(this.dir, this.afterItems[i].name);
        fs.renameSync(o, n);
      });
      alert("파일명이 변경되었습니다");
      this.dialog = false;
      this.changeFileName1 = this.changeFileName2 = this.changeFileName3 = "";
      this.fileList = this.beforeItems = this.afterItems = [];
    }
  }

  sortBeforeItems() {
    this.beforeItems.sort(function (a, b) {
      return (a.time > b.time) ? 1 : -1
    })
  }

  get front() {
    return (item: FileInfo) => {
      if (this.filterFront == "1") {
        const sYear = item.time.getFullYear();
        let sMonth: string | number = item.time.getMonth() + 1;
        let sDate: string | number = item.time.getDate();
        sMonth = sMonth > 9 ? sMonth : "0" + sMonth;
        sDate = sDate > 9 ? sDate : "0" + sDate;
        const _date = String(sYear).substring(2, 4) + sMonth + sDate;
        return _date + "_"
      } else if (this.filterFront == "2") {
        return this.changeFileName1
      } else {
        return ""
      }
    }
  }

  get middle() {
    return (item: FileInfo) => {
      if (this.filterMiddle == "1") {
        const _lastDot = item.name.lastIndexOf(".");
        return item.name.substring(0, _lastDot);
      } else {
        return this.changeFileName2
      }
    }
  }

  get back() {
    return (item: FileInfo, i: number) => {
      if (this.filterBack == "1") {
        return "_" + i
      } else if (this.filterBack == "2") {
        return this.changeFileName3
      } else {
        return ""
      }
    }
  }

  get isDisabled(): boolean {
    return this.filterMiddle == "2" ? true : false
  }
  
  @Watch("filterMiddle")
  watchFilterMiddle() {
    if (this.filterMiddle == "2") {
      this.filterBack = "1";
    }
  }

  @Watch("beforeItems")
  watchFileList() {
    this.change()
  }
}
</script>