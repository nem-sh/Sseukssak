<template>
  <v-col cols="4" :class="partMode">
    <div :class="partTitleMode">
      <h4 class="text-center">1. 변경할 파일들 선택</h4>
    </div>
    <div class="text-right mt-2">
        <v-btn icon @click="read()">
          <i class="far fa-folder-open fa-2x" :class="folderMode"></i>
        </v-btn>
    </div>
    <p class="text-center" v-show="renameFileList.length <= 0">
        폴더를 선택해주세요 :)
    </p>
    <v-virtual-scroll
      :bench="benched"
      :items="renameFileList"
      height="120"
      item-height="40"
    >
      <template v-slot:default="{ item }">
        <v-checkbox
          class="my-0 text-next-line"
          @change="changeSelect"
          v-model="choiceList"
          :key="item.name"
          :label="item.name"
          :value="item"
          color="#7288da"
        ></v-checkbox>
      </template>
    </v-virtual-scroll>
  </v-col>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import path from "path";
import { mapMutations, mapState } from 'vuex';
const { dialog } = require("electron").remote;

interface FileInfo {
  name: string;
  path: string;
  ctime: Date;
  mtime: Date;
  type: string;
  dir: string;
}

@Component({
  computed: mapState(["renameFileList", "beforeItems"]),
  methods: mapMutations(["changeBeforeItems", "changePreview", "sortBeforeItems", "changeRenameFileList", "initailizeRename"])
})

export default class Rename extends Vue {
  dialog: boolean = false;
  benched: number = 0;
  choiceList: FileInfo[] = [];
  renameFileList!: FileInfo[];
  beforeItems!: FileInfo[];
  changeFilterBack!: (newFilterBack: string) => void;
  changeRenameFileList!: (item: FileInfo) => void;
  changeBeforeItems!: (item: FileInfo[]) => void;
  sortBeforeItems!: () => void;
  initailizeRename!: () => void;

  get partTitleMode() {
    return this.$vuetify.theme.dark? "part-title-d" : "part-title"
  }
  get partMode() {
    return this.$vuetify.theme.dark? "rename-part-bg-d" : "rename-part-bg"
  }
  get folderMode() {
    return this.$vuetify.theme.dark? "folder-d" : "folder"
  }

  async read() {
    const rs = dialog.showOpenDialogSync({
      properties: ["openDirectory"],
    });
    if (!rs) return;
    const dir = rs[0]
    const files = fs.readdirSync(dir);
    if (!files.length) return;
    this.choiceList = [];
    this.initailizeRename();
    for (const v of files) {
      const p = path.join(dir, v);
      const stat = fs.lstatSync(p);
      // 확장자
      let _fileType = ""
      if (!stat.isDirectory()) {
        const tmp = v.split(".")
        _fileType = tmp[tmp.length - 1].toLowerCase();
      }
      const item = {
        name: v,
        path: p,
        ctime: stat.birthtime,
        mtime: stat.mtime,
        type: _fileType,
        dir: dir,
      };
      await this.changeRenameFileList(item);
    }
    await this.changeBeforeItems([])
  }
  changeSelect() {
    this.changeBeforeItems(this.choiceList)
    this.sortBeforeItems()
  }
  mounted() {
    this.choiceList = this.beforeItems
  }
}
</script>