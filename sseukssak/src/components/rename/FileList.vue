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
          :value="item"
          color="#7288da"
        >
        <template v-slot:label>
          <img height="20px" :src="fileIcon(item.type)"/>{{item.name}}
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
  fileType: object = {
    "Document": [
      "ppt",
      "pptx",
      "doc",
      "docx",
      "xls",
      "pdf",
      "ai",
      "pad",
      "hwp",
      "txt",
      "md",
    ],
    "Image": [
      "jpg",
      "jpeg",
      "jpe",
      "gif",
      "png",
      "bmp",
      "rle",
      "dib",
      "psd",
      "pdd",
      "raw",
      "dcm",
      "dc3",
      "dic",
      "eps",
      "psb",
      "pct",
      "pict",
      "pxr",
      "pbm",
      "pgm",
      "pnm",
      "pfm",
      "pam",
      "tiff",
      "tif",
      "cr2",
      "srw",
      "nrw",
    ],
    "Video": [
      "avi",
      "mpg",
      "mpeg",
      "mpe",
      "wmv",
      "asf",
      "asx",
      "flv",
      "rm",
      "mov",
      "dat",
      "mkv",
      "flv",
      "mov",
      "mp4",
    ],
    "Audio": ["wav", "wma", "mp3"],
    "Compressed": ["zip", "apk", "rar", "7z", "tar"],
  };

  get partTitleMode() {
    return this.$vuetify.theme.dark? "part-title-d" : "part-title"
  }
  get partMode() {
    return this.$vuetify.theme.dark? "rename-part-bg-d" : "rename-part-bg"
  }
  get folderMode() {
    return this.$vuetify.theme.dark? "folder-d" : "folder"
  }
  fileIcon(type) {
    if (this.fileType["Document"].includes(type)) {
      return require('../../assets/docx_file.png')
    } else if (this.fileType["Image"].includes(type)) {
      return require('../../assets/image_file.png')
    } else if (this.fileType["Video"].includes(type)) {
      return require('../../assets/video_file.png')
    } else if (this.fileType["Audio"].includes(type)) {
      return require('../../assets/audio_file.png')
    } else if (this.fileType["Compressed"].includes(type)) {
      return require('../../assets/zip_file.png')
    } else {
      return require('../../assets/folder-icon.png')
    }
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