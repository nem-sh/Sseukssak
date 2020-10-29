<template>
  <v-container class="pl-0">
    <v-btn icon color="green" dark v-if="selectedToName" @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
      width="500px"
      v-model="dialog"
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat dark color="primary">
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>새로운 디렉토리 추가</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="createLibrary"> 생성 </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text style="height: 100%">
          <v-container>
            <div style="width: 100%; margin: auto">
              <div id="type">
                <v-btn @click="readDir"> 폴더 찾기 </v-btn>{{ directoryDir }}
                <v-select
                  v-model="selectedTypeTags"
                  :items="typeTags"
                  deletable-chips
                  chips
                  color="red"
                  item-color="red"
                  label="파일 타입"
                  multiple
                  outlined
                ></v-select>
                <div style="width: 50%; margin-left: auto">
                  <v-text-field v-model="typeAddName" label="확장자 직접입력">
                    <v-icon slot="append" color="green" @click="typeAdd">
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
              </div>
              <div id="date">
                <v-select
                  v-model="selectedDateTags"
                  :items="dateTags"
                  deletable-chips
                  chips
                  label="날짜"
                  multiple
                  outlined
                >
                </v-select>
                <div style="width: 60%; margin-left: auto">
                  <v-dialog v-model="dialog2" persistent max-width="290">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="dateRangeText"
                        label="Date range 직접입력"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click="dates = []"
                        ><v-icon slot="append" color="green" @click="dateAdd">
                          mdi-plus
                        </v-icon></v-text-field
                      >
                    </template>
                    <v-date-picker v-model="dates" range></v-date-picker>
                  </v-dialog>
                </div>
                <div style="width: 60%; margin-left: auto"></div>
              </div>
              <div id="name">
                <v-select
                  v-model="selectedTitleTags"
                  :items="titleTags"
                  deletable-chips
                  chips
                  label="파일 이름"
                  multiple
                  outlined
                ></v-select>
                <div style="width: 60%; margin-left: auto">
                  <v-text-field v-model="titleAddName" label="파일 이름 입력">
                    <v-icon slot="append" color="green" @click="titleAdd">
                      mdi-plus
                    </v-icon>
                  </v-text-field>
                </div>
              </div>
              <v-select
                v-model="selectedTotalTags"
                :items="totalTags"
                deletable-chips
                chips
                label="선택된 태그들"
                multiple
                outlined
              ></v-select>
            </div>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";

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

  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];
  selectedToName!: string;
  dropToDir!: string;
  changeDropToDir!: (dir: string) => void;
  changeToLibraryList!: (newList: ToLibrary[]) => void;

  clickAlert() {
    alert("click");
  }
  titleAdd() {
    this.selectedTitleTags.push(this.titleAddName);
    this.titleTags.push(this.titleAddName);
    this.titleAddName = "";
  }
  dateAdd() {
    if (this.dates.length != 2) {
      alert("날짜를 먼저 선택하거라");
      return;
    }
    this.selectedDateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dateTags.push(this.dates[0] + "~" + this.dates[1]);
    this.dates = [];
  }
  typeAdd() {
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

    this.dialog = false;
  }
  readDir() {
    this.directoryDir = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    })[0];
  }

  createLibrary() {
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

    alert("추가되었습니다.");

    this.dialog = false;
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
</style>
