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
            <img src="@/assets/titleImg/FromImg.png" alt="" height="45" />
          </v-col>
          <v-col cols="6" class="d-flex align-center justify-center"
            ><div v-if="fromDir">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <h3 v-if="dirPath.length < 25" v-bind="attrs" v-on="on">
                    {{ dirPath }}
                  </h3>
                  <h3 v-else v-bind="attrs" v-on="on">
                    {{ dirPath.slice(0, 25) }}
                  </h3>
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
    </div>
    <div class="from-part-second">
      <div class="d-flex justify-end">
        <ListFromFilter @filter-date="filterDate" :state="filterState" />
        <v-btn
          class="mx-2 my-0"
          outlined
          rounded
          small
          color="var(--color-purple)"
          @click="renewFrom"
        >
          <i class="fas fa-sync-alt mr-2"></i>새로고침
        </v-btn>
      </div>
      <div class="" height="100%">
        <div>
          <ListFromBreadcrumbs :fromDir="fromDir" :className="'bread-from'" />
        </div>
        <v-virtual-scroll
          v-if="fileScrollList.length !== 0"
          :items="fileScrollList"
          height="400"
          item-height="90"
          :class="scrollerBgMode"
        >
          <template v-slot:default="{ item }">
            <div :key="item.name" class="d-flex align-start mx-5">
              <div
                v-if="fileScrollList.indexOf(item) === 0"
                class="pa-2"
                :class="fileBoxBgMode"
              >
                <div align="center" @click="enterDirectory('')">
                  <div class="folder--icon">
                    <i class="fas fa-long-arrow-up fa-2x mx-auto"></i>
                  </div>
                </div>
                <div class="file-name" align="center">상위 폴더</div>
              </div>
              <div
                v-for="file in item"
                :key="file.name"
                class="pa-2"
                :class="fileBoxBgMode"
              >
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
        <div v-else class="d-flex flex-column mx-5" height="380">
          <div v-if="fromDir" class="pa-2" :class="fileBoxBgMode">
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

    <div
      v-if="fileScrollList.length !== 0"
      class="from-part-third"
      align="right"
    >
      <BtnDupCheck mr-5 />
      <BtnMoveFile />
    </div>
    <div>
      <ul
        v-if="!selectedData.fileType"
        id="contextmenu"
        class="pa-0"
        :class="bgMode"
      >
        <li>
          <a
            @click="enterDirectory(selectedData.name)"
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/openDirectory.png"
              alt="OpenDirectory"
            />폴더 열기</a
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
            />폴더명 바꾸기</a
          >
        </li>
        <li v-if="osPlatform === 'Win32'">
          <a
            @click="deleteThis(fromDir + '/' + selectedData.name, true)"
            style="display: flex; align-items: center"
            ><v-img
              class="mr-2"
              max-width="25"
              contain
              height="100%"
              src="./../assets/delete.png"
              alt="delete"
            />폴더 지우기</a
          >
        </li>
        <li>
          <BtnUploadGoogleDriveFolder
            v-bind:folderName="selectedData.name"
            v-if="isLogin"
          />
        </li>
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
        class="pa-0"
        :class="bgMode"
      >
        <li class="rename-d" v-if="osPlatform === 'Win32'">
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
            />파일명 바꾸기</a
          >
        </li>
        <li>
          <BtnImageRename />
        </li>
        <li v-if="osPlatform === 'Win32'">
          <a
            @click="deleteThis(fromDir + '/' + selectedData.name, true)"
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
          <BtnUploadGoogleDrive
            v-bind:fileName="selectedData.name"
            v-if="isLogin"
          />
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
        <v-card :class="{ 'modal-d': this.$vuetify.theme.dark }">
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
              v-if="osPlatform === 'Win32'"
              color="#7288da"
              rounded
              dark
              @click="openFile(selectedData.name)"
            >
              실행
            </v-btn>
            <v-btn
              v-if="osPlatform === 'Win32'"
              color="red lighten-1"
              rounded
              dark
              @click="
                deleteThis(fromDir + '/' + selectedData.name, true);
                dialog = false;
              "
            >
              제거
            </v-btn>
            <v-btn text @click="dialog = false"> 닫기 </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog2" persistent max-width="450">
        <v-card :class="{ 'modal-d': this.$vuetify.theme.dark }">
          <v-card-title class="headline">
            {{ selectedData.name }}의 이름 바꾸기
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="renameValue"
              :rules="[rules.required, rules.speical]"
              label="변경할 이름"
            >
            </v-text-field
          ></v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog2 = false"> 취소 </v-btn>
            <v-btn color="#7288da" dark rounded @click="renameThis">
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
import ListFromBreadcrumbs from "@/components/listFrom/ListFromBreadcrumbs.vue";
import ListFromFilter from "@/components/listFrom/ListFromFilter.vue";

import BtnUploadGoogleDrive from "@/components/googleDrive/BtnUploadGoogleDrive.vue";
import BtnUploadGoogleDriveFolder from "@/components/googleDrive/BtnUploadGoogleDriveFolder.vue";

import BtnImageRename from "@/components/ai/BtnImageRename.vue";

import Swal from "sweetalert2";
// import { shell } from "electron";
const { shell } = require("electron").remote;
const { app } = require("electron").remote;
// 휴지통
import { remote } from "electron";
const trash = remote.require("trash");

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
    BtnUploadGoogleDrive,
    BtnUploadGoogleDriveFolder,
    ListFromBreadcrumbs,
    ListFromFilter,
    BtnImageRename,
  },
  computed: mapState([
    "fileSortList",
    "fromDir",
    "fileList",
    "isLogin",
    "osPlatform",
  ]),
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
  filterState: string = "";
  rules: object = {
    required: (value) => !!value || "Required.",
    speical: (v) =>
      (v.indexOf("/") == -1 &&
        v.indexOf("/") == -1 &&
        v.indexOf(":") == -1 &&
        v.indexOf("*") == -1 &&
        v.indexOf("?") == -1 &&
        v.indexOf('"') == -1 &&
        v.indexOf("<") == -1 &&
        v.indexOf(">") == -1 &&
        v.indexOf("|") == -1 &&
        v.indexOf("\\") == -1) ||
      '\\ / : * ? " < > | 은 사용 불가능합니다',
  };
  osPlatform!: string;

  clickclick() {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "준비중입니다",
      showConfirmButton: false,
      timer: 1000,
    });
    // console.log(
    //   fs.createReadStream(this.fromDir + "\\" + this.selectedData["name"])
    // );
  }

  renameThis() {
    if (
      this.renameValue.includes("|") ||
      this.renameValue.includes("\\") ||
      this.renameValue.includes("?") ||
      this.renameValue.includes("<") ||
      this.renameValue.includes(">") ||
      this.renameValue.includes("/") ||
      this.renameValue.includes(":") ||
      this.renameValue.includes('"')
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "특수문자 안된다고",
        showConfirmButton: false,
        timer: 1000,
      });

      return;
    }
    if (
      fs.lstatSync(this.fromDir + "/" + this.selectedData["name"]).isFile() &&
      !this.renameValue.includes(".")
    ) {
      this.renameValue = this.renameValue + "." + this.selectedData["fileType"];
    }
    fs.renameSync(
      this.fromDir + "/" + this.selectedData["name"],
      this.fromDir + "/" + this.renameValue
    );
    this.renewFrom();
    Swal.fire({
      position: "center",
      icon: "success",
      title: "수정되었습니다",
      showConfirmButton: false,
      timer: 1000,
    });
    this.dialog2 = false;
  }
  openShell() {
    // console.log(this.fromDir + "\\" + this.selectedData["name"]);
    shell.openPath(this.fromDir + "/" + this.selectedData["name"]);
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
      this.fromDir + "/" + this.selectedData["name"]
    ).size;

    this.dialog = true;
  }
  deleteThis(path, isFinal) {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "해당 폴더 및 파일은 휴지통으로 이동됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네, 삭제합니다!",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        if (fs.lstatSync(path).isDirectory()) {
          const fileList = fs.readdirSync(path);
          fileList.forEach((name: string) => {
            this.deleteThis(path + "/" + name, false);
          });
          (async () => {
            await trash([path]);
            this.renewFrom();
          })();
        } else {
          (async () => {
            await trash([path]);
            this.renewFrom();
          })();
        }
        if (isFinal) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "삭제되었습니다.",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    });
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
    const posX: number = e.pageX - 90;
    const posY = e.pageY;
    const unit = document.getElementById("contextmenu");
    if (unit) {
      const menuWidth: number = unit.clientWidth;
      const menuHeight: number = unit.clientHeight;
      const secMargin = 10;
      let posLeft = "";
      let posTop = "";
      // console.log(posX, posY, menuWidth, menuHeight, winWidth, winHeight);
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

      // console.log(posLeft, posTop);
      if (posLeft && posTop) {
        posTop = posY + secMargin + "px";
        posLeft = posX + secMargin + "px";
        // console.log(posTop);
        if (Number(posY + secMargin) > 400) {
          posTop = posY - menuHeight - secMargin + "px";
        }
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
      this.renewFrom();
    }
  }
  mounted() {
    BUS.$on("bus:refreshfile", () => {
      this.renewFrom();
    });
    BUS.$on("bus:closecontextmenu", () => {
      this.closeContextMenu();
    });
  }

  fromDir!: string;
  changeDir!: (newDir: string) => void;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  openFile(file: string) {
    if (this.osPlatform === "Win32") {
      childProcess.execSync('"' + this.fromDir + "/" + file + '"');
    }
    // const { spawn } = require("child_process");
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
    this.filterState = "전체보기";
    // console.log(enteredDirectory, 987);
    if (enteredDirectory == "") {
      const dir: string[] = this.fromDir
        .split("\\")
        .join(",")
        .split("/")
        .join(",")
        .split(",");
      dir.pop();
      if (dir.length == 1) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: `권한이 없습니다!`,
          text: "상위 경로에는 이동 권한이 없습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
      this.changeDir(dir.join("/"));
    } else {
      this.changeDir(this.fromDir + "/" + enteredDirectory);
    }
    try {
      this.getFrom(this.fromDir);
    } catch (e) {
      console.log(e);
    }
  }
  async renewFrom() {
    this.getFrom(this.fromDir);
    this.filterState = "전체보기";
  }
  async getFrom(dir: string) {
    try {
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
          const file = {
            name: name,
            fileType: fileType,
            birthTime: birthTime,
            updatedTime: updatedTime,
            icon: "",
          };
          app.getFileIcon(iconPath).then((fileIcon) => {
            realIcon = fileIcon.toDataURL();
            file["icon"] = realIcon;
          });
          fileSortList.files.push(file);
        }
      });
      this.changeFileSortList(fileSortList);
      this.changeFileList(fileList);
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: `권한이 없습니다!`,
        text: `"${dir}"의 이동은 권한이 없습니다.`,
        showConfirmButton: false,
        timer: 1000,
      });
    }
  }

  get dirPath() {
    const tmp = this.fromDir
      .split("\\")
      .join(",")
      .split("/")
      .join(",")
      .split(",");
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

  get fileScrollList() {
    const fileScrollList = this.makeListForScroll();
    return fileScrollList;
  }
  filterDate(id) {
    const fileSortList: SortList = { directories: [], files: [] };
    if (id === 1) {
      this.getFrom(this.fromDir);
    } else {
      for (let i = 0; i < this.fileSortList["directories"].length; i++) {
        if (
          this.compareTime(this.fileSortList["directories"][i].birthTime) &&
          id === 2
        ) {
          fileSortList.directories.push(this.fileSortList["directories"][i]);
        }
        if (
          this.compareTime(this.fileSortList["directories"][i].updatedTime) &&
          id === 3
        ) {
          fileSortList.directories.push(this.fileSortList["directories"][i]);
        }
      }
      for (let i = 0; i < this.fileSortList["files"].length; i++) {
        if (
          this.compareTime(this.fileSortList["files"][i].birthTime) &&
          id === 2
        ) {
          fileSortList.files.push(this.fileSortList["files"][i]);
        }
        if (
          this.compareTime(this.fileSortList["files"][i].updatedTime) &&
          id === 3
        ) {
          fileSortList.files.push(this.fileSortList["files"][i]);
        }
      }
      this.changeFileSortList(fileSortList);
    }
  }
  get bgMode() {
    return this.$vuetify.theme.dark ? "contextmenu-d" : "contextmenu";
  }
  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }
  get fileBoxBgMode() {
    return this.$vuetify.theme.dark ? "file-box-d" : "file-box";
  }
}
</script>

<style>
.from-part-first {
  padding-top: 20px;
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
  font-size: 14px;
}

.contextmenu-d {
  background: #24303a !important;
  box-shadow: 0 15px 35px rgba(107, 107, 190, 0.1),
    0 5px 15px rgba(233, 233, 233, 0.07) !important;
}

.contextmenu-d a {
  color: #ffffff !important;
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

.v-label {
  font-size: 14px;
}
</style>
