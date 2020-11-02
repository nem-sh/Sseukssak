<template>
  <v-col cols="7.5" class="rename-part-bg">
    <div>
      <div class="part-title">
        <h4 class="text-center">3. 확인 후 rename</h4>
      </div>
    </div>
    <v-row>
      <v-col cols="6">
        <p class="text-center part-title">기존 파일명</p>
        <!-- <v-divider></v-divider> -->
        <v-list-item v-for="(item, i) in beforeItems" :key="i">
          <v-list-item-content class="white--text">
            {{ i + 1 }}. {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="6">
        <p class="text-center part-title">변경될 파일명</p>
        <!-- <v-divider></v-divider> -->
        <v-list-item v-for="(item, i) in afterItems" :key="i">
          <v-list-item-content class="white--text">
            {{ i + 1 }}. {{ item.name }}
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <div class="text-right mt-2">
      <v-btn @click="logBack" :disabled="logBackCheck === false">
        <i class="fas fa-redo-alt"></i>
      </v-btn>
      <v-btn class="ml-4 white--text" @click="rename" color="#7288da">
        OK
      </v-btn>
    </div>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import fs from "fs";
import path from "path";
import { mapMutations, mapState } from 'vuex';

interface FileInfo {
  name: string;
  path: string;
  ctime: Date;
  mtime: Date;
  type: string;
  dir: string;
}

@Component({
  computed: mapState(["filterFront", "filterMiddle", "filterBack", "frontName", "middleName", "backName", "renameFileList", "beforeItems", "afterItems", "dupCheck", "renameHistory", "logBackCheck"]),
  methods: mapMutations(["changePreview", "changeRenameHistory", "changeLogBackCheck", "initailizeRename"])
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
  changePreview!: () => void;
  changeRenameHistory!: (newHistory: any[]) => void;
  changeLogBackCheck!: (newCheck: boolean) => void;
  initailizeRename!: () => void;

  rename() {
    if (
      (this.filterFront == "2" && !this.frontName) ||
      (this.filterMiddle == "2" && !this.middleName) ||
      (this.filterBack == "2" && !this.backName)
    ) {
      alert("빈칸을 작성해주세요");
    } else if (
      this.frontName.length > 10 ||
      this.middleName.length > 20 ||
      this.backName.length > 10
    ) {
      alert("지정된 길이에 맞게 입력해주세요");
    } else if (this.beforeItems.length <= 0) {
      alert("변경할 파일이 없습니다");
    } else {
      // 예외처리 하기(변경할 파일명이 이미 기존 폴더 내에 존재하는 경우)
      const dupTmp: Array<FileInfo> = []
      const dupTmpChange: Array<string> = []
      const logData: Array<object> = []
      const workTime: Date = new Date()

      this.afterItems.forEach((item, i) => {
        const dupIdx = this.dupCheck.indexOf(item.name)
        // 확장자
        let _fileType = ""
        if (item.type !== "") {
          _fileType = "." + item.type
        }
        // 자기 자신은 제외
        if (dupIdx !== -1 && this.renameFileList[dupIdx].ctime !== item.ctime) {
          dupTmp.push(this.beforeItems[i]);
          // 중복되지 않는 파일명 생성
          let cnt = 1
          let noDupName = item.name.substring(0, item.name.length - _fileType.length) + "(" + cnt + ")" + _fileType
          do {
            noDupName = item.name.substring(0, item.name.length - _fileType.length) + "(" + cnt++ + ")" + _fileType
          } while (noDupName in this.dupCheck)
          dupTmpChange.push(noDupName)
        } else {
          const o = path.join(item.dir, this.beforeItems[i].name);
          const n = path.join(item.dir, item.name);
          fs.renameSync(o, n);
          logData.push([this.beforeItems[i].name + " => " + item.name, 1, o, n, workTime, 3])
        }
      });
      if (dupTmp.length > 0) {
        const text = dupTmp
          .map(function (item, index) {
            return index + 1 + ". " + item + " => " + dupTmpChange[index];
          })
          .join("\n");
        if (
          confirm(
            "바꾸려는 파일명이 해당 디렉토리에 이미 존재합니다. 다음과 같이 변경하시겠습니까?" +
              "\n" +
              text
          )
        ) {
          dupTmp.forEach((item, i) => {
            const o = path.join(item.dir, item.name);
            const n = path.join(item.dir, dupTmpChange[i]);
            fs.renameSync(o, n);
            logData.push([item + " => " + dupTmpChange[i], 1, o, n, workTime, 3])
          })
        }
      }
      alert("파일명이 변경되었습니다");
      this.changeRenameHistory(logData)
      this.changeLogBackCheck(true)
      this.initailizeRename()
    }
  }

  logBack() {
    this.changeLogBackCheck(false)
    const lastLog = this.renameHistory[this.renameHistory.length - 1]
    lastLog.forEach(log => {
      // 예외처리(해당 폴더에 되돌리려는 파일명이 존재하면 -> 덮어씌어지지 않게)
      if (fs.existsSync(log[2])) {
        if (confirm("되돌리려는 파일명과 같은 파일명이 존재합니다. 덮어씌우시겠습니까?" + "\n" + log[2])) {
          // 예외처리(해당 폴더에 해당 파일이 존재하지 않으면)
          try {
            fs.renameSync(log[3], log[2]);
          } catch (error) {
            alert("되돌리려는 파일이 존재하지 않습니다.")
          }
        }
      } else {
        try {
          fs.renameSync(log[3], log[2]);
        } catch (error) {
          alert("되돌리려는 파일이 존재하지 않습니다.")
        }
      }
    });
  }
  
  @Watch("beforeItems")
  watchFileList() {
    this.changePreview();
  }
}
</script>
