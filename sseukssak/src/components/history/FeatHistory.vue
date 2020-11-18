<template>
  <div>
    <!-- <span><i class="fas fa-pencil fa-lg"></i></span> -->
  </div>
</template>

<style>
.historyloading {
  color: black;
}
</style>
<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import path from "path";
import { Watch } from "vue-property-decorator";
import { mapMutations, mapState } from "vuex";
// import constants from "@/assets/constants.json";
// import Home from './Home.vue';
const ssDir = require("os").homedir() + "/AppData/Local/Programs/sseukssak/";
@Component({
  components: {},

  computed: mapState([
    "fileSortList",
    "fromDir",
    "duplicatedList",
    "fileList",
    "renameHistory2",
    "moveHistory",
    "googleHistory",
    "restoreRedoList",
  ]),

  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
    "changeRenameHistory2",
    "changeMoveHistory",
    "changerestoreRedoList",
    "resetMoveHistory",
    "resetRenameHistory",
    "resetrestoreRedoList",
    "changeGoogleHistory",
    "resetGoogleHistory",
  ]),
})
export default class Restore extends Vue {
  changeDuplicatedList!: (newList: [][]) => void;
  changeRenameHistory2!: (newList: [][]) => void;
  changeMoveHistory!: (newList: [][]) => void;
  changeGoogleHistory!: (newList: [][]) => void;
  changerestoreRedoList!: (newList: [][]) => void;
  resetMoveHistory!: (newList: [][]) => void;
  resetRenameHistory!: (newList: [][]) => void;
  resetGoogleHistory!: () => void;
  resetrestoreRedoList!: () => void;

  localHistory: any[] = [];
  duplicatedList!: any[][];
  renameHistory2!: any[][];
  googleHistory!: any[][];
  moveHistory!: any[][];
  isLoading!: boolean;
  restoreRedoList!: any[][];
  historyList: (string | number)[][] = [[]];

  // 함수 변동 감시 부분
  @Watch("duplicatedList")
  duplistChanged(value: [][]) {
    if (value.length > 1) {
      console.log("dup change detected");
      this.putChunkstoHistory(value, 1);
    }
  }
  @Watch("renameHistory2")
  renameHistoryChanged(value: [][]) {
    if (value.length > 1) {
      // console.log("rename change detected");
      this.putChunkstoHistory(value, 2);
    }
  }
  @Watch("moveHistory")
  moveChanged(value: [][]) {
    if (value.length > 1) {
      // console.log("move change detected");
      this.putChunkstoHistory(value, 3);
    }
  }
  @Watch("googleHistory")
  googleHistoryChange(value: [][]) {
    if (value.length > 1) {
      // console.log("move change detected");
      this.putChunkstoHistory(value, 4);
    }
  }

  @Watch("restoreRedoList")
  redoHistoryChange(value: [][]) {
    if (value.length > 1) {
      // console.log("move change detected");
      this.putChunkstoHistory(value, 5);
    }
  }
  ///

  mounted() {
    // console.log(this.duplicatedList);
    // console.log(constants);
    // this.readHistory();
  }

  putChunkstoHistory(chunks: [][], type: number) {
    // 로컬 히스토리가 없다면 생성
    const nulldata = [];
    const nulldata2 = JSON.stringify(nulldata);

    let localHistory;
    try {
      localHistory = fs.readFileSync(ssDir + "history_test.json");
    } catch (error) {
      fs.writeFileSync(ssDir + "history_test.json", nulldata2);
    }

    localHistory = fs.readFileSync(ssDir + "history_test.json");
    // 생성 후 json parse
    let hsjson = JSON.parse(localHistory.toString());

    // console.log(chunks);
    // console.log(hsjson);
    chunks.forEach(function (chunk: [][]) {
      try {
        hsjson.push({
          filename: chunk[0],
          success: chunk[1],
          before: chunk[2],
          after: chunk[3],
          date: chunk[4],
          workcode: chunk[5],
        });
      } catch (err) {
        console.log(err);
      }
    });

    // console.log(hsjson);
    const newdata = JSON.stringify(hsjson);
    // console.log(newdata);
    fs.writeFileSync(ssDir + "history_test.json", newdata);

    // console.log(type);
    if (type == 1) {
      this.changeDuplicatedList([[]]);
    } else if (type == 2) {
      this.resetRenameHistory([[]]);
    } else if (type == 3) {
      this.resetMoveHistory([[]]);
    } else if (type == 4) {
      this.resetGoogleHistory();
    } else if (type == 5) {
      this.resetrestoreRedoList();
    }
  }

  readHistory() {
    const nulldata = {
      datas: {},
    };
    const nulldata2 = JSON.stringify(nulldata);

    let localHistory;
    try {
      localHistory = fs.readFileSync(ssDir + "history_test.json");
    } catch (error) {
      fs.writeFileSync(ssDir + "history_test.json", nulldata2);
    }

    localHistory = fs.readFileSync(ssDir + "history_test.json");

    // console.log(this.duplicatedList.length);
    const mm = JSON.parse(localHistory.toString());
    // console.log(mm);

    // 복제 이동 리스트 넣기
    // console.log("dup listing start");
    let tmpL = Object.keys(mm.datas).length;
    // console.log(tmpL);
    // console.log(this.duplicatedList);
    for (let i = 1; i < this.duplicatedList.length; i++) {
      if (this.duplicatedList[i].length != 0) {
        if (mm["datas"][tmpL + i - 1] == undefined) {
          mm["datas"][tmpL + i - 1] = {
            filename: null,
            success: null,
            before: null,
            after: null,
            date: null,
            workcode: null,
          };
        }
        // console.log(mm);
        // console.log(this.duplicatedList[i]);
        mm["datas"][tmpL + i - 1]["filename"] = this.duplicatedList[i][0];
        mm["datas"][tmpL + i - 1]["success"] = this.duplicatedList[i][1];
        mm["datas"][tmpL + i - 1]["before"] = this.duplicatedList[i][2];
        mm["datas"][tmpL + i - 1]["after"] = this.duplicatedList[i][3];
        mm["datas"][tmpL + i - 1]["date"] = this.duplicatedList[i][4];
        mm["datas"][tmpL + i - 1]["workcode"] = this.duplicatedList[i][5];
      }
    }
    // this.localHistory = mm;
    this.changeDuplicatedList([]);
  }

  jsontest(changedHistory: object) {
    const sortingarr: any[] = [];
    const mm = JSON.parse(changedHistory.toString());
    // console.log(changedHistory);
    // console.log(mm);
    //arr에 담기

    for (let a = 0; a < Object.keys(mm.datas).length; a++) {
      try {
        // console.log(a);
        sortingarr.push([
          mm["datas"][a]["filename"],
          mm["datas"][a]["success"],
          mm["datas"][a]["before"],
          mm["datas"][a]["after"],
          mm["datas"][a]["date"],
          mm["datas"][a]["workcode"],
        ]);
      } catch (err) {
        console.log("error", err);
      }
    }

    // 날짜순으로 정렬
    sortingarr.sort(function (a, b) {
      return a[4] > b[4] ? -1 : a[4] < b[4] ? 1 : 0;
    });
    // console.log(sortingarr);

    //historylist 변경
    this.historyList = sortingarr.slice(0, 100);
    // console.log(mm);
    // console.log(this.historyList);
    //100개까지만 저장하기
    for (let k = 0; k < this.historyList.length; k++) {
      if (k >= 100) {
        continue;
      }
      // if (mm['datas'][k].length != 0)
      if (mm["datas"][k] == undefined) {
        mm["datas"][k] = {
          filename: null,
          success: null,
          before: null,
          after: null,
          date: null,
          workcode: null,
        };

        mm["datas"][k]["filename"] = this.historyList[k][0];
        mm["datas"][k]["success"] = this.historyList[k][1];
        mm["datas"][k]["before"] = this.historyList[k][2];
        mm["datas"][k]["after"] = this.historyList[k][3];
        mm["datas"][k]["date"] = this.historyList[k][4];
        mm["datas"][k]["workcode"] = this.historyList[k][5];

        // console.log(this.historyList);
      }
    }

    const newdata = JSON.stringify(mm);
    fs.writeFileSync(ssDir + "history_test.json", newdata);
    // console.log('saved');
  }

  resetHistory() {
    this.isLoading = false;
    const nulldata = {
      datas: {},
    };
    const nulldata2 = JSON.stringify(nulldata);
    this.historyList = [];

    fs.writeFileSync(ssDir + "history_test.json", nulldata2);
    this.isLoading = true;
  }

  created() {
    // console.log(this.moveHistory);
    // console.log(this.renameHistory2);
    this.isLoading = true;
    // console.log(this.isLoading);
  }
}
</script>
