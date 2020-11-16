<template>
  <v-col cols="12" :class="partMode">
    <div>
      <div :class="partTitleMode">
        <h4 class="text-center">3. 확인 및 변경</h4>
      </div>
    </div>
    <v-row>
      <v-col cols="5.5" class="position-p">
        <p class="text-center font-weight-bold" :class="partTitleMode">
          변경 전
        </p>
        <div v-if="beforeItems.length <= 0" align="center" class="position-c">
          <p class="mt-2">파일/폴더를 선택하세요 :(</p>
        </div>
        <v-virtual-scroll
          :class="scrollerBgMode"
          :bench="benched"
          :items="beforeItems"
          height="130"
          item-height="40"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="beforeItems.indexOf(item)">
              <v-list-item-content>
                <p class="text-next-line font-weight-bold">
                  {{ beforeItems.indexOf(item) + 1 }}.{{ item.name }}
                </p>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
      <v-col cols="5.5" class="position-p">
        <p
          class="text-center font-weight-bold"
          style="color: #7288da"
          :class="partTitleMode"
        >
          변경 후
        </p>
        <div v-if="afterItems.length <= 0" align="center" class="position-c">
          <p class="mt-2">파일/폴더를 선택하세요 :(</p>
        </div>
        <v-virtual-scroll
          :class="scrollerBgMode"
          :bench="benched"
          :items="afterItems"
          height="130"
          item-height="40"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="afterItems.indexOf(item)">
              <v-list-item-content>
                <p
                  class="text-next-line font-weight-bold"
                  style="color: #7288da"
                >
                  {{ afterItems.indexOf(item) + 1 }}.{{ item.name }}
                </p>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-col>
      <v-col cols="1" class="pr-5 d-flex flex-column my-auto align-center">
        <v-btn
          dark
          rounded
          class="mr-4 mb-2 play-btn"
          @click="rename"
          color="#7288da"
        >
          변경
        </v-btn>
        <v-btn
          rounded
          class="mr-4"
          style="color: white"
          @click="logBack"
          :disabled="logBackCheck === false"
          color="red accent-2"
        >
          <i class="fas fa-redo-alt"></i>
        </v-btn>
      </v-col>
    </v-row>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import fs from "fs";
import path from "path";
import { mapMutations, mapState } from "vuex";

import Swal from "sweetalert2";
import { BUS } from "../EventBus.js";

interface FileInfo {
  name: string;
  path: string;
  ctime: Date;
  mtime: Date;
  type: string;
  dir: string;
}

@Component({
  computed: mapState([
    "filterFront",
    "filterMiddle",
    "filterBack",
    "frontName",
    "middleName",
    "backName",
    "renameFileList",
    "beforeItems",
    "afterItems",
    "dupCheck",
    "renameHistory",
    "logBackCheck",
  ]),
  methods: mapMutations([
    "changeRenameDir",
    "changePreview",
    "changeRenameHistory",
    "changeRenameHistory2",
    "changeLogBackCheck",
    "initailizeRename",
  ]),
})
export default class Rename extends Vue {
  filterFront!: string;
  filterMiddle!: string;
  filterBack!: string;
  frontName!: string;
  middleName!: string;
  backName!: string;
  renameFileList!: FileInfo[];
  beforeItems!: FileInfo[];
  afterItems!: FileInfo[];
  dupCheck!: string[];
  renameHistory!: any[][];
  logBackCheck!: boolean;
  benched: number = 0;
  changePreview!: () => void;
  changeRenameHistory!: (newHistory: any[]) => void;
  changeRenameHistory2!: (newHistory: any[]) => void;
  changeLogBackCheck!: (newCheck: boolean) => void;
  initailizeRename!: () => void;
  changeRenameDir!: (newDir: string) => void;

  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }

  get partTitleMode() {
    return this.$vuetify.theme.dark ? "part-title-d" : "part-title";
  }
  get partMode() {
    return this.$vuetify.theme.dark ? "rename-part-bg-d" : "rename-part-bg";
  }

  rename() {
    if (
      (this.filterFront == "2" && !this.frontName) ||
      (this.filterMiddle == "2" && !this.middleName) ||
      (this.filterBack == "2" && !this.backName)
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "빈칸을 작성해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
    } else if (
      this.frontName.length > 10 ||
      this.middleName.length > 20 ||
      this.backName.length > 10
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "지정된 길이에 맞게 입력해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
    } else if (this.beforeItems.length <= 0) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "변경할 파일/폴더가 없습니다",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      // 특수문자 예외처리
      const specialC = /[?:|*<>\\/"]/gi;
      this.afterItems.forEach((item) => {
        if (item.name.search(specialC) !== -1) {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: `이름에 특수 문자(${specialC})는 사용하실 수 없습니다`,
            showConfirmButton: false,
            timer: 1000,
          });
        }
        return;
      });

      Swal.fire({
        position: "center",
        icon: "warning",
        title: "이름을 변경하시겠습니까?",
        showCancelButton: true,
        confirmButtonText: `Yes`,
      }).then((result) => {
        if (result.isConfirmed) {
          // 예외처리 하기(변경할 파일명이 이미 기존 폴더 내에 존재하는 경우)
          const dupTmp: Array<FileInfo> = [];
          const dupTmpChange: Array<string> = [];
          const logData: Array<object> = [];
          const workTime: number = new Date().setTime(Date.now());

          let changeFlag: boolean = false;

          this.afterItems.forEach((item, i) => {
            const dupIdx = this.dupCheck.indexOf(item.name);
            // 확장자
            let _fileType = "";
            if (item.type !== "") {
              _fileType = "." + item.type;
            }
            // 자기 자신은 제외
            if (
              dupIdx !== -1 &&
              this.renameFileList[dupIdx].ctime !== item.ctime
            ) {
              dupTmp.push(this.beforeItems[i]);
              // 중복되지 않는 파일명 생성
              let cnt = 1;
              let noDupName =
                item.name.substring(0, item.name.length - _fileType.length) +
                "(" +
                cnt +
                ")" +
                _fileType;
              do {
                noDupName =
                  item.name.substring(0, item.name.length - _fileType.length) +
                  "(" +
                  cnt++ +
                  ")" +
                  _fileType;
              } while (noDupName in this.dupCheck);
              dupTmpChange.push(noDupName);
            } else {
              const o = path.join(item.dir, this.beforeItems[i].name);
              const n = path.join(item.dir, item.name);
              if (o !== n) {
                changeFlag = true;
                fs.renameSync(o, n);
                logData.push([
                  this.beforeItems[i].name + " => " + item.name,
                  1,
                  o,
                  n,
                  workTime,
                  3,
                ]);
                this.changeRenameHistory2([
                  this.beforeItems[i].name + " => " + item.name,
                  1,
                  o,
                  n,
                  workTime,
                  3,
                ]);
              }
            }
          });
          if (dupTmp.length > 0) {
            const text = dupTmp
              .map(function(item, index) {
                return item.name + " => " + dupTmpChange[index];
              })
              .join(" , ");
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "바꾸려는 파일명이 해당 디렉토리에 이미 존재합니다. 다음과 같이 변경하시겠습니까?",
              text: text,
              showCancelButton: true,
              confirmButtonText: `Yes`,
            }).then((result) => {
              if (result.isConfirmed) {
                dupTmp.forEach((item, i) => {
                  const o = path.join(item.dir, item.name);
                  const n = path.join(item.dir, dupTmpChange[i]);
                  changeFlag = true;
                  fs.renameSync(o, n);
                  logData.push([
                    item + " => " + dupTmpChange[i],
                    1,
                    o,
                    n,
                    workTime,
                    3,
                  ]);
                  this.changeRenameHistory2([
                    this.beforeItems[i].name + " => " + item.name,
                    1,
                    o,
                    n,
                    workTime,
                    3,
                  ]);
                  this.$emit("finish");
                  this.initailizeRename();
                  BUS.$emit("bus:refreshfilter");
                });
              }
            });
          } else {
            if (changeFlag) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "변경되었습니다",
                showConfirmButton: false,
                timer: 1000,
              });
              this.changeLogBackCheck(true);
            } else {
              Swal.fire({
                position: "center",
                icon: "info",
                title: "변경된 파일/폴더가 없습니다",
                showConfirmButton: false,
                timer: 1000,
              });
            }
            this.$emit("finish");
            this.initailizeRename();
            BUS.$emit("bus:refreshfilter");
          }
          changeFlag = false;
          this.changeRenameHistory(logData);
          this.changeRenameDir("");
        }
      });
    }
  }

  logBack() {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "이전 작업을 되돌리시겠습니까?",
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        const workTime: number = new Date().setTime(Date.now());
        this.changeLogBackCheck(false);
        const lastLog = this.renameHistory[this.renameHistory.length - 1];
        lastLog.forEach((log) => {
          const oldArray = log[3].split("\\");
          const oldName = oldArray[oldArray.length - 1];
          const newArray = log[2].split("\\");
          const newName = newArray[newArray.length - 1];
          // 예외처리(해당 폴더에 되돌리려는 파일명이 존재하면 -> 덮어씌어지지 않게)
          if (fs.existsSync(log[2])) {
            Swal.fire({
              position: "center",
              icon: "warning",
              title:
                "되돌리려는 파일명과 같은 파일명이 존재합니다. 덮어씌우시겠습니까?",
              text: log[2],
              showCancelButton: true,
              confirmButtonText: `Yes`,
            }).then((result) => {
              if (result.isConfirmed) {
                // 예외처리(해당 폴더에 해당 파일이 존재하지 않으면)
                try {
                  fs.renameSync(log[3], log[2]);
                  this.changeRenameHistory2([
                    oldName + " => " + newName,
                    -1,
                    log[3],
                    log[2],
                    workTime,
                    3,
                  ]);
                } catch (error) {
                  Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "되돌리려는 파일이 존재하지 않습니다",
                    showConfirmButton: false,
                    timer: 1000,
                  });
                }
              }
            });
          } else {
            try {
              fs.renameSync(log[3], log[2]);
              this.changeRenameHistory2([
                oldName + " => " + newName,
                -1,
                log[3],
                log[2],
                workTime,
                3,
              ]);
            } catch (error) {
              Swal.fire({
                position: "center",
                icon: "warning",
                title: "되돌리려는 파일이 존재하지 않습니다",
                showConfirmButton: false,
                timer: 1000,
              });
            }
          }
        });
        this.initailizeRename();
      }
    });
  }

  @Watch("beforeItems")
  watchFileList() {
    this.changePreview();
  }
}
</script>
<style>
.text-next-line {
  word-break: break-word;
}
</style>
