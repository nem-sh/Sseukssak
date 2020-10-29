<template>
  <v-container class="pl-0">
    <v-btn icon color="green" dark @click="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
      scrollable
    >
      <v-card tile>
        <v-toolbar flat dark color="primary">
          <v-btn icon dark @click="closeModal">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>새로운 라이브러리</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="createLibrary"> 생성 </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text style="height: 100%">
          <v-container>
            <div style="width: 80%; margin: auto">
              <div style="width: 60%">
                <v-text-field label="라이브러리 이름" v-model="libraryTitle">
                </v-text-field>
              </div>
              <div>
                {{ libraryDirectories }}
              </div>

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
                ></v-select>
                <div style="width: 50%; margin-left: auto">
                  <v-text-field label="날짜 직접입력">
                    <v-icon slot="append" color="green" @click="clickAlert">
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
            <div>
              <v-btn color="green" dark @click="addDirectory">
                새로운 디렉토리 추가<v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-container>
        </v-card-text>

        <div style="flex: 1 1 auto"></div>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
import fs from "fs";

const { dialog } = require("electron").remote;

interface ToLibrary {
  name: string;
  directories: object[];
}

interface ToLibraryDirectory {
  path: string;
  typeTags: string[];
  dateTags: string[];
}

@Component({
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations(["changeToLibraryList"]),
})
export default class ModalCreateToLibrary extends Vue {
  // data
  selectedTypeTags: string[] = [];
  selectedDateTags: string[] = [];
  totalTags: string[] = [];
  selectedTotalTags: string[] = [];
  libraryDirectories: ToLibraryDirectory[] = [];
  libraryTitle: string = "";
  directoryDir: string = "";
  dialog: boolean = false;
  typeAddName: string = "";
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
  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];

  changeToLibraryList!: (newList: ToLibrary[]) => void;

  clickAlert() {
    alert("click");
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
    this.libraryTitle = "";
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

  addDirectory() {
    this.libraryDirectories.push({
      path: this.directoryDir,
      typeTags: this.selectedTypeTags,
      dateTags: this.selectedDateTags,
    });
    this.directoryDir = "";
    this.selectedTypeTags = [];
    this.selectedDateTags = [];
  }

  createLibrary() {
    const tempLibraryList: ToLibrary[] = this.toLibraryList;

    for (let index = 0; index < this.toLibraryNameList.length; index++) {
      if (this.toLibraryNameList[index] == this.libraryTitle) {
        alert("중복된 이름이 있습니다.");
        return;
      }
    }

    tempLibraryList.push({
      name: this.libraryTitle,
      directories: this.libraryDirectories,
    });

    this.changeToLibraryList(tempLibraryList);
    fs.writeFileSync(
      "C:/Users/multicampus/Desktop/selectedFromData.txt",
      JSON.stringify(tempLibraryList)
    );

    this.libraryTitle = "";
    this.libraryDirectories = [];
    this.directoryDir = "";
    this.selectedTypeTags = [];
    this.selectedDateTags = [];

    alert("추가되었습니다.");

    this.dialog = false;
  }

  @Watch("selectedTypeTags")
  watchSelectedTypeTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags
    );
    this.totalTags = this.selectedTypeTags.concat(this.selectedDateTags);
  }

  @Watch("selectedDateTags")
  watchSelectedDateTags() {
    this.selectedTotalTags = this.selectedTypeTags.concat(
      this.selectedDateTags
    );
    this.totalTags = this.selectedTypeTags.concat(this.selectedDateTags);
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
  }
}
</script>

<style>
header {
  height: 64px;
}
</style>
