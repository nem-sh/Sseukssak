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

      <!-- <div class="select-date" align="center">
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
      </div> -->
    </div>

    <div class="from-part-second">
      <div class="rounded-xl" height="100%">
        <v-virtual-scroll
          v-if="fileList.length !== 0"
          :items="fileList"
          height="380"
          item-height="90"
          class="file-scroller"
        >
          <div v-if="fileList.length === 0">Nono</div>
          <template v-slot:default="{ item }">
            <div :key="item.name" class="d-flex align-start mx-5 pt-3">
              <div v-if="fileList.indexOf(item) === 0" class="pa-2 file-box">
                <div align="center" @click="enterDirectory('')">
                  <div class="folder--icon">
                    <i class="fas fa-long-arrow-up fa-2x mx-auto"></i>
                  </div>
                </div>
                <div class="file-name" align="center">상위 폴더</div>
              </div>
              <div v-for="file in item" :key="file.name" class="pa-2 file-box">
                <div
                  v-if="
                    select == 0 ||
                    (select == 1 && compareTime(file.birthTime)) ||
                    (select == 2 && compareTime(file.updatedTime))
                  "
                >
                  <div
                    v-if="file.fileType"
                    @click="openFile(file.name)"
                    @contextmenu.prevent="showContextMenu(file, $event)"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-if="file.fileType"
                          align="center"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-hover v-slot="{ hover }">
                            <div class="file--icon">
                              <v-img
                                v-if="!hover"
                                height="50px"
                                width="50px"
                                class="folder--icon"
                                :src="file.icon"
                                alt="icon"
                              >
                                <template v-slot:placeholder>
                                  <v-row
                                    class="fill-height ma-0"
                                    align="center"
                                    justify="center"
                                  >
                                    <v-progress-circular
                                      indeterminate
                                      color="var(--color-purple)"
                                    ></v-progress-circular>
                                  </v-row>
                                </template>
                              </v-img>
                              <div v-else>{{ file.fileType }}</div>
                            </div>
                          </v-hover>
                        </div>
                        <div v-else align="center" v-bind="attrs" v-on="on">
                          <img
                            src="@/assets/folder-icon.png"
                            alt=""
                            height="50px"
                            width="50px"
                            class="folder--icon"
                          />
                        </div>
                      </template>
                      <span>{{ file.name }}</span>
                    </v-tooltip>
                    <div
                      v-if="file.name.length <= 6"
                      class="file-name"
                      align="center"
                    >
                      {{ file.name }}
                    </div>
                    <div v-else class="file-name" align="center">
                      {{ file.name.slice(0, 6) }}..
                    </div>
                  </div>
                  <div
                    v-else
                    @click="enterDirectory(file.name)"
                    @contextmenu.prevent="showContextMenu(file, $event)"
                  >
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <div
                          v-if="file.fileType"
                          align="center"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <div class="file--icon">{{ file.fileType }}</div>
                        </div>
                        <div v-else align="center" v-bind="attrs" v-on="on">
                          <v-img
                            src="@/assets/folder-icon.png"
                            alt=""
                            height="50px"
                            width="50px"
                            class="folder--icon"
                          >
                            <template v-slot:placeholder>
                              <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                              >
                                <v-progress-circular
                                  indeterminate
                                  color="var(--color-purple)"
                                ></v-progress-circular>
                              </v-row> </template
                          ></v-img>
                        </div>
                      </template>
                      <span>{{ file.name }}</span>
                    </v-tooltip>
                    <div
                      v-if="file.name.length <= 6"
                      class="file-name"
                      align="center"
                    >
                      {{ file.name }}
                    </div>
                    <div v-else class="file-name" align="center">
                      {{ file.name.slice(0, 6) }}..
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </v-virtual-scroll>
        <div v-else class="d-flex flex-column mx-5 pt-3" height="380">
          <div v-if="fromDir" class="pa-2 file-box">
            <div align="center" @click="enterDirectory('')">
              <div class="folder--icon">
                <i class="fas fa-long-arrow-up fa-2x mx-auto"></i>
              </div>
            </div>
            <div class="file-name" align="center">상위 폴더</div>
          </div>
          <div v-if="fromDir" align="center">
            <lottie-player
              src="https://assets6.lottiefiles.com/temp/lf20_Celp8h.json"
              background="transparent"
              speed="1"
              style="width: 220px; height: 220px"
              autoplay
              mx-auto
            ></lottie-player>
            <h3 class="mt-2">정리할 파일이 없습니다 :(</h3>
            <div style="font-size: 12px" class="mt-2">
              다른 폴더를 선택해 주세요!
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="fileList.length !== 0" class="from-part-third" align="right">
      <!-- <BtnDupCheck mr-5 /> -->
      <BtnMoveFile />
    </div>

    <div>
      <ul
        v-if="!selectedData.fileType"
        id="contextmenu"
        class="pa-0 contextmenu"
      >
        <li>
          <a
            @click="enterDirectory(fromDir + '\\' + selectedData.name)"
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
          <a
            @click="
              renameValue = selectedData.name;
              dialog2 = true;
            "
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/rename.png"
              alt="rename"
            />파일 리네임</a
          >
        </li>
        <li>
          <a
            @click="deleteThis(fromDir + '\\' + selectedData.name, true)"
            style="display: flex; align-items: center"
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
        <!-- <li>
          <a @click="dialog2 = true" style="display: flex; align-items: center">
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
        </li> -->
        <li>
          <a @click="openShell()" style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/info.png"
              alt="info"
            />탐색기에서 열기</a
          >
        </li>
      </ul>
      <ul
        v-if="selectedData.fileType"
        id="contextmenu"
        class="pa-0 contextmenu"
      >
        <li>
          <a
            @click="openFile(selectedData.name)"
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/run.png"
              alt="run"
            />파일 실행</a
          >
        </li>
        <li>
          <a
            @click="
              renameValue = selectedData.name;
              dialog2 = true;
            "
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/rename.png"
              alt="rename"
            />파일 리네임</a
          >
        </li>
        <li>
          <a
            @click="deleteThis(fromDir + '\\' + selectedData.name, true)"
            style="display: flex; align-items: center"
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
          <!-- <BtnUploadGoogleDrive v-bind:fileName="selectedData.name"/> -->
        </li>
        <li>
          <a @click="getInfo()" style="display: flex; align-items: center"
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
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title class="headline mb-3">
            {{ selectedDataInfo.name }}
          </v-card-title>

          <v-card-text class="text--primary">
            <div class="mb-2">대상 형식 : {{ selectedDataInfo.fileType }}</div>
            <div>대상 크기 : {{ selectedDataInfo.size }} byte</div>
          </v-card-text>

          <v-spacer></v-spacer>
          <v-card-text class="text--primary">
            <div class="mb-2">만든 날짜 : {{ selectedDataInfo.birthTime }}</div>
            <div>수정 날짜 : {{ selectedDataInfo.updatedTime }}</div>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="openFile(selectedData.name)"
            >
              실행
            </v-btn>
            <v-btn
              color="red darken-1"
              text
              @click="
                deleteThis(fromDir + '\\' + selectedData.name, true);
                dialog = false;
              "
            >
              제거
            </v-btn>
            <v-btn color=" darken-1" text @click="dialog = false"> 닫기 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">
            {{ selectedData.name }}의 이름 바꾸기
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="renameValue" label="변경할 이름">
            </v-text-field
          ></v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog2 = false">
              취소
            </v-btn>
            <v-btn color="green darken-1" text @click="renameThis">
              지정
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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

// import BtnUploadGoogleDrive from "@/components/googleDrive/BtnUploadGoogleDrive.vue"

// import { shell } from "electron";
const { shell } = require("electron").remote;
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
  components: {
    BtnMoveFile,
    BtnSelectFromDir,
    BtnDupCheck,
    // BtnUploadGoogleDrive
  },
  computed: mapState(["fileSortList", "fromDir", "fileList"]),
  methods: mapMutations(["changeDir", "changeFileList", "changeFileSortList"]),
})
export default class ListFrom extends Vue {
  icon = require("./../assets/info.png");
  text: string = "";
  renameValue: string = "";
  selectedData: object = {};
  selectedDataInfo: object = {};
  now: Date = new Date();
  select: number = 0;
  fromListLen: number = 0;
  fileSortList!: SortList[];
  dialog: boolean = false;
  dialog2: boolean = false;
  clickclick() {
    alert("준비중^__^");
    console.log(
      fs.createReadStream(this.fromDir + "\\" + this.selectedData["name"])
    );
  }

  renameThis() {
    if (
      fs.lstatSync(this.fromDir + "\\" + this.selectedData["name"]).isFile() &&
      !this.renameValue.includes(".")
    ) {
      this.renameValue = this.renameValue + "." + this.selectedData["fileType"];
    }
    fs.renameSync(
      this.fromDir + "\\" + this.selectedData["name"],
      this.fromDir + "\\" + this.renameValue
    );
    this.renewFrom();
    alert("수정됨^__^");
    this.dialog2 = false;
  }
  openShell() {
    console.log(this.fromDir + "\\" + this.selectedData["name"]);
    shell.openPath(this.fromDir + "\\" + this.selectedData["name"]);
  }
  getInfo() {
    this.selectedDataInfo["name"] = this.selectedData["name"];

    this.selectedDataInfo["fileType"] = this.selectedData["fileType"];
    this.selectedDataInfo["birthTime"] = new Date(
      this.selectedData["birthTime"]
    );
    this.selectedDataInfo["updatedTime"] = new Date(
      this.selectedData["updatedTime"]
    );
    this.selectedDataInfo["size"] = fs.statSync(
      this.fromDir + "\\" + this.selectedData["name"]
    ).size;

    this.dialog = true;
  }
  deleteThis(path, isFinal) {
    if (fs.lstatSync(path).isDirectory()) {
      const fileList = fs.readdirSync(path);
      fileList.forEach((name: string) => {
        this.deleteThis(path + "\\" + name, false);
      });

      fs.rmdirSync(path);
    } else {
      fs.unlinkSync(path);
    }
    if (isFinal) {
      alert("지워드림 ^_^");
      this.renewFrom();
    }
  }
  closeContextMenu() {
    const unit = document.getElementById("contextmenu");
    if (unit) {
      unit.style.display = "none";
    }
  }
  showContextMenu(value, e) {
    this.selectedData = value;
    const winWidth = window.outerWidth;
    const winHeight = window.outerHeight;
    const posX: number = e.pageX - 65;
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

  get items() {
    return Array.from({ length: this.fromListLen }, (k, v) => v + 1);
  }

  get dirPath() {
    const tmp = this.fromDir.split("\\");
    return tmp[tmp.length - 1];
  }

  makeListForScroll() {
    const totalFile = this.fileSortList["directories"].concat(
      this.fileSortList["files"]
    );
    const totalFileForScroll: object[] = [];
    let n = 0;
    while (n < totalFile.length) {
      if (n === 0) {
        totalFileForScroll.push(totalFile.slice(n, n + 3));
        n += 3;
      } else {
        totalFileForScroll.push(totalFile.slice(n, n + 4));
        n += 4;
      }
    }
    return totalFileForScroll;
  }

  get fileList() {
    const fileList = this.makeListForScroll();
    return fileList;
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

.folder-name {
  font-size: 20px;
}

.file-name {
  font-size: 13px;
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
