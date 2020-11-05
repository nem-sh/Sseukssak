<template>
  <div class="add-folder">
    <div v-if="selectedToName" @click="dialog = true">
      <i class="far fa-plus mx-3"></i>폴더 추가
    </div>
    <v-dialog
      width="700px"
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
          <v-btn class="mr-3" icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          정리 폴더 추가
          <v-spacer></v-spacer>
        </v-card-title>

        <v-card-text class="file-scroller" style="height: 100%">
          <v-container>
            <div style="width: 100%; margin: auto">
              <div>
                <h2 class="mt-4">1. 정리 폴더 선택</h2>
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
                        <i class="fas fa-folder-plus mr-2"></i>From 경로에 자동
                        폴더 생성
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        메인 From 경로에 자동 폴더 생성
                        <!-- <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <i style="color:grey" v-bind="attrs" v-on="on" class="far fa-question-circle fa-2x"></i>
                        </template>
                        <span>정리 버튼을 누르면, From 경로에 해당 폴더가 자동 생성됩니다.(같은 폴더명 존재 시, 해당 폴더에 정리됩니다.)</span>
                      </v-tooltip> -->
                      </v-card-title>
                      <v-card-text>
                        <div>
                          정리 버튼을 누르면, From 경로에 해당 폴더가 자동
                          생성됩니다.
                        </div>
                        <div>
                          (같은 폴더명 존재 시, 해당 폴더에 정리됩니다.)
                        </div>
                      </v-card-text>
                      <v-card-text>
                        <v-text-field
                          v-model="readFromDirName"
                          label="새 폴더명 입력"
                        >
                        </v-text-field
                      ></v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green darken-1"
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
                </div>
                <div class="ml-3 mb-3 font-weight-bold d-flex align-center">
                  <img
                    v-show="directoryDir.length > 0"
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
                <v-col cols="6">
                  <v-overflow-btn
                    class="my-2"
                    :items="filters"
                    label="정리 기준 선택"
                    dense
                    v-model="selectedFilter"
                  ></v-overflow-btn>
                </v-col>
              </v-row>
              <div id="type" v-show="selectedFilter === '파일 유형'">
                <div style="width: 80%; margin-left: auto">
                  <v-text-field
                    v-model="typeAddName"
                    label="확장자 직접 입력(ex. jpg, ppt)"
                    prepend-icon="mdi-pencil"
                    class="pt-0"
                  >
                    <v-icon slot="append" color="green" @click="typeAdd">
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
                <v-select
                  v-model="selectedTypeTags"
                  :items="typeTags"
                  deletable-chips
                  chips
                  color="red"
                  item-color="red"
                  label="파일 유형 선택"
                  multiple
                  outlined
                ></v-select>
              </div>
              <div id="date" v-show="selectedFilter === '날짜'">
                <div style="width: 80%; margin-left: auto">
                  <v-dialog v-model="dialog2" persistent max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        class="pt-0"
                        v-model="dateRangeText"
                        label="Date range 직접 입력"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click="dates = []"
                        ><v-icon slot="append" color="green" @click="dateAdd">
                          mdi-plus
                        </v-icon>
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
                <v-select
                  v-model="selectedDateTags"
                  :items="dateTags"
                  deletable-chips
                  chips
                  label="날짜 분류 선택"
                  multiple
                  outlined
                >
                </v-select>
              </div>
              <div id="name" v-show="selectedFilter === '파일명'">
                <div style="width: 100%; margin-left: auto">
                  <v-text-field
                    v-model="titleAddName"
                    label="파일명 직접 입력"
                    class="pt-0"
                    prepend-icon="mdi-pencil"
                  >
                    <v-icon slot="append" color="green" @click="titleAdd">
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
                <!-- <v-select
                  v-model="selectedTitleTags"
                  :items="titleTags"
                  deletable-chips
                  chips
                  label="파일 이름"
                  multiple
                  outlined
                ></v-select> -->
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
              ></v-select>
              <div class="text-center">
                <v-btn dark color="#7288da" @click="createLibrary">
                  정리 폴더 추가
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
import Swal from "sweetalert2";

const { dialog } = require("electron").remote;

interface ToLibrary {
  name: string;
  directories: object[];
}

interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
  titleTags: string[];
}

@Component({
  computed: mapState([
    "toLibraryList",
    "toLibraryNameList",
    "selectedToName",
    "dropToDir",
  ]),
  methods: mapMutations(["changeToLibraryList", "changeDropToDir"]),
})
export default class ModalAddToLibraryDirectory extends Vue {
  // data
  dates: string[] = [];
  selectedTypeTags: string[] = [];
  selectedDateTags: string[] = [];
  totalTags: string[] = [];
  selectedTotalTags: string[] = [];
  libraryDirectories: ToLibraryDirectory[] = [];

  directoryDir: string = "";
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
  ];
  dateTags: string[] = [
    "#Today",
    "#This week",
    "#This month",
    "#Every new file",
  ];
  titleTags: string[] = [];
  selectedTitleTags: string[] = [];
  filters: string[] = ["파일 유형", "날짜", "파일명"];
  selectedFilter: string = "";
  readFromDirName: string = "";

  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];
  selectedToName!: string;
  dropToDir!: string;
  changeDropToDir!: (dir: string) => void;
  changeToLibraryList!: (newList: ToLibrary[]) => void;

  titleAdd() {
    if (this.titleAddName === "") {
      return;
    }
    this.selectedTitleTags.push(this.titleAddName);
    this.titleTags.push(this.titleAddName);
    this.titleAddName = "";
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
    this.selectedDateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dates = [];
  }
  typeAdd() {
    if (this.typeAddName === "") {
      return;
    }
    let addName = this.typeAddName.toLowerCase();
    if (addName[0] != ".") {
      addName = "." + addName;
    }
    this.selectedTypeTags.push(addName);
    this.typeTags.push(addName);
    this.typeAddName = "";
  }
  closeModal() {
    this.libraryDirectories = [];
    this.directoryDir = "";
    this.selectedTypeTags = [];
    this.selectedDateTags = [];
    this.readFromDirName = "";
    this.directoryDir = "";
    this.selectedFilter = "";
    this.dialog = false;
  }
  readDir() {
    this.directoryDir = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })[0];
  }

  createLibrary() {
    if (this.directoryDir.trim() === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "폴더를 지정해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
    } else {
      const tempLibraryList: ToLibrary[] = this.toLibraryList;

      for (let index = 0; index < this.toLibraryNameList.length; index++) {
        if (tempLibraryList[index].name == this.selectedToName) {
          tempLibraryList[index].directories.push({
            path: this.directoryDir,
            typeTags: this.selectedTypeTags,
            dateTags: this.selectedDateTags,
            titleTags: this.selectedTitleTags,
          });
          break;
        }
      }

      this.changeToLibraryList(tempLibraryList);

      window.localStorage.setItem(
        "selectedFromData",
        JSON.stringify(tempLibraryList)
      );

      this.libraryDirectories = [];
      this.directoryDir = "";
      this.selectedTypeTags = [];
      this.selectedDateTags = [];
      this.selectedTitleTags = [];
      this.readFromDirName = "";
      this.directoryDir = "";
      this.selectedFilter = "";

      Swal.fire({
        position: "center",
        icon: "success",
        title: "추가되었습니다",
        showConfirmButton: false,
        timer: 1000,
      });

      this.dialog = false;
    }
  }

  readFromDir() {
    this.directoryDir = "%from%" + "\\" + this.readFromDirName;
    this.dialog3 = false;
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
