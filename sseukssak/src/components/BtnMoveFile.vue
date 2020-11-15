<template>
  <div style="display: inline">
    <div class="d-flex justify-end">
      <v-checkbox
        v-if="!mini"
        class="mt-1 mr-3"
        label="중복제거"
        value="중복제거"
        v-model="dupOnOff"
        hide-details
      ></v-checkbox>
      <v-btn
        class="mr-3 play-btn"
        color="var(--color-purple)"
        dark
        rounded
        @click="moveFile"
      >
        정리
      </v-btn>

      <v-btn
        :disabled="restoreMoveList.length === 0"
        class="mr-3"
        color="error"
        style="color: white"
        rounded
        @click="RestoreMoveFile"
      >
        <i class="fas fa-redo-alt"></i>
      </v-btn>
    </div>
    <v-dialog v-if="!mini" v-model="dialog" persistent max-width="400px">
      <v-card align="center">
        <v-card-text>
          <lottie-player
            src="https://assets6.lottiefiles.com/packages/lf20_AvXSwT.json"
            background="transparent"
            speed="1"
            style="width: 300px; height: 300px"
            loop
            autoplay
          ></lottie-player>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapState, mapMutations } from "vuex";
import { tagToTypeList } from "../api/tagToType";
import { BUS } from "./EventBus.js";
import Swal from "sweetalert2";
import mime from "mime-types";

// 알림창
// import { remote } from "electron";
// const { Notification } = require('electron').remote;
// const notifier = remote.require("node-notifier");
// declare const __static: string;
import Axios from "axios";

import {
  ToLibrary2,
  ToLibraryDirectory2,
  SortList,
  RestoreMoveListUnit,
} from "../api/interface";

@Component({
  computed: mapState([
    "fromDir",
    "fileList",
    "fileSortList",
    "selectedToName",
    "toLibraryList",
    "moveHistory",
    "mini",
    "oAuth2Client",
    "restoreMoveList",
  ]),
  methods: mapMutations([
    "changeMoveHistory",
    "changeFileSortList",
    "changeFileList",
    "changeRestoreMoveList",
  ]),
})
export default class BtnMoveFile extends Vue {
  dupOnOff: boolean = false;
  restoreMoveList!: RestoreMoveListUnit[];
  fileList!: object;
  dialog: boolean = false;
  now: Date = new Date();
  moveHistory!: any[][];
  tagToDate: object = {
    "#Today": new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate()
    ),
    "#This week": new Date(
      this.now.getFullYear(),
      this.now.getMonth(),
      this.now.getDate() - this.now.getDay()
    ),
    "#This month": new Date(this.now.getFullYear(), this.now.getMonth()),
    "#Every new file": new Date(0),
  };
  tagToType: object = tagToTypeList;
  fromDir!: string;
  toLibraryList!: ToLibrary2[];
  selectedToName!: string;
  fileSortList!: SortList;
  duplicatedList!: any[][];
  mini!: boolean;
  oAuth2Client!: any;
  changeFileList!: (newList: string[]) => void;
  changeFileSortList!: (newList: SortList) => void;
  changeMoveHistory!: (newList: any[]) => void;
  changeRestoreMoveList!: (newList: RestoreMoveListUnit[]) => void;
  compareTitle(file: string, titleTags: string[]) {
    if (titleTags.length == 0) {
      return true;
    }
    for (let index = 0; index < titleTags.length; index++) {
      const title = titleTags[index];
      if (file.includes(title) == true) {
        return true;
      }
    }
    return false;
  }
  compareDate(birthTime: Date, dateTags: string[]) {
    for (let index = 0; index < dateTags.length; index++) {
      const date = dateTags[index];
      if (date[0] == "#") {
        if (this.tagToDate[date].getTime() < birthTime.getTime()) {
          return true;
        }
      } else {
        const dateLi = date.split("~");
        if (
          new Date(
            Number(dateLi[0].slice(0, 4)),
            Number(dateLi[0].slice(0, 4)),
            Number(dateLi[0].slice(0, 4))
          ).getTime() < birthTime.getTime() &&
          new Date(
            Number(dateLi[1].slice(0, 4)),
            Number(dateLi[1].slice(0, 4)),
            Number(dateLi[1].slice(0, 4)),
            23,
            59,
            59
          ).getTime() > birthTime.getTime()
        ) {
          return true;
        }
      }
      return false;
    }
    return true;
  }

  moveToGoogleDrive(filePath, folderId, fileName) {
    const accessToken = this.oAuth2Client.credentials.access_token;
    const UPLOAD_URL =
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=media";
    const PATCH_URL = "https://www.googleapis.com/drive/v3/files/";

    const contentType = mime.lookup(filePath);
    const file = fs.readFileSync(filePath);

    const headers = {
      Authorization: "Bearer " + accessToken,
      "Content-Type": contentType,
    };

    Axios.post(UPLOAD_URL, file, { headers: headers })
      .then((res) => {
        const data = {
          name: fileName,
        };
        const patchHeaders = {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
        };

        Axios.patch(
          PATCH_URL +
            `${res.data.id}?uploadType=multipart&addParents=${folderId}`,
          data,
          { headers: patchHeaders }
        )
          .then(() => console.log("구글 드라이브 업로드에 성공했습니다."))
          .catch(() =>
            Swal.fire({
              icon: "error",
              title: "구글 드라이브 업로드에 실패했습니다.",
            })
          );
      })
      .catch(() =>
        Swal.fire({
          icon: "error",
          title: "구글 드라이브 업로드에 실패했습니다.",
        })
      );
  }

  moveFile() {
    // console.log(this.toLibraryList);
    // let timerInterval;
    // Swal.fire({
    //   title: "정리 중...",
    //   timer: 200000,
    //   willOpen: () => {
    //     Swal.showLoading();
    //     timerInterval = setInterval(() => {
    //       const content = Swal.getContent();
    //     }, 100);
    //   },
    //   onClose: () => {
    //     clearInterval(timerInterval);
    //   },
    // });

    // 정리 그룹 선택 안했을 시
    if (this.selectedToName === "") {
      Swal.fire({
        position: "center",
        icon: "warning",
        title: "정리 그룹을 선택해주세요",
        showConfirmButton: false,
        timer: 1000,
      });
      return;
    } else {
      let dupFlag = false;
      // 로딩
      if (this.mini === true) {
        BUS.$emit("bus:mniiLoading");
      } else {
        this.dialog = true;
      }

      BUS.$emit("bus:refreshfile");
      if (this.dupOnOff) {
        // console.log("does dup check");
        BUS.$emit("bus:dupcheck");
        BUS.$emit("bus:refreshfile");
      }
      // console.log("ended dup check");
      const tempRestoreMoveList: RestoreMoveListUnit[] = [];

      let selectedFrom: ToLibraryDirectory2[] = [];

      for (let index = 0; index < this.toLibraryList.length; index++) {
        if (this.toLibraryList[index].name == this.selectedToName) {
          selectedFrom = this.toLibraryList[index].directories;
          break;
        }
      }
      if (selectedFrom == []) {
        return;
      }

      const directories: ToLibraryDirectory2[] = JSON.parse(
        JSON.stringify(selectedFrom)
      );

      for (let index = 0; index < directories.length; index++) {
        const element = directories[index];
        element.path = element.path.replace("%from%", this.fromDir);
      }
      directories.forEach((directory: ToLibraryDirectory2) => {
        directory.types = [];
        directory.typeTags.forEach((typeTag) => {
          if (typeTag[0] == "#") {
            directory.types = directory.types.concat(this.tagToType[typeTag]);
          } else {
            directory.types = directory.types.concat(typeTag);
          }
        });
      });
      const fileSortList = this.fileSortList;

      for (const idx of fileSortList.files) {
        // console.log(fileSortList, 7, idx.name);
        const a: string[][] = [];
        if (!fs.existsSync(this.fromDir + "/" + idx.name)) {
          this.changeMoveHistory([
            idx.name,
            0,
            this.fromDir + "/" + idx.name,
            "파일이 존재하지 않습니다.",
            new Date().getTime(),
            1,
          ]);
          continue;
        }
        directories.forEach((directory: ToLibraryDirectory2) => {
          if (this.compareDate(new Date(idx.birthTime), directory.dateTags)) {
            if (this.compareTitle(idx.name, directory.titleTags)) {
              // console.log(idx.name);

              let flag = false;
              directory.types.forEach((type) => {
                if (type == "." + idx.fileType || type == idx.fileType) {
                  flag = true;
                  return;
                }
              });
              if (directory.types.length == 0) {
                flag = true;
              }
              if (flag) {
                if (
                  !fs.existsSync(directory.path) &&
                  !directory.path.includes("%drive%")
                ) {
                  fs.mkdirSync(directory.path);
                }
                if (!directory.path.includes("%drive%")) {
                  if (fs.existsSync(directory.path + "/" + idx.name)) {
                    dupFlag = true;

                    a.push([
                      this.fromDir + "/" + idx.name,
                      directory.path + "/" + "[중복]" + idx.name,
                    ]);
                  } else {
                    a.push([
                      this.fromDir + "/" + idx.name,
                      directory.path + "/" + idx.name,
                    ]);
                  }
                } else {
                  a.push([
                    this.fromDir + "/" + idx.name,
                    directory.path + "/" + idx.name,
                  ]);
                }
              }
            }
          }
        });
        let step;
        if (a.length > 0) {
          for (step = 0; step < a.length - 1; step++) {
            // Runs 5 times, with values of step 0 through 4.

            try {
              if (a[step][1].includes("%drive%")) {
                const data = a[step][1].split("/");
                const name = a[step][0].split("/");

                this.moveToGoogleDrive(
                  a[step][0],
                  data[1],
                  name[name.length - 1]
                );
                tempRestoreMoveList.push({
                  type: "drive",
                  from: a[step][0],
                  to: a[step][1],
                });
              } else {
                fs.copyFileSync(a[step][0], a[step][1]);

                tempRestoreMoveList.push({
                  type: "copy",
                  from: a[step][0],
                  to: a[step][1],
                });
              }
              this.changeMoveHistory([
                idx.name,
                1,
                a[step][0],
                a[step][1],
                new Date().getTime(),
                1,
              ]);
            } catch (err) {
              this.changeMoveHistory([
                idx.name,
                0,
                a[step][0],
                a[step][1],
                new Date().getTime(),
                1,
              ]);
            }
          }
          try {
            //555555555555
            if (a[step][1].includes("%drive%")) {
              const data = a[step][1].split("/");
              const name = a[step][0].split("/");
              this.moveToGoogleDrive(
                a[a.length - 1][0],
                data[1],
                name[name.length - 1]
              );
              if (a.length - 1 == 0) {
                fs.unlinkSync(a[step][0]);
              }
              tempRestoreMoveList.push({
                type: "drive",
                from: a[step][0],
                to: a[step][1],
              });
            } else {
              fs.renameSync(a[a.length - 1][0], a[a.length - 1][1]);

              tempRestoreMoveList.push({
                type: "move",
                from: a[step][0],
                to: a[step][1],
              });
            }
            this.changeMoveHistory([
              idx.name,
              1,
              a[a.length - 1][0],
              a[a.length - 1][1],
              new Date().getTime(),
              1,
            ]);
          } catch (err) {
            this.changeMoveHistory([
              idx.name,
              0,
              a[a.length - 1][0],
              a[a.length - 1][1],
              new Date().getTime(),
              1,
            ]);
          }
        }
      }

      this.changeRestoreMoveList(tempRestoreMoveList);

      setTimeout(() => {
        // 로딩 끝
        if (this.mini === true) {
          BUS.$emit("bus:miniLoadingEnd");
        } else {
          this.dialog = false;
        }
        // 정리한게 없는 경우
        if (tempRestoreMoveList.length === 0) {
          Swal.fire({
            position: "center",
            icon: "info",
            title: "정리한 파일이 없습니다",
            showConfirmButton: false,
            timer: 1000,
          });
        } else {
          // 중복 알림
          if (dupFlag) {
            Swal.fire({
              position: "center",
              icon: "info",
              title: "정리가 완료되었습니다",
              text: "중복된 이름의 파일이 존재하여 자동 리네임되었습니다",
              showConfirmButton: false,
              timer: 1000,
            });
            dupFlag = false;
          } else {
            Swal.fire({
              position: "center",
              icon: "success",
              title: "정리가 완료되었습니다",
              showConfirmButton: false,
              timer: 1000,
            });
          }
          // notifier.notify({
          //   title: "쓱싹 알림",
          //   message: "정리가 완료되었습니다!",
          //   icon: path.join(__static, "sweeping.png"),
          //   sound: true
          // });
        }
      }, 1000);
      // Swal.fire({
      //   position: "center",
      //   icon: "success",
      //   title: "정리가 완료되었습니다.",
      //   showConfirmButton: false,
      //   timer: 3000,
      // });

      BUS.$emit("bus:refreshfile");
    }
  }
  RestoreMoveFile() {
    // 로딩
    if (this.mini === true) {
      BUS.$emit("bus:miniLoading");
    } else {
      this.dialog = true;
    }

    this.dialog = true;
    // console.log(this.restoreMoveList);
    for (let index = 0; index < this.restoreMoveList.length; index++) {
      const element = this.restoreMoveList[index];
      // console.log(element);
      const filePathSplit = element["to"]
        .split("\\")
        .join(",")
        .split("/")
        .join(",")
        .split(",");
      // console.log(filePathSplit);
      if (element["type"] == "move") {
        try {
          fs.renameSync(element["to"], element["from"]);
          this.changeMoveHistory([
            filePathSplit[filePathSplit.length - 1],
            -1,
            element["to"],
            element["from"],
            new Date().getTime(),
            1,
          ]);
        } catch (error) {
          this.changeMoveHistory([
            filePathSplit[filePathSplit.length - 1],
            -2,
            element["to"],
            element["from"],
            new Date().getTime(),
            1,
          ]);
        }
      } else if (element["type"] == "copy") {
        try {
          fs.unlinkSync(element["to"]);
          this.changeMoveHistory([
            filePathSplit[filePathSplit.length - 1],
            -1,
            element["to"],
            "delete",
            new Date().getTime(),
            1,
          ]);
        } catch (error) {
          this.changeMoveHistory([
            filePathSplit[filePathSplit.length - 1],
            -2,
            element["to"],
            "delete",
            new Date().getTime(),
            1,
          ]);
        }
      }
    }
    this.changeRestoreMoveList([]);
    BUS.$emit("bus:refreshfile");

    setTimeout(() => {
      // 로딩 끝
      if (this.mini === true) {
        BUS.$emit("bus:miniLoadingEnd");
      } else {
        this.dialog = false;
      }
      Swal.fire({
        position: "center",
        icon: "success",
        title: "복원되었습니다",
        showConfirmButton: false,
        timer: 1000,
      });
    }, 1000);
  }
}
</script>

<style></style>
