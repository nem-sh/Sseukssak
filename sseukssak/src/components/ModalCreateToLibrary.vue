<template>
  <div class="pl-0">
    <v-btn color="#7288da" rounded dark @click="dialog = true">추가</v-btn>
    <v-dialog v-model="dialog" max-width="400">
      <v-card>
        <v-card-title
          class="pr-3"
          dark
          color="#7288da"
          style="background-color: #7288da; color: white"
        >
          새로운 정리 그룹 추가
          <v-spacer></v-spacer>
          <v-btn class="pr-0" text color="white" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <div>
            <v-text-field
              :rules="rules"
              @keypress.enter="createLibrary"
              label="정리 그룹명"
              v-model="libraryTitle"
            >
            </v-text-field>
            <div class="text-right">
              <v-btn color="#7288da" rounded dark @click="createLibrary">
                추가
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
import Swal from "sweetalert2";

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
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations(["changeToLibraryList"]),
})
export default class ModalCreateToLibrary extends Vue {
  // data
  libraryDirectories: ToLibraryDirectory[] = [];
  libraryTitle: string = "";
  dialog: boolean = false;

  rules: object = [(v) => !!v || "It is required"];

  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];

  changeToLibraryList!: (newList: ToLibrary[]) => void;

  closeModal() {
    this.libraryTitle = "";
    this.libraryDirectories = [];
    this.dialog = false;
  }

  createLibrary() {
    if (this.libraryTitle === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "정리 규칙명을 입력해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    }
    const tempLibraryList: ToLibrary[] = this.toLibraryList;

    for (let index = 0; index < this.toLibraryNameList.length; index++) {
      if (this.toLibraryNameList[index] == this.libraryTitle) {
        Swal.fire({
          position: "center",
          icon: "warning",
          title: "중복된 이름이 있습니다",
          showConfirmButton: false,
          timer: 1000,
        });
        return;
      }
    }
    tempLibraryList.push({
      name: this.libraryTitle,
      directories: this.libraryDirectories,
    });

    this.changeToLibraryList(tempLibraryList);
    // fs.writeFileSync(
    //   "C:/Users/multicampus/Desktop/selectedFromData.txt",
    //   JSON.stringify(tempLibraryList)
    // );

    window.localStorage.setItem(
      "selectedFromData",
      JSON.stringify(tempLibraryList)
    );

    this.$emit("create", this.libraryTitle);
    this.libraryTitle = "";
    this.libraryDirectories = [];
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
</script>

<style>
header {
  height: 64px;
}
</style>
