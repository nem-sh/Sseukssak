<template>
  <v-col :class="partMode" class="position-p">
    <div :class="partTitleMode">
      <h4 class="text-center">1. 변경할 파일/폴더 선택</h4>
    </div>
    <div>
      <div class="font-weight-bold d-flex justify-end">
        <v-breadcrumbs :items="dirItems" class="pa-3">
          <template v-slot:divider>
            <v-icon>mdi-forward</v-icon>
          </template>
        </v-breadcrumbs>
        <v-btn icon @click="read()">
          <img class="mt-2" height="25px" src="@/assets/folder2.png" />
          <!-- <i class="far fa-folder-open fa-2x" :class="folderMode"></i> -->
        </v-btn>
      </div>
      <div v-show="this.renameFileList.length > 0">
        <v-checkbox
          v-model="selectCheck"
          color="#7288da"
          class="ma-0 pa-0"
          label="전체 선택"
        ></v-checkbox>
        <v-divider class="pb-3"></v-divider>
      </div>
    </div>
    <div
      v-if="renameFileList.length <= 0"
      align="center"
      class="position-c"
    >
      <lottie-player
        src="https://assets4.lottiefiles.com/packages/lf20_GlZGOi.json"
        background="transparent"
        speed="1"
        style="width: 330px; height: 330px;"
        loop
        autoplay
      ></lottie-player>
      <h3 class="mt-2">파일 및 폴더가 없습니다 :(</h3>
    </div>
    <div v-if="renameFileList.length <= 0" class="mb-15 pb-2"></div>
    <v-virtual-scroll
      class="file-scroller"
      :bench="benched"
      :items="renameFileList"
      height="300"
      max-height="300"
      item-height="40"
    >
      <template v-slot:default="{ item }">
        <v-checkbox
          class="my-0 text-next-line"
          @change="changeSelect"
          v-model="choiceList"
          :key="item.name"
          :value="item"
          color="#7288da"
        >
          <template v-slot:label>
            <div v-if="item.type" class="d-flex">
              <img
                height="20px"
                :src="item.icon"
                alt="icon"
                class="mr-1"
              /><span>{{ item.name }}</span>
            </div>
            <div v-else class="d-flex">
              <img
                height="20px"
                src="@/assets/folder-icon.png"
                alt="icon"
                class="mr-1"
              /><span>{{ item.name }}</span>
            </div>
          </template>
        </v-checkbox>
      </template>
    </v-virtual-scroll>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import path from "path";
import { mapMutations, mapState } from "vuex";
import { Watch } from "vue-property-decorator";
const { dialog } = require("electron").remote;
const { shell } = require("electron").remote;
const { app } = require("electron").remote;

import Swal from "sweetalert2";

interface FileInfo {
  name: string;
  path: string;
  ctime: Date;
  mtime: Date;
  type: string;
  dir: string;
  icon: string;
}

interface Breadcrumbs {
  text: string;
  disabled: boolean;
}

@Component({
  computed: mapState([
    "renameDir",
    "renameFileList",
    "beforeItems",
    "allSelect",
  ]),
  methods: mapMutations([
    "changeRenameDir",
    "changeAllSelect",
    "sortRenameFileList",
    "changeBeforeItems",
    "changePreview",
    "sortBeforeItems",
    "changeRenameFileList",
    "initailizeRename",
  ]),
})
export default class Rename extends Vue {
  dialog: boolean = false;
  benched: number = 0;
  choiceList: FileInfo[] = [];
  renameFileList!: FileInfo[];
  beforeItems!: FileInfo[];
  changeFilterBack!: (newFilterBack: string) => void;
  changeRenameFileList!: (item: FileInfo[]) => void;
  changeBeforeItems!: (item: FileInfo[]) => void;
  sortBeforeItems!: () => void;
  sortRenameFileList!: () => void;
  initailizeRename!: () => void;
  allSelect!: boolean;
  selectCheck: boolean = false;
  renameDir!: string;
  changeAllSelect!: () => void;
  changeRenameDir!: (newDir: string) => void;

  get partTitleMode() {
    return this.$vuetify.theme.dark ? "part-title-d" : "part-title";
  }
  get partMode() {
    return this.$vuetify.theme.dark ? "rename-part-bg-d" : "rename-part-bg";
  }
  get folderMode() {
    return this.$vuetify.theme.dark ? "folder-d" : "folder";
  }

  get dirItems() {
    const dirs = this.renameDir.split("\\");
    const item: Breadcrumbs[] = [];
    dirs.forEach((dir) => {
      item.push({
        text: dir,
        disabled: true,
      });
    });
    return item;
  }

  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;
    const dir = rs[0];
    try {
      const files = fs.readdirSync(dir);
      this.choiceList = [];
      this.selectCheck = false;
      const tmpFileList: FileInfo[] = [];
      for (const v of files) {
        const p = path.join(dir, v);
        const stat = fs.lstatSync(p);
        // 확장자
        let _fileType = "";
        if (!stat.isDirectory()) {
          const tmp = v.split(".");
          _fileType = tmp[tmp.length - 1].toLowerCase();
        }
        const item = {
          name: v,
          path: p,
          ctime: stat.birthtime,
          mtime: stat.mtime,
          type: _fileType,
          dir: dir,
          icon: "",
        };
        // 파일 아이콘
        let iconPath = dir + "/" + v;
        if (v.includes(".lnk")) {
          try {
            iconPath = shell.readShortcutLink(iconPath).target;
          } catch {
            iconPath = dir + "/" + v;
          }
        }
        let realIcon = "";
        app.getFileIcon(iconPath).then((fileIcon) => {
          realIcon = fileIcon.toDataURL();
          item["icon"] = realIcon;
        });
        tmpFileList.push(item);
      }
      this.changeRenameDir(dir);
      await this.changeRenameFileList(tmpFileList);
      await this.changeBeforeItems([]);
      await this.sortRenameFileList();
    } catch {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "해당 폴더에 접근 권한이 없습니다",
        showConfirmButton: false,
        timer: 1000,
      });
      return
    }
  }
  changeSelect() {
    this.changeBeforeItems(this.choiceList);
    this.sortBeforeItems();
  }
  mounted() {
    this.choiceList = this.beforeItems;
    this.selectCheck = this.allSelect;
  }

  @Watch("selectCheck")
  watchAllSelect() {
    if (this.selectCheck === true) {
      this.choiceList = this.renameFileList;
    } else {
      this.choiceList = [];
    }
    this.changeBeforeItems(this.choiceList);
    this.changeAllSelect();
  }
}
</script>
<style>
.position-p {
  position: relative;
}
.position-c {
  position:absolute; 
  top:50%; 
  left:50%; 
  transform: translate(-50%, -50%);
}
</style>