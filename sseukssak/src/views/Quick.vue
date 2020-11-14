<template>
  <v-container class="screen">
    <!-- <v-btn @click="quickRegist">퀵 생성</v-btn> -->
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
import { SortList } from "../api/interface";
// import shellContextMenu from "shell-context-menu";
import fs from "fs";
const { shell } = require("electron").remote;
const { app } = require("electron").remote;
@Component({
  components: {},
  computed: mapState(["fileSortList", "fromDir", "fileList"]),
  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeSelectedToName",
  ]),
})
export default class Quick extends Vue {
  fromDir!: string;
  changeDir!: (newDir: string) => void;
  changeFileList!: (newDir: string[]) => void;
  changeFileSortList!: (list: SortList) => void;
  changeSelectedToName!: (name: string) => void;
  quickRegist() {
    const options = {
      name: "SseuckSsack Quick",
      icon:
        "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\sseukssak.exe",
      command: "C:\\Users\\multicampus\\Desktop\\nodebuildtest\\app.exe",
      menu: "여기서 바로 쓱싹할께요!!!!",
    };

    // shellContextMenu.registerCommand(options);
  }
  created() {
    console.log(1);
    console.log(fs.readdirSync("http://localhost:8080/assets"));
    fs.copyFileSync(
      "@/assets/shortcut.exe",
      "C:\\Users\\multicampus\\shortcut.exe"
    );
    this.quick();
  }
  quick() {
    const quickData: object = JSON.parse(
      fs
        .readFileSync(
          "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\quickData.txt"
        )
        .toString()
        .trim()
    );
    fs.writeFileSync(
      "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\quickData.txt",
      JSON.stringify({})
    );
    if (quickData["from"]) {
      console.log(quickData["from"]);
      this.changeDir(quickData["from"]);
      this.getFrom(this.fromDir);
      this.changeSelectedToName("유형별 정리");
    } else {
      console.log("ㄴㄴ");
    }
  }
  async getFrom(dir: string) {
    const fileList: string[] = fs.readdirSync(dir);
    const fileSortList: SortList = { directories: [], files: [] };
    fileList.forEach((name: string) => {
      const fileSplit = name.split(".");
      if (fs.lstatSync(this.fromDir + "/" + name).isDirectory()) {
        const birthTime = fs.lstatSync(this.fromDir + "/" + name).birthtimeMs;
        const updatedTime = Math.max(
          fs.lstatSync(this.fromDir + "/" + name).mtimeMs,
          fs.lstatSync(this.fromDir + "/" + name).ctimeMs
        );
        fileSortList.directories.push({
          name: name,
          birthTime: birthTime,
          updatedTime: updatedTime,
        });
      } else {
        const fileType = fileSplit[fileSplit.length - 1].toLowerCase();
        const birthTime = fs.lstatSync(this.fromDir + "/" + name).birthtimeMs;
        const updatedTime = Math.max(
          fs.lstatSync(this.fromDir + "/" + name).mtimeMs,
          fs.lstatSync(this.fromDir + "/" + name).ctimeMs
        );
        let iconPath = this.fromDir + "/" + name;
        if (name.includes(".lnk")) {
          try {
            iconPath = shell.readShortcutLink(iconPath).target;
          } catch {
            iconPath = this.fromDir + "/" + name;
          }
        }
        let realIcon = "";
        const file = {
          name: name,
          fileType: fileType,
          birthTime: birthTime,
          updatedTime: updatedTime,
          icon: "",
        };
        app.getFileIcon(iconPath).then((fileIcon) => {
          realIcon = fileIcon.toDataURL();
          file["icon"] = realIcon;
        });
        fileSortList.files.push(file);
      }
    });

    this.changeFileSortList(fileSortList);
    this.changeFileList(fileList);
  }
}
</script>

<style>
</style>