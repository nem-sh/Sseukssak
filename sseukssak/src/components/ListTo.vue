<template>
  <v-container
    style="padding-bottom: 0"
    @drop="dropTo"
    dragenter.prevent
    @dragover.prevent
  >
    <div class="to-part-first">
      <div class="select-folder">
        <v-row>
          <v-col cols="3" class="to-name">
            <h3><span>To</span></h3></v-col
          >
          <v-col cols="9" align="center" justify="center">
            <v-select
              :items="toLibraryNameList"
              v-model="selectedToName"
              label="Select Library"
              dense
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="pr-3 d-flex flex-row-reverse">
          <ModalCreateToLibrary />
          <div class="mr-2">
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
        </v-row>
      </div>
    </div>
    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedToName" class="to-part-second">
        <v-virtual-scroll
          :items="toLibrary.directories"
          height="380"
          item-height="84"
        >
          <template v-slot:default="{ item }">
            <v-list-item link :key="item.path" @click="openShell(item.path)">
              <v-list-item-action>
                <img
                  src="@/assets/folder-icon.png"
                  alt=""
                  height="60px"
                  width="60px"
                />
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  <strong>{{ getDirectoryName(item.path) }}</strong>
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-row align="center" justify="center" class="pa-0">
                  <v-col cols="4" class="pa-0">
                    <ModalCheckDirectoryTags />
                  </v-col>
                  <v-col cols="4" class="pa-0"
                    ><ModalModifyToLibraryDirectory :propDirectory="item"
                  /></v-col>
                  <v-col cols="4" class="pa-0"
                    ><v-btn
                      icon
                      color="error"
                      @click="deleteToLibraryDirectory(item.path)"
                    >
                      <i class="fas fa-trash-alt"></i></v-btn
                  ></v-col>
                </v-row>
              </v-list-item-action>
            </v-list-item>
            <v-divider></v-divider>
          </template>
        </v-virtual-scroll>
        <!-- <div v-for="directory in toLibrary.directories" :key="directory.path">
          {{ directory }}
          <ModalModifyToLibraryDirectory :propDirectory="directory" />
          <v-btn
            icon
            color="red"
            @click="deleteToLibraryDirectory(directory.path)"
          >
            디렉토리<v-icon>mdi-minus</v-icon>
          </v-btn>
        </div> -->
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
      <h3 class="mt-3">라이브러리를 선택해주세요</h3>
      <div style="font-size: 12px" class="mt-2">
        나만의 라이브러리를 만들어 사용해보세요!
      </div>
    </div>
    <div v-if="selectedToName" class="to-part-third">
      <div align="right">
        <ModalAddToLibraryDirectory v-if="selectedToName" />
      </div>
    </div>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import ModalCreateToLibrary from "@/components/ModalCreateToLibrary.vue";
import ModalAddToLibraryDirectory from "@/components/ModalAddToLibraryDirectory.vue";
import ModalModifyToLibraryDirectory from "@/components/ModalModifyToLibraryDirectory.vue";
import ModalCheckDirectoryTags from "@/components/ModalCheckDirectoryTags.vue";

import { shell } from "electron";
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
    ModalCheckDirectoryTags,
  },
  computed: mapState(["toLibraryList", "toLibraryNameList", "fromDir"]),
  methods: mapMutations([
    "changeToLibraryList",
    "changeSelectedToName",
    "changeDropToDir",
  ]),
})
export default class ListTo extends Vue {
  openShell(path: string) {
    let newPath = path;
    if (path.includes("%from%")) {
      if (this.fromDir) {
        newPath = path.replace("%from%", this.fromDir);
      } else {
        alert("이 폴더를 열기 위해선 from을 먼저 지정해주세요!");
      }
    }
    if (!fs.existsSync(newPath)) {
      fs.mkdirSync(newPath);
    }
    shell.openPath(newPath);
  }
  deleteToLibraryDirectory(directoryPath) {
    const tempToLibraryList = this.toLibraryList;
    for (let index1 = 0; index1 < tempToLibraryList.length; index1++) {
      if (tempToLibraryList[index1].name == this.selectedToName) {
        for (
          let index2 = 0;
          index2 < tempToLibraryList[index1].directories.length;
          index2++
        ) {
          if (
            tempToLibraryList[index1].directories[index2].path == directoryPath
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
  deleteToLibrary() {
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
  dropTo(event) {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log(f);
      if (this.selectedToName == "") {
        alert("라이브러리 먼저 선택 ㄱㄱ");
      } else {
        this.changeDropToDir(f.path);
      }
    }
  }
  created() {
    const mySettings = window.localStorage.getItem("selectedFromData"); // 로컬스토리지에서 해당 key 이름으로 되어있는 value 값 불러오기
    let mySettingObj: ToLibrary[] = [];
    if (!mySettings) {
      // 해당 키의 데이터가 없다면 - 최초 사용 시에만 이 필터에 걸릴 것
      const SerializedData = JSON.stringify([]); // 로컬스토리지는 string 값만 저장할 수 있기 때문에 이 절차가 필요함
      window.localStorage.setItem("selectedFromData", SerializedData); // 앞에가 key, 뒤에가 value로 저장됨
    } else {
      mySettingObj = JSON.parse(mySettings);
    }

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
  selectedToName: string = "";
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];
  changeToLibraryList!: (newList: ToLibrary[]) => void;
  changeSelectedToName!: (newName: string) => void;
  changeDropToDir!: (dir: string) => void;

  dirLength: number = 0;
  selectedDir!: ToLibraryDirectory[];
  fromDir!: string;
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

  @Watch("selectedToName")
  watchSelectedToName() {
    this.changeSelectedToName(this.selectedToName);
    this.changeDirectoryLength(this.selectedToName);
  }
}
</script>

<style>
.to-name h3 {
  /* margin: 20px; */
  font-family: "Paytone One" !important;
  color: #202020;
  text-transform: uppercase;
  letter-spacing: -2px;
}

.to-name h3 span {
  display: block;
  margin: 0 0 17px 10px;
  font-size: 40px;
  line-height: 40px;
  color: #7288da;
  text-shadow: 0 13.36px 8.896px #c4b59d, 0 -2px 1px #fff;
  letter-spacing: -4px;
}

.to-part-first {
  padding-top: 28px;
  width: 100%;
  height: 25%;
}

.to-part-second {
  width: 100%;
  height: 70%;
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
</style>
