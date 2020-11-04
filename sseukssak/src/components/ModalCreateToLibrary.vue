<template>
  <div class="pl-0">
    <v-btn color="#7288da" rounded dark @click="dialog = true">추가</v-btn>
    <v-dialog
      v-model="dialog"
      max-width="400"
    >
      <v-card>
        <v-card-title dark color="#7288da" style="background-color:#7288da; color:white">
          새로운 라이브러리 생성
          <v-spacer></v-spacer>
          <v-btn
            color="white"
            class="text--primary"
            fab
            small
            @click="createLibrary"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text class="pt-4">
          <div>
            <v-text-field label="라이브러리 이름" v-model="libraryTitle">
            </v-text-field>
          </div>
        </v-card-text>
        <v-divider></v-divider>
        <div class="text-right">
          <v-btn text color="primary" @click="dialog2=true">정리 폴더 추가</v-btn>
        </div>
        <div class="mt-10 pb-15" v-show="libraryDirectories.length <= 0">
          <v-img class="mx-auto" src="@/assets/empty.png" width="40%"></v-img>
        </div>
        <v-dialog v-model="dialog2" max-width="700px">
          <v-card class="px-5 py-5">
            <ModalTagSelect @addDirectory="addDirectory"/>
          </v-card>
        </v-dialog>
        <v-virtual-scroll
          class="file-scroller"
          v-show="libraryDirectories.length > 0"
          :items="libraryDirectories"
          item-height="120"
          height="300"
        >
          <template v-slot:default="{ item }">
            <v-list-item class="mx-3 my-2">
              <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                  <div class="d-flex flex-column" v-bind="attrs" v-on="on">
                    <img
                      src="@/assets/folder-icon.png"
                      alt="folder-icon"
                      height="50px"
                      width="50px"
                    />
                    <v-list-item-title class="font-weight-bold">
                      {{ folderName(item.path, true) }}
                    </v-list-item-title>
                  </div>
                </template>
                <span>{{ folderName(item.path, false) }}</span>
              </v-tooltip>
              <span class="mx-auto pt-2 text-center" v-show="item.typeTags.length <= 0 && item.titleTags.length <= 0 && item.dateTags.length <= 0">
                <img
                  class="mx-auto"
                  src="@/assets/nothing.png"
                  alt="empty-icon"
                  height="30px"
                  width="30px"
                />
                <p class="font-weight-bold mb-0">설정된 태그가 없습니다</p>
              </span>
              <div class="file-scroller ml-5">
                <span v-for="tag in tagList(item)" :key="tag">
                  <v-chip
                    class="ma-1"
                    style="height:20px;"
                  >
                    <v-avatar left>
                      <v-icon color="white">mdi-label</v-icon>
                    </v-avatar>
                    <span class="font-weight-bold">{{ tag }}</span>
                  </v-chip>
                </span>
              </div>
            </v-list-item>
            <v-divider inset></v-divider>
          </template>
        </v-virtual-scroll>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
import Swal from "sweetalert2"

import ModalTagSelect from "@/components/ModalTagSelect.vue"


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
  components: {ModalTagSelect},
})
export default class ModalCreateToLibrary extends Vue {
  // data
  libraryDirectories: ToLibraryDirectory[] = [];
  libraryTitle: string = "";
  dialog: boolean = false;
  dialog2: boolean = false;

  //vuex
  toLibraryList!: ToLibrary[];
  toLibraryNameList!: string[];

  changeToLibraryList!: (newList: ToLibrary[]) => void;

  clickAlert() {
    alert("click");
  }

  closeModal() {
    this.libraryTitle = "";
    this.libraryDirectories = [];
    this.dialog = false;
  }


  addDirectory(data) {
    this.libraryDirectories.push(data)
    this.dialog2 = false
  }

  createLibrary() {
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

  folderName(path, flag) {
    const paths = path.split("\\");
    if (paths[paths.length - 1].length > 5 && flag === true) {
      return paths[paths.length - 1].slice(0, 5) + "..."
    } else {
      return paths[paths.length - 1]
    }
  }

  tagList(item) {
    return item.typeTags.concat(item.dateTags.concat(item.titleTags))
  }
}
</script>

<style>
header {
  height: 64px;
}
</style>
