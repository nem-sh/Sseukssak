<template>
  <v-container
    @drop="dropFrom"
    dragenter.prevent
    @dragover.prevent
    @click="closeContextMenu"
  >
    <div class="from-part-first">
      <div class="select-folder">
        <v-row>
          <v-col cols="4" class="from-to-name">
            <h3><span>From</span></h3></v-col
          >
          <v-col cols="6" class="d-flex align-center justify-center"
            ><div v-if="fromDir">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <h3 v-bind="attrs" v-on="on">{{ dirPath }}</h3>
                </template>
                <span>{{ fromDir }}</span>
              </v-tooltip>
            </div>
            <div v-else>
              <h3>폴더를 선택해주세요!</h3>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex align-center justify-center"
            ><BtnSelectFromDir />
          </v-col>
        </v-row>
      </div>

      <div class="select-date" align="center">
        <v-btn-toggle v-model="text" tile color="#7288da" group>
          <v-btn
            @click="select = 0"
            class="rounded-xl"
            small
            rounded
            value="left"
          >
            전체보기
          </v-btn>
          <v-btn
            @click="select = 1"
            class="rounded-xl"
            small
            rounded
            value="center"
          >
            오늘 생성된
          </v-btn>
          <v-btn
            @click="select = 2"
            class="rounded-xl"
            small
            rounded
            value="right"
          >
            오늘 수정된
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>

    <div class="from-part-second">
      <div class="lighten-4 rounded-xl from-file-list">
        <v-virtual-scroll :items="tests" height="380" item-height="90">
          <div :key="item" class="d-flex justify-space-between mx-5 pt-3">
            <div v-for="n in 4" :key="n" class="pa-2" outlined tile>
              <div class="file--icon">PNG</div>
              <div align="center">{{ item }}</div>
            </div>
          </div>
        </v-virtual-scroll>
      </div>
    </div>

    <div class="from-part-third" align="right">
      <BtnDupCheck mr-5 /><BtnMoveFile />
    </div>

    <h5>directories</h5>
    <v-list v-if="fromDir">
      <div>
        <v-list-item @click="enterDirectory('')">상위 폴더로</v-list-item>
      </div>
    </v-list>
    <v-list v-for="directory in fileSortList.directories" :key="directory.name">
      <div
        v-if="
          select == 0 ||
          (select == 1 && compareTime(directory.birthTime)) ||
          (select == 2 && compareTime(directory.updatedTime))
        "
      >
        <v-list-item
          @click="enterDirectory(directory.name)"
          @contextmenu.prevent="showContextMenu(directory, $event)"
          >{{ directory.name }}</v-list-item
        >
      </div>
    </v-list>
    <h5>files</h5>
    <v-list v-for="file in fileSortList.files" :key="file.name">
      <div
        v-if="
          select == 0 ||
          (select == 1 && compareTime(file.birthTime)) ||
          (select == 2 && compareTime(file.updatedTime))
        "
      >
        <v-list-item
          @click="openFile(file.name)"
          @contextmenu.prevent="showContextMenu(file, $event)"
          >{{ file }}</v-list-item
        >
      </div>
    </v-list>
    <div>
      <ul v-if="!selectData.fileType" id="contextmenu" class="pa-0 contextmenu">
        <li>
          <a
            @click="enterDirectory(directory.name)"
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/openDirectory.png"
              alt="OpenDirectory"
            />디렉토리 열기</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/delete.png"
              alt="delete"
            />디렉토리 지우기</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center">
            <v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/googleDriveLogo.png"
              alt="googleDrive"
            />
            구글 드라이브 백업</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/info.png"
              alt="info"
            />디렉토리 정보</a
          >
        </li>
      </ul>
      <ul v-if="selectData.fileType" id="contextmenu" class="pa-0 contextmenu">
        <li>
          <a
            @click="openFile(file.name)"
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/run.png"
              alt="delete"
            />파일 실행</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/delete.png"
              alt="delete"
            />파일 지우기</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/googleDriveLogo.png"
              alt="googleDrive"
            />구글 드라이브 백업</a
          >
        </li>
        <li>
          <a @click="clickclick" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/info.png"
              alt="info"
            />파일 정보</a
          >
        </li>
      </ul>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import childProcess from "child_process";
// event bus call
import { BUS } from "./EventBus.js";

import BtnMoveFile from "@/components/BtnMoveFile.vue";
import BtnSelectFromDir from "@/components/BtnSelectFromDir.vue";
import BtnDupCheck from "@/components/BtnDupCheck.vue";

interface SortList {
  directories: Directory[];
  files: File[];
}
interface File {
  fileType: string;
  name: string;
  birthTime: number;
  updatedTime: number;
}
interface Directory {
  name: string;
  birthTime: number;
  updatedTime: number;
}
@Component({
  components: {
    BtnMoveFile,
    BtnSelectFromDir,
    BtnDupCheck,
  },
  computed: mapState(["fileSortList", "fromDir", "fileList"]),
  methods: mapMutations(["changeDir", "changeFileList", "changeFileSortList"]),
})
export default class ListFrom extends Vue {
  selectData: object = {};
  now: Date = new Date();
  select: number = 0;
  fromListLen: number = 0;
  fileSortList!: SortList[];

  clickclick() {
    alert("준비중^__^");
  }
  closeContextMenu() {
    const unit = document.getElementById("contextmenu");
    if (unit) {
      unit.style.display = "none";
    }
  }
  showContextMenu(value, e) {
    this.selectData = value;
    const winWidth = window.outerWidth;
    const winHeight = window.outerHeight;
    const posX: number = e.pageX;
    const posY = e.pageY;
    const unit = document.getElementById("contextmenu");
    if (unit) {
      const menuWidth: number = unit.clientWidth;
      const menuHeight: number = unit.clientWidth;
      const secMargin = 10;
      let posLeft = "";
      let posTop = "";
      if (
        posX + menuWidth + secMargin >= winWidth &&
        posY + menuHeight + secMargin >= winHeight
      ) {
        posLeft = posX - menuWidth - secMargin + "px";
        posTop = posY - menuHeight - secMargin + "px";
      } else if (posX + menuWidth + secMargin >= winWidth) {
        posLeft = posX - menuWidth - secMargin + "px";
        posTop = posY + secMargin + "px";
      } else if (posY + menuHeight + secMargin >= winHeight) {
        posLeft = posX + secMargin + "px";
        posTop = posY - menuHeight - secMargin + "px";
      } else {
        posLeft = posX + secMargin + "px";
        posTop = posY + secMargin + "px";
      }
      if (posLeft && posTop) {
        posLeft = posX + secMargin + "px";
        posTop = posY + secMargin + "px";
        unit.style.left = posLeft;
        unit.style.top = posTop;
        unit.style.display = "block";
      }
    }
  }
  dropFrom(event) {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log(f);
      fs.renameSync(f.path, this.fromDir + "/" + f.name);
    }
  }
  mounted() {
    BUS.$on("bus:refreshfile", () => {
      this.renewFrom();
    });
  }

  fromDir!: string;
  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  openFile(file: string) {
    // const { spawn } = require("child_process");
    childProcess.execSync('"' + this.fromDir + "\\" + file + '"');
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
    if (enteredDirectory == "") {
      const dir: string[] = this.fromDir.split("\\");
      dir.pop();
      this.changeDir(dir.join("\\"));
    } else {
      this.changeDir(this.fromDir + "\\" + enteredDirectory);
    }
    this.getFrom(this.fromDir);
  }
  async renewFrom() {
    this.getFrom(this.fromDir);
  }
  async getFrom(dir: string) {
    const fileList: string[] = fs.readdirSync(dir);
    const fileSortList: SortList = { directories: [], files: [] };
    let fileType = "";
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
        fileType = fileSplit[fileSplit.length - 1].toLowerCase();
        const birthTime = fs.lstatSync(this.fromDir + "/" + name).birthtimeMs;
        const updatedTime = Math.max(
          fs.lstatSync(this.fromDir + "/" + name).mtimeMs,
          fs.lstatSync(this.fromDir + "/" + name).ctimeMs
        );
        fileSortList.files.push({
          name: name,
          fileType: fileType,
          birthTime: birthTime,
          updatedTime: updatedTime,
        });
      }
    });

    this.changeFileSortList(fileSortList);
    this.changeFileList(fileList);
  }

  get items() {
    return Array.from({ length: this.fromListLen }, (k, v) => v + 1);
  }

  get dirPath() {
    const tmp = this.fromDir.split("\\");
    return tmp[tmp.length - 1];
  }

  get tests() {
    return this.fileSortList["directories"].concat(this.fileSortList["files"]);
  }
}
</script>

<style>
.from-part-first {
  padding-top: 28px;
  width: 100%;
}

.from-part-second {
  width: 100%;
  padding: 0 0 10px 0;
}

.from-part-third {
  width: 100%;
  padding-top: 0;
}

.from-file-list {
  height: 100%;
}

.folder-name {
  font-size: 20px;
}

#contextmenu {
  display: none;
  position: absolute;
  width: 200px;
  margin: 0;
  padding: 0;
  background: #ffffff;
  border-radius: 5px;
  list-style: none;
  box-shadow: 0 15px 35px rgba(50, 50, 90, 0.1), 0 5px 15px rgba(0, 0, 0, 0.07);
  overflow: hidden;
  z-index: 999999;
}
#contextmenu li {
  border-left: 3px solid transparent;
  transition: ease 0.2s;
}

#contextmenu li a {
  display: block;
  padding: 10px;
  color: #5768a7;
  text-decoration: none;
  transition: ease 0.2s;
}

#contextmenu li:hover {
  background: #a1b5fd;
  border-left: 3px solid #5768a7;
}

#contextmenu li:hover a {
  color: #ffffff;
}
</style>
