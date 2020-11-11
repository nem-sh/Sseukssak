<template>
  <div>
    <div @click="dialog=true">
      <i
        class="fas fa-pen mr-2"
        style="color: #009688"
        v-if="selectedToName"
      ></i
      >수정하기
    </div>
    <!-- <v-btn
      icon
      color="success"
      dark
      v-if="selectedToName"
      @click="dialog = true"
      ><i class="fas fa-pencil-alt"></i
    ></v-btn> -->
    <v-dialog
      width="800px"
      v-model="dialog"
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-card-title
          dark
          color="#7288da"
          style="background-color: #7288da; color: white"
        >
          폴더 수정
          <v-spacer></v-spacer>
          <v-btn class="" icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="file-scroller" style="height: 100%">
          <v-container>
            <div style="width: 100%; margin: auto">
              <div>
                <h2 class="mt-4">1. 폴더 선택</h2>
                <div class="text-right mb-1">
                  <v-btn @click="readDir" text color="green"
                    ><i class="fas fa-search mr-2"></i>폴더 찾기</v-btn
                  >
                  <v-dialog
                    class="file-scroller"
                    v-model="dialog3"
                    persistent
                    max-width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" text v-bind="attrs" v-on="on">
                        <i class="fas fa-folder-plus mr-2"></i>폴더 추가
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        정리할 폴더 내에 해당 폴더가 추가됩니다.
                      </v-card-title>
                      <v-card-text>
                        <div>
                          (같은 폴더명 존재 시, 해당 폴더에 정리됩니다.)
                        </div>
                      </v-card-text>
                      <v-card-text>
                        <v-text-field
                          v-model="readFromDirName"
                          :rules="[this.rules.required, this.rules.speical]"
                          label="새 폴더명 입력"
                        >
                        </v-text-field
                      ></v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="red darken-1"
                          text
                          @click="dialog3 = false"
                        >
                          취소
                        </v-btn>
                        <v-btn color="green darken-1" text @click="readFromDir">
                          추가
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>
                  <!--<BtnCreateGoogleFolder/>-->
                </div>
                <div class="ml-3 mb-3 font-weight-bold d-flex align-center">
                  <img
                    src="@/assets/folder-icon.png"
                    height="30px"
                    width="30px"
                    class="mr-2"
                  />
                  {{ directoryDir }}
                </div>
              </div>
              <v-divider></v-divider>
              <h2 class="my-4">2. 정리할 기준 추가</h2>
              <v-row>
                <v-col cols="4" class="pb-0">
                  <v-overflow-btn
                    class="my-2"
                    :items="filters"
                    label="정리 기준 선택"
                    dense
                    v-model="selectedFilter"
                  ></v-overflow-btn>
                </v-col>
                <v-col cols="8" class="pb-0">
                  <v-overflow-btn
                    v-show="selectedFilter === '파일 유형'"
                    class="my-2"
                    :items="typeTags"
                    label="파일 유형 분류"
                    dense
                    v-model="selectedType"
                    color="primary"
                  ></v-overflow-btn>
                  <v-overflow-btn
                    v-show="selectedFilter === '날짜'"
                    class="my-2"
                    :items="dateTags"
                    label="날짜 분류"
                    dense
                    v-model="selectedDate"
                  ></v-overflow-btn>
                </v-col>
              </v-row>
              <div
                id="type"
                v-show="
                  selectedFilter === '파일 유형' &&
                  selectedType === '확장자 직접 입력'
                "
              >
                <div>
                  <v-text-field
                    v-model="typeAddName"
                    label="확장자 직접 입력(ex. jpg, ppt)"
                    prepend-icon="mdi-pencil"
                    class="pt-0"
                    @keypress.enter="clickAddBtn"
                  >
                  </v-text-field>
                </div>
              </div>
              <div
                id="date"
                v-show="
                  selectedFilter === '날짜' &&
                  selectedDate === '날짜 범위 직접 선택'
                "
              >
                <div>
                  <v-dialog v-model="dialog2" max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="pt-0"
                        v-model="dateRangeText"
                        label="날짜 범위 직접 선택"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click="dates = []"
                      >
                      </v-text-field>
                    </template>
                    <v-date-picker
                      header-color="var(--color-purple)"
                      v-model="dates"
                      range
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="dialog2 = false">
                        Cancel
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </div>
              </div>
              <div id="name" v-show="selectedFilter === '파일명'">
                <div>
                  <v-text-field
                    v-model="titleAddName"
                    label="파일명에 포함되는 문자 입력"
                    class="pt-0"
                    prepend-icon="mdi-pencil"
                    @keypress.enter="clickAddBtn"
                  >
                  </v-text-field>
                </div>
              </div>
              <div class="text-right pb-5">
                <v-btn
                  v-show="
                    selectedFilter !== '' &&
                    ((selectedFilter === '파일 유형' && selectedType !== '') ||
                      (selectedFilter === '날짜' && selectedDate !== '') ||
                      selectedFilter === '파일명')
                  "
                  color="white"
                  class="text--primary"
                  fab
                  rounded
                  small
                  @click="clickAddBtn"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </div>
              <v-divider class="mb-10"></v-divider>
              <v-select
                v-show="selectedTotalTags.length > 0"
                v-model="selectedTotalTags"
                :items="totalTags"
                deletable-chips
                chips
                label="총 정리 기준"
                multiple
                outlined
                filled
              ></v-select>
              <div class="text-right">
                <v-btn dark color="#7288da" rounded @click="modifyLibrary">
                  폴더 수정
                </v-btn>
              </div>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";

const { dialog } = require("electron").remote;

import Swal from "sweetalert2";

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
const AppProps = Vue.extend({
  props: {
    propDirectory: Object,
  },
});

@Component({
  computed: mapState([
    "toLibraryList",
    "toLibraryNameList",
    "selectedToName",
    "dropToDir",
  ]),
  methods: mapMutations(["changeToLibraryList", "changeDropToDir"]),
})
export default class ModalAddToLibraryDirectory extends AppProps {
  // 이전 값 가져오기
  initalDirectory: ToLibraryDirectory = this.propDirectory;
  selectedTypeTags: string[] = this.initalDirectory.typeTags.slice();
  selectedDateTags: string[] = this.initalDirectory.dateTags.slice();
  selectedTitleTags: string[] = this.initalDirectory.titleTags.slice();
  selectedTotalTags: string[] = this.initalDirectory.typeTags.slice().concat(this.initalDirectory.dateTags.slice()).concat(this.initalDirectory.titleTags.slice());
  totalTags: string[] = this.initalDirectory.typeTags.slice().concat(this.initalDirectory.dateTags.slice()).concat(this.initalDirectory.titleTags.slice());
  directoryDir: string = this.initalDirectory.path;

  // data
  dates: string[] = [];
  libraryDirectories: ToLibraryDirectory[] = [];
  dialog: boolean = false;
  dialog2: boolean = false;
  dialog3: boolean = false;
  typeAddName: string = "";
  titleAddName: string = "";
  typeTags: string[] = [
    "#Image",
    "#Document",
    "#Video",
    "#Audio",
    "#Compressed",
    "확장자 직접 입력",
  ];
  dateTags: string[] = [
    "#Today",
    "#This week",
    "#This month",
    "#Every new file",
    "날짜 범위 직접 선택",
  ];
  titleTags: string[] = [];
  filters: string[] = ["파일 유형", "날짜", "파일명"];
  selectedFilter: string = "";
  readFromDirName: string = "";
  selectedType: string = "";
  selectedDate: string = "";
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
  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];
  selectedToName!: string;
  dropToDir!: string;
  changeDropToDir!: (dir: string) => void;
  changeToLibraryList!: (newList: ToLibrary[]) => void;

  titleAdd() {
    if (this.titleAddName === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "빈칸을 입력해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (this.dupCheckFilter(this.titleAddName)) {
      this.selectedTitleTags.push(this.titleAddName);
    }
    this.titleAddName = "";
    this.addInitialize();
  }
  dateAdd() {
    if (this.dates.length != 2) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "날짜를 선택해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (this.dupCheckFilter(this.dates[0] + "~" + this.dates[1])) {
      this.selectedDateTags.push(this.dates[0] + "~" + this.dates[1]);
    }
    this.dates = [];
    this.addInitialize();
  }
  typeAdd() {
    if (this.typeAddName === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "빈칸을 입력해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    let addName = this.typeAddName.toLowerCase();
    if (addName[0] != ".") {
      addName = "." + addName;
    }
    if (this.dupCheckFilter(addName)) {
      this.selectedTypeTags.push(addName);
    }
    this.typeAddName = "";
    this.addInitialize();
  }

  clickAddBtn() {
    if (
      this.selectedFilter === "" ||
      (this.selectedFilter === "파일 유형" && this.selectedType === "") ||
      (this.selectedFilter === "날짜" && this.selectedDate === "")
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "정리 기준을 선택해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    if (this.selectedFilter === "파일 유형") {
      if (this.selectedType === "확장자 직접 입력") {
        this.typeAdd();
      } else {
        if (this.dupCheckFilter(this.selectedType)) {
          this.selectedTypeTags.push(this.selectedType);
          this.addInitialize();
        }
      }
    } else if (this.selectedFilter === "날짜") {
      if (this.selectedDate === "날짜 범위 직접 선택") {
        this.dateAdd();
      } else {
        if (this.dupCheckFilter(this.selectedDate)) {
          this.selectedDateTags.push(this.selectedDate);
          this.addInitialize();
        }
      }
    } else if (this.selectedFilter === "파일명") {
      this.titleAdd();
    }
  }

  addInitialize() {
    this.selectedFilter = this.selectedType = this.selectedDate = "";
    this.titleAddName = this.typeAddName = "";
    this.dates = [];
  }

  dupCheckFilter(i) {
    if (this.totalTags.indexOf(i) !== -1) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "중복된 기준입니다",
        showConfirmButton: false,
        timer: 1000,
      });
      return false;
    }
    return true;
  }

  closeModal() {
    this.readFromDirName = "";
    this.selectedFilter = "";
    this.selectedType = this.selectedDate = this.titleAddName = this.typeAddName = "";
    this.dates = [];
    this.directoryDir = this.initalDirectory.path;
    this.dialog = false;
    this.$emit("closeMenu")
  }

  readDir() {
    this.directoryDir = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })[0];
  }

  modifyLibrary() {
    const tempLibraryList: ToLibrary[] = this.toLibraryList;

    for (let index1 = 0; index1 < this.toLibraryNameList.length; index1++) {
      if (tempLibraryList[index1].name == this.selectedToName) {
        for (
          let index2 = 0;
          index2 < tempLibraryList[index1].directories.length;
          index2++
        ) {
          if (
            tempLibraryList[index1].directories[index2].path ==
            this.initalDirectory.path
          ) {
            tempLibraryList[index1].directories[index2] = {
              path: this.directoryDir,
              typeTags: this.selectedTypeTags,
              dateTags: this.selectedDateTags,
              titleTags: this.selectedTitleTags,
            };
            this.changeToLibraryList(tempLibraryList);

            window.localStorage.setItem(
              "selectedFromData",
              JSON.stringify(tempLibraryList)
            );

            // this.libraryDirectories = [];
            // this.directoryDir = "";
            // this.selectedTypeTags = [];
            // this.selectedDateTags = [];
            // this.selectedTitleTags = [];
            Swal.fire({
              position: "center",
              icon: "success",
              title: "수정되었습니다",
              showConfirmButton: false,
              timer: 1000,
            });
            this.selectedFilter = "";
            this.selectedType = this.selectedDate = this.titleAddName = this.typeAddName = "";
            this.dates = [];
            this.dialog = false;
            this.$emit("closeMenu")
            return;
          }
        }
      }
    }
  }

  readFromDir() {
    if (
      this.readFromDirName.includes("|") ||
      this.readFromDirName.includes("\\") ||
      this.readFromDirName.includes("?") ||
      this.readFromDirName.includes("<") ||
      this.readFromDirName.includes(">") ||
      this.readFromDirName.includes("/") ||
      this.readFromDirName.includes(":") ||
      this.readFromDirName.includes('"')
    ) {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "특수문자는 사용하실 수 없습니다",
        showConfirmButton: false,
        timer: 1000,
      });

      return;
    }
    this.directoryDir = "%from%" + "\\" + this.readFromDirName;
    this.dialog3 = false
  }

  get dateRangeText() {
    return this.dates.join(" ~ ");
  }

  @Watch("dropToDir")
  watchDropToDir() {
    if (this.dropToDir != "") {
      this.directoryDir = this.dropToDir;
      this.dialog = true;
      this.changeDropToDir("");
    }
  }
  @Watch("selectedTypeTags")
  watchSelectedTypeTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }
  @Watch("selectedTitleTags")
  watchSelectedTitleTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }
  @Watch("dates")
  watchDates() {
    if (this.dates.length == 2) {
      const fromSelect = new Date(this.dates[0]);
      const toSelect = new Date(this.dates[1]);
      console.log(fromSelect.toDateString());
      console.log(typeof toSelect);
      if (fromSelect > toSelect) {
        [this.dates[0], this.dates[1]] = [this.dates[1], this.dates[0]];
      }
      this.dialog2 = false;
    }
  }

  @Watch("selectedDateTags")
  watchSelectedDateTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
    this.totalTags = this.selectedTypeTags.concat(
      this.selectedDateTags.concat(this.selectedTitleTags)
    );
  }

  @Watch("selectedTotalTags")
  watchSelectedTotalTags() {
    this.selectedTypeTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedTypeTags.indexOf(tag) > -1)
          this.selectedTypeTags.splice(this.selectedTypeTags.indexOf(tag), 1);
      }
    });
    this.selectedDateTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedDateTags.indexOf(tag) > -1)
          this.selectedDateTags.splice(this.selectedDateTags.indexOf(tag), 1);
      }
    });
    this.selectedTitleTags.forEach((tag) => {
      if (!this.selectedTotalTags.includes(tag)) {
        if (this.selectedTitleTags.indexOf(tag) > -1)
          this.selectedTitleTags.splice(this.selectedTitleTags.indexOf(tag), 1);
      }
    });
  }
}
</script>

<style>
header {
  height: 64px;
}

.add-folder {
  width: 100%;
  height: 100%;
  padding: 0;
  color: var(--color-purple);
}
</style>
