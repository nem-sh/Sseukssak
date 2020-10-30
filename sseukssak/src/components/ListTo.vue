<template>
  <v-container @drop="dropTo" dragenter.prevent @dragover.prevent>
    <v-row>
      <v-col cols="10" class="pr-0" style="display: flex; align-items: center">
        <v-select
          :items="toLibraryNameList"
          v-model="selectedToName"
          label="Select Library"
          dense
        ></v-select>
      </v-col>
      <v-col cols="2" class="pl-0"><ModalCreateToLibrary /></v-col>
    </v-row>
    <v-col
      ><v-btn color="red" v-if="selectedToName" @click="deleteToLibrary">
        라이브러리 지우기
      </v-btn>
    </v-col>

    <v-col cols="2" class="pl-0"><ModalAddToLibraryDirectory /></v-col>
    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedToName">
        {{ toLibrary.name }}
        <div v-for="directory in toLibrary.directories" :key="directory.path">
          {{ directory }}

          <ModalModifyToLibraryDirectory :propDirectory="directory" />
          <v-btn
            icon
            color="red"
            @click="deleteToLibraryDirectory(directory.path)"
          >
            디렉토리<v-icon>mdi-minus</v-icon>
          </v-btn>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
// import fs from "fs";
import { mapMutations, mapState } from "vuex";
import ModalCreateToLibrary from "@/components/ModalCreateToLibrary.vue";
import ModalAddToLibraryDirectory from "@/components/ModalAddToLibraryDirectory.vue";
import ModalModifyToLibraryDirectory from "@/components/ModalModifyToLibraryDirectory.vue";
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
  },
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations([
    "changeToLibraryList",
    "changeSelectedToName",
    "changeDropToDir",
  ]),
})
export default class ListTo extends Vue {
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

  @Watch("selectedToName")
  watchSelectedToName() {
    this.changeSelectedToName(this.selectedToName);
  }
}
</script>

<style>
</style>