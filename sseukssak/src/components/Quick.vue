<template>
  <div>
    <v-tooltip right>
      <template v-slot:activator="{ on, attrs }">
        <div
          class="menu--settings"
          v-bind="attrs"
          v-on="on"
          @click="dialog = true"
        >
          <span><i class="far fa-bolt fa-lg"></i></span>
        </div>
      </template>
      <span>퀵 등록</span>
    </v-tooltip>
    <v-dialog v-model="dialog" width="400px">
      <v-card class="mx-auto" max-width="400">
        <v-img
          class="white--text align-end"
          height="200px"
          src="../assets/quick.png"
        >
        </v-img>
        <v-card-title>Quick Shortcut</v-card-title>
        <v-card-text class="text--primary">
          <v-row>
            <v-col cols="9">
              <v-select
                :items="toLibraryNameList"
                v-model="selectedToNameValue"
                label="Select Group"
                dense
                outlined
              ></v-select
            ></v-col>
            <v-col cols="3"
              ><v-btn
                v-if="!quickTo"
                color="#7288da"
                rounded
                dark
                @click="quickRegist"
                >등록</v-btn
              >
              <v-btn
                v-if="quickTo"
                color="#7288da"
                rounded
                dark
                @click="quickRegist"
                >변경</v-btn
              ></v-col
            >
          </v-row>
          <div v-if="quickTo">
            "{{ quickTo }}"로 등록되어있습니다.

            <v-btn @click="quickDelete" color="red" text> 삭제 </v-btn>
          </div>

          <div v-else>등록된 Quick이 없습니다.</div>
        </v-card-text>

        <v-card-actions style="display: flex; justify-content: flex-end">
          <v-btn color="black" @click="dialog = false" text> 닫기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
import { SortList } from "../api/interface";
import shellContextMenu from "shell-context-menu";
import fs from "fs";
import path from "path";
const { shell } = require("electron").remote;
const { app } = require("electron").remote;
declare const __static: string;
@Component({
  components: {},
  computed: mapState([
    "fileSortList",
    "fromDir",
    "fileList",
    "toLibraryNameList",
    "quickTo",
  ]),
  methods: mapMutations([
    "changeQuickTo",
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeSelectedToName",
  ]),
})
export default class Quick extends Vue {
  fromDir!: string;
  quickTo!: string;
  toLibraryNameList!: string;
  defalutPath: string = "";
  selectedToNameValue: string = "";
  dialog: boolean = false;
  changeDir!: (newDir: string) => void;
  changeQuickTo!: (newDir: string) => void;
  changeFileList!: (newDir: string[]) => void;
  changeFileSortList!: (list: SortList) => void;
  changeSelectedToName!: (name: string) => void;
  quickDelete() {
    shellContextMenu.removeDirectoryCommand("SseuckSsack Quick");
    shellContextMenu.removeDirectoryBackgroundCommand("SseuckSsack Quick");
  }
  quickRegist() {
    console.log(1, this.selectedToNameValue);
    if (this.selectedToNameValue) {
      if (
        !fs.existsSync(
          this.defalutPath + "AppData\\Local\\Programs\\sseukssak\\quick.exe"
        )
      ) {
        fs.copyFileSync(
          path.join(__static, "quick.exe"),
          this.defalutPath + "AppData\\Local\\Programs\\sseukssak\\quick.exe"
        );
      }
      fs.writeFileSync(
        this.defalutPath + "AppData\\Local\\Programs\\sseukssak\\quickData.txt",
        JSON.stringify({ to: this.selectedToNameValue })
      );

      const options = {
        name: "SseuckSsack Quick",
        icon:
          this.defalutPath +
          "AppData\\Local\\Programs\\sseukssak\\sseukssak.exe",
        command:
          this.defalutPath + "AppData\\Local\\Programs\\sseukssak\\quick.exe",
        menu: `여기서 쓱싹!`,
      };

      shellContextMenu.registerDirectoryBackgroundCommand(options);

      shellContextMenu.registerDirectoryCommand(options);
      this.changeQuickTo(this.selectedToNameValue);
    } else {
      alert("일단 골라");
    }
  }
  created() {
    console.log("퀵 크리");
    const arr = process.argv[0].split("\\");
    for (let index = 0; index < arr.length; index++) {
      const element = arr[index];
      this.defalutPath = this.defalutPath + arr[index] + "\\";
      if (element == "Users") {
        this.defalutPath = this.defalutPath + arr[index + 1] + "\\";
        break;
      }
    }
    this.quick();
  }
  quick() {
    if (
      fs.existsSync(
        "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\quickData.txt"
      )
    ) {
      const quickData: object = JSON.parse(
        fs
          .readFileSync(
            "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\quickData.txt"
          )
          .toString()
          .trim()
      );

      if (quickData["to"]) {
        fs.writeFileSync(
          "C:\\Users\\multicampus\\AppData\\Local\\Programs\\sseukssak\\quickData.txt",
          JSON.stringify({ to: quickData["to"] })
        );
      }
      if (quickData["from"]) {
        this.changeDir(quickData["from"]);
        this.getFrom(this.fromDir);
        this.changeSelectedToName(quickData["to"]);
      } else {
        console.log("ㄴㄴ");
      }
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