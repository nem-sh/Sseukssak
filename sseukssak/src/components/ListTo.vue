<template>
  <v-container
    style="padding-bottom: 0"
    @drop="dropTo"
    dragenter.prevent
    @dragover.prevent
    @click="closeContextMenu"
  >
    <div class="to-part-first">
      <div class="select-folder">
        <v-row>
          <v-col cols="2" class="to-name">
            <img src="@/assets/titleImg/ToImg.png" alt="" height="47"
          /></v-col>
          <v-col cols="8" align="center" justify="center" class="mt-5">
            <v-select
              :items="toLibraryNameList"
              v-model="selectedToNameValue"
              label="Select Group"
              dense
              outlined
            ></v-select>
          </v-col>
          <v-col cols="2" class="d-flex flex-column">
            <ModalCreateToLibrary @create="changeSN" />
            <div class="mt-2">
              <v-btn
                color="error"
                rounded
                dark
                v-if="selectedToName"
                @click="deleteToLibrary"
              >
                삭제
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </div>
    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedToName" class="to-part-second">
        <v-list-item link>
          <ModalAddToLibraryDirectory v-if="selectedToName" />
        </v-list-item>
        <v-divider></v-divider>
        <v-virtual-scroll
          :items="toLibrary.directories"
          height="370"
          item-height="84"
          :class="scrollerBgMode"
        >
          <template v-slot:default="{ item }">
            <v-list-item
              two-line
              link
              :key="item.path"
              @click.stop="openShell(item.path)"
            >
              <v-list-item-action class="mr-3">
                <v-img
                  v-if="isDriveDirectory(item.path)"
                  src="@/assets/folder-drive-icon.png"
                  alt=""
                  height="60px"
                  width="60px"
                  ><template v-slot:placeholder>
                    <v-row
                      class="fill-height ma-0"
                      align="center"
                      justify="center"
                    >
                      <v-progress-circular
                        indeterminate
                        color="var(--color-purple)"
                      ></v-progress-circular>
                    </v-row> </template></v-img
                ><v-img
                  v-else
                  src="@/assets/folder-icon.png"
                  alt=""
                  height="60px"
                  width="60px"
                  ><template v-slot:placeholder>
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
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <strong v-bind="attrs" v-on="on">{{
                        getDirectoryName(item.path)
                      }}</strong>
                    </template>
                    <span>{{ item.path }}</span>
                  </v-tooltip>
                </v-list-item-title>
                <!-- <div class="item-path">
                  {{ item.path }}
                </div> -->

                <v-list-item-subtitle
                  v-if="
                    getTagLists(item.typeTags, item.dateTags, item.titleTags)
                      .length <= 3
                  "
                  color="#7288da"
                  class="item-path"
                >
                  <v-chip
                    v-for="tag in getTagLists(
                      item.typeTags,
                      item.dateTags,
                      item.titleTags
                    )"
                    :key="tag"
                    class="mr-2"
                    small
                    chip
                    >{{ tag }}
                  </v-chip>
                  <!-- <ListFromBreadcrumbs
                    :fromDir="item.path"
                    :className="'bread-to'"
                  /> -->
                </v-list-item-subtitle>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-list-item-subtitle
                      v-if="
                        getTagLists(
                          item.typeTags,
                          item.dateTags,
                          item.titleTags
                        ).length > 3
                      "
                      color="#7288da"
                      class="item-path"
                    >
                      <v-chip
                        v-for="tag in getTagLists(
                          item.typeTags,
                          item.dateTags,
                          item.titleTags
                        )"
                        :key="tag"
                        class="mr-2"
                        small
                        chip
                        v-bind="attrs"
                        v-on="on"
                        >{{ tag }}
                      </v-chip>
                    </v-list-item-subtitle>
                  </template>
                  <span>{{
                    getTagString(item.typeTags, item.dateTags, item.titleTags)
                  }}</span>
                </v-tooltip>
              </v-list-item-content>
              <v-list-item-action>
                <v-row align="center" justify="center" class="pa-0">
                  <v-col cols="6" class="pa-0">
                    <v-menu
                      top
                      :offset-y="offset"
                      :value="shown"
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          v-on="on"
                          @click="shown = true"
                        >
                          <i class="fas fa-ellipsis-v-alt"></i
                        ></v-btn>
                      </template>
                      <v-list>
                        <v-list-item link>
                          <v-list-item-title
                            ><ModalModifyToLibraryDirectory
                              :propDirectory="item"
                              @closeMenu="closeMenu"
                          /></v-list-item-title>
                        </v-list-item>
                        <v-list-item
                          link
                          @click="deleteToLibraryDirectory(item.path)"
                        >
                          <v-list-item-title
                            ><i
                              class="fas fa-trash mr-2"
                              style="color: #e53935"
                            ></i>
                            삭제하기</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
      </div>
    </div>
    <div v-if="!selectedToName" align="center" class="to-part-second">
      <lottie-player
        src="https://assets7.lottiefiles.com/packages/lf20_dl87KC.json"
        background="transparent"
        speed="1"
        style="width: 300px; height: 300px"
        loop
        autoplay
        class="mt-5"
      ></lottie-player>
      <h3 class="mt-3">정리 그룹을 선택해주세요</h3>
      <div style="font-size: 12px" class="mt-2">
        나만의 정리 그룹을 만들어 사용해보세요!
      </div>
    </div>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import Swal from "sweetalert2";

import ModalCreateToLibrary from "@/components/ModalCreateToLibrary.vue";
import ModalAddToLibraryDirectory from "@/components/ModalAddToLibraryDirectory.vue";
import ModalModifyToLibraryDirectory from "@/components/ModalModifyToLibraryDirectory.vue";
import ListFromBreadcrumbs from "@/components/listFrom/ListFromBreadcrumbs.vue";

import { shell } from "electron";

const shellContextMenu = require("shell-context-menu").remote;
import { BUS } from "./EventBus.js";

// const { shell } = require("electron").remote;
interface ToLibrary {
  name: string;
  directories: ToLibraryDirectory[];
}
interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
  titleTags: string[];
}

@Component({
  components: {
    ModalCreateToLibrary,
    ModalAddToLibraryDirectory,
    ModalModifyToLibraryDirectory,
    ListFromBreadcrumbs,
  },
  computed: mapState([
    "toLibraryList",
    "toLibraryNameList",
    "fromDir",
    "selectedToName",
  ]),
  methods: mapMutations([
    "changeToLibraryList",
    "changeSelectedToName",
    "changeDropToDir",
  ]),
})
export default class ListTo extends Vue {
  selectedToName!: string;
  selectedToNameValue: string = "";
  shown: boolean = false;

  closeMenu() {
    this.shown = false;
  }
  openShell(path: string) {
    let newPath = path;
    if (path.includes("%from%")) {
      if (this.fromDir) {
        newPath = path.replace("%from%", this.fromDir);
      } else {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "이 폴더를 열기 위해선 from을 먼저 지정해주세요!",
          showConfirmButton: false,
          timer: 1000,
        });
      }
    }
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }
    shell.openPath(newPath);
  }
  deleteToLibraryDirectory(directoryPath, event) {
    Swal.fire({
      title: "삭제하시겠습니까?",
      text: "정리 그룹에서 해당 폴더 및 적용된 기준이 삭제됩니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "네, 삭제합니다!",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "삭제되었습니다.",
          showConfirmButton: false,
          timer: 1000,
        });
        const tempToLibraryList = this.toLibraryList;
        for (let index1 = 0; index1 < tempToLibraryList.length; index1++) {
          if (tempToLibraryList[index1].name == this.selectedToName) {
            for (
              let index2 = 0;
              index2 < tempToLibraryList[index1].directories.length;
              index2++
            ) {
              if (
                tempToLibraryList[index1].directories[index2].path ==
                directoryPath
              ) {
                tempToLibraryList[index1].directories.splice(index2, 1);
                this.changeToLibraryList(tempToLibraryList);
                window.localStorage.setItem(
                  "selectedFromData",
                  JSON.stringify(tempToLibraryList)
                );
                return;
              }
            }
          }
        }
      }
    });
  }
  deleteToLibrary() {
    Swal.fire({
      position: "center",
      icon: "warning",
      title: "삭제하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: `Yes`,
    }).then((result) => {
      if (result.isConfirmed) {
        const tempToLibraryList = this.toLibraryList;
        for (let index = 0; index < this.toLibraryList.length; index++) {
          if (this.toLibraryList[index].name == this.selectedToName) {
            this.selectedToName = "";
            tempToLibraryList.splice(index, 1);
            this.changeToLibraryList(tempToLibraryList);
            window.localStorage.setItem(
              "selectedFromData",
              JSON.stringify(tempToLibraryList)
            );
            break;
          }
        }
      }
    });
  }
  dropTo(event) {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log(f);
      if (this.selectedToName == "") {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "라이브러리를 선택해주세요",
          showConfirmButton: false,
          timer: 1000,
        });
      } else {
        if (fs.statSync(f.path).isDirectory()) {
          this.changeDropToDir(f.path);
        } else {
          Swal.fire({
            position: "center",
            icon: "warning",
            title: "디렉토리가 아닙니다",
            showConfirmButton: false,
            timer: 1000,
          });
        }
      }
    }
  }

  created() {
    this.selectedToNameValue = this.selectedToName;
    const mySettings = window.localStorage.getItem("selectedFromData"); // 로컬스토리지에서 해당 key 이름으로 되어있는 value 값 불러오기
    let mySettingObj: ToLibrary[] = [
      {
        name: "유형별 정리",
        directories: [
          {
            path: "%from%\\이미지",
            typeTags: ["#Image"],
            dateTags: [],
            titleTags: [],
          },
          {
            path: "%from%\\문서",
            typeTags: ["#Document"],
            dateTags: [],
            titleTags: [],
          },
          {
            path: "%from%\\비디오",
            typeTags: ["#Video"],
            dateTags: [],
            titleTags: [],
          },
          {
            path: "%from%\\오디오",
            typeTags: ["#Audio"],
            dateTags: [],
            titleTags: [],
          },
          {
            path: "%from%\\압축파일",
            typeTags: ["#Compressed"],
            dateTags: [],
            titleTags: [],
          },
          {
            path: "%from%\\바로가기",
            typeTags: ["lnk"],
            dateTags: [],
            titleTags: [],
          },
        ],
      },
    ];
    if (!mySettings || mySettings == "[]") {
      // 해당 키의 데이터가 없다면 - 최초 사용 시에만 이 필터에 걸릴 것
      const SerializedData = JSON.stringify([
        {
          name: "유형별 정리",
          directories: [
            {
              path: "%from%\\이미지",
              typeTags: ["#Image"],
              dateTags: [],
              titleTags: [],
            },
            {
              path: "%from%\\문서",
              typeTags: ["#Document"],
              dateTags: [],
              titleTags: [],
            },
            {
              path: "%from%\\비디오",
              typeTags: ["#Video"],
              dateTags: [],
              titleTags: [],
            },
            {
              path: "%from%\\오디오",
              typeTags: ["#Audio"],
              dateTags: [],
              titleTags: [],
            },
            {
              path: "%from%\\압축파일",
              typeTags: ["#Compressed"],
              dateTags: [],
              titleTags: [],
            },
            {
              path: "%from%\\바로가기",
              typeTags: ["lnk"],
              dateTags: [],
              titleTags: [],
            },
          ],
        },
      ]); // 로컬스토리지는 string 값만 저장할 수 있기 때문에 이 절차가 필요함
      window.localStorage.setItem("selectedFromData", SerializedData); // 앞에가 key, 뒤에가 value로 저장됨
    } else {
      mySettingObj = JSON.parse(mySettings);
    }
    // const SerializedData = JSON.stringify([
    //   {
    //     name: "유형별 정리",
    //     directories: [
    //       {
    //         path: "%from%\\이미지",
    //         typeTags: ["#Image"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //       {
    //         path: "%from%\\문서",
    //         typeTags: ["#Document"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //       {
    //         path: "%from%\\비디오",
    //         typeTags: ["#Video"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //       {
    //         path: "%from%\\오디오",
    //         typeTags: ["#Audio"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //       {
    //         path: "%from%\\압축파일",
    //         typeTags: ["#Compressed"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //       {
    //         path: "%from%\\바로가기",
    //         typeTags: ["lnk"],
    //         dateTags: [],
    //         titleTags: [],
    //       },
    //     ],
    //   },
    // ]); // 로컬스토리지는 string 값만 저장할 수 있기 때문에 이 절차가 필요함
    // window.localStorage.setItem("selectedFromData", SerializedData); // 앞에가 key, 뒤에가 value로 저장됨
    this.changeToLibraryList(mySettingObj);

    // if (!fs.existsSync("C:/Users/multicampus/Desktop/selectedFromData.txt")) {
    //   fs.writeFileSync(
    //     "C:/Users/multicampus/Desktop/selectedFromData.txt",
    //     "[]"
    //   );
    // }

    // const tempToLibrary: ToLibrary[] = JSON.parse(
    //   fs
    //     .readFileSync("C:/Users/multicampus/Desktop/selectedFromData.txt")
    //     .toString()
    //     .trim()
    // );
    // this.changeToLibraryList(tempToLibrary);
  }

  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];
  changeToLibraryList!: (newList: ToLibrary[]) => void;
  changeSelectedToName!: (newName: string) => void;
  changeDropToDir!: (dir: string) => void;

  dirLength: number = 0;
  selectedDir!: ToLibraryDirectory[];
  fromDir!: string;
  offset: boolean = true;
  menuOpened: boolean = false;

  getDirectoryName(path) {
    const pathList = path.split("\\");
    return pathList[pathList.length - 1];
  }

  changeDirectoryLength(selectedToName) {
    let i;
    for (i = 0; i < this.toLibraryList.length; i++) {
      if (selectedToName === this.toLibraryList[i].name) {
        this.dirLength = this.toLibraryList[i].directories.length;
      }
    }
  }

  closeContextMenu() {
    BUS.$emit("bus:closecontextmenu");
  }

  changeSN(name) {
    this.changeSelectedToName(name);
    this.changeDirectoryLength(name);
  }

  getTagLists(type, date, title) {
    const tagLists = [];
    Array.prototype.push.apply(tagLists, type);
    Array.prototype.push.apply(tagLists, date);
    Array.prototype.push.apply(tagLists, title);
    return tagLists;
  }

  getTagString(type, date, title) {
    const tagLists = this.getTagLists(type, date, title);
    let tagListStr = "";
    for (let i = 0; i < tagLists.length; i++) {
      tagListStr += "  " + tagLists[i];
    }
    return tagListStr;
  }

  isDriveDirectory(path) {
    if (path.includes("%drive%")) {
      return true;
    }
    return false;
  }

  @Watch("selectedToName")
  watchSelectedToName() {
    this.selectedToNameValue = this.selectedToName;
    this.changeDirectoryLength(this.selectedToName);
  }

  @Watch("selectedToNameValue")
  watchSelectedToNameValue() {
    this.changeSelectedToName(this.selectedToNameValue);
    this.changeDirectoryLength(this.selectedToName);
  }
  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }
}
</script>

<style>
.to-part-first {
  padding-top: 20px;
  width: 100%;
}

.to-part-second {
  width: 100%;
  padding: 10px 0 10px 0;
}

.to-part-third {
  width: 100%;
  height: 40px;
  padding-top: 0;
}

.theme--light.v-label {
  color: rgba(0, 0, 0, 0.6) !important;
}

.item-path {
  font-size: 13px !important;
  color: #7a8186;
}

.item-path-tag {
  background: #7288da;
}

.to-name {
  padding-top: 10px;
}
</style>
