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
    <v-col cols="2" class="pl-0"><ModalAddToLibraryDirectory /></v-col>
    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedToName">
        {{ toLibrary.name }}
        <div v-for="directory in toLibrary.directories" :key="directory.path">
          {{ directory }}
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
interface ToLibrary {
  name: string;
  directories: object[];
}

@Component({
  components: { ModalCreateToLibrary, ModalAddToLibraryDirectory },
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations([
    "changeToLibraryList",
    "changeSelectedToName",
    "changeDorpToDir",
  ]),
})
export default class ListTo extends Vue {
  dropTo(event) {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log(f);
      if (this.selectedToName == "") {
        alert("라이브러리 먼저 선택 ㄱㄱ");
      } else {
        this.changeDorpToDir(f.path);
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
  toLibraryList!: object;
  toLibraryNameList!: object;
  changeToLibraryList!: (newList: ToLibrary[]) => void;
  changeSelectedToName!: (newName: string) => void;

  changeDorpToDir!: (dir: string) => void;

  @Watch("selectedToName")
  watchSelectedToName() {
    this.changeSelectedToName(this.selectedToName);
  }
}
</script>

<style>
</style>