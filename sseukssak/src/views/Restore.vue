<template>
  <v-container>
    <div class="mt-4">
      <img
        src="@/assets/titleImg/HistoryImg.png"
        alt=""
        height="40"
        class="mt-4"
      />
    </div>
    <div
      v-if="isLoading"
      style="overflow: scroll; height: 480px"
      :class="scrollerBgMode"
      class="mt-4"
    >
      <div v-if="historyList.length != 0">
        <v-list
          v-for="historychunk in historyList"
          :key="historychunk.filename"
        >
          <div class="chunkfail" v-if="historychunk[1] == 0">
            <p>
              <b>파일명 : {{ historychunk[0] }}</b>
            </p>
            <p>실행시간 : {{ historychunk[4] }}</p>
            <p>작업코드 : {{ historychunk[5] }}</p>
          </div>
          <div class="chunksucc" v-if="historychunk[1] == 1">
            <p>
              <b>파일명 : {{ historychunk[0] }}</b>
            </p>
            <p>실행시간 : {{ historychunk[4] }}</p>
            <p>작업코드 : {{ historychunk[5] }}</p>
          </div>
        </v-list>
      </div>
    </div>
    <div align="right" class="mt-3">
      <v-btn color="#7288da" rounded dark @click="resetHistory()">초기화</v-btn>
    </div>
  </v-container>
</template>

<style>
div.chunk {
  padding: 2px;
  border: 1px black solid;
  color: black;
  font-size: 10px;
  line-height: 8px;
  /* background-color: #cceeff; */
}
.chunksucc {
  padding: 2px;
  border: 1px black solid;
  color: black;
  font-size: 10px;
  line-height: 8px;
  background-color: #cceeff;
}

.chunkfail {
  padding: 2px;
  border: 1px black solid;
  color: black;
  font-size: 10px;
  line-height: 8px;
  background-color: #e0eb4c;
}
</style>
<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import path from "path";
// import electron, { app } from 'electron';

import { mapMutations, mapState } from "vuex";
import constants from "@/assets/constants.json";
// import Home from './Home.vue';

@Component({
  components: {},

  computed: mapState([
    "fileSortList",
    "fromDir",
    "duplicatedList",
    "fileList",
    "renameHistory2",
    "moveHistory",
  ]),

  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
    "changeRenameHistory2",
    "changeMoveHistory",
  ]),
})
export default class Restore extends Vue {
  changeDuplicatedList!: (newList: [][]) => void;
  changeRenameHistory2!: (newList: [][]) => void;
  changeMoveHistory!: (newList: [][]) => void;
  localHistory: any[] = [];
  duplicatedList!: any[][];
  renameHistory2!: any[][];
  moveHistory!: any[][];
  isLoading!: boolean;
  historyList: (string | number)[][] = [[]];

  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }
  mounted() {
    // console.log(this.duplicatedList);
    // console.log(constants);
    this.readHistory();
  }
  get succfail() {
    return {};
  }

  readHistory() {
    // console.log(this.duplicatedList);
    const nulldata = {
      datas: {},
    };
    const nulldata2 = JSON.stringify(nulldata);

    let localHistory;
    try {
      localHistory = fs.readFileSync("history_test.json");
    } catch (error) {
      fs.writeFileSync("history_test.json", nulldata2);
    }

    localHistory = fs.readFileSync("history_test.json");

    // console.log(this.duplicatedList.length);
    const mm = JSON.parse(localHistory.toString());
    // console.log(mm);

    if (this.duplicatedList == undefined || this.duplicatedList.length == 1) {
      this.jsontest(localHistory);
    }
    // 복제 이동 리스트 넣기
    console.log("dup listing start");
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

    // console.log(this.moveHistory);
    if (this.moveHistory == undefined || this.moveHistory.length == 1) {
      this.jsontest(Buffer.from(JSON.stringify(mm)));
    }
    console.log("moved listing start");
    tmpL += this.duplicatedList.length;
    // console.log(tmpL);
    // console.log(this.moveHistory);
    for (let n = 0; n < this.moveHistory.length; n++) {
      if (this.moveHistory[n].length != 0) {
        if (mm["datas"][tmpL + n] == undefined) {
          mm["datas"][tmpL + n] = {
            filename: null,
            success: null,
            before: null,
            after: null,
            date: null,
            workcode: null,
          };
        }
        mm["datas"][tmpL + n]["filename"] = this.moveHistory[n][0];
        mm["datas"][tmpL + n]["success"] = this.moveHistory[n][1];
        mm["datas"][tmpL + n]["before"] = this.moveHistory[n][2];
        mm["datas"][tmpL + n]["after"] = this.moveHistory[n][3];
        mm["datas"][tmpL + n]["date"] = this.moveHistory[n][4];
        mm["datas"][tmpL + n]["workcode"] = this.moveHistory[n][5];
      }
    }
    this.changeMoveHistory([]);

    if (this.renameHistory2 == undefined || this.renameHistory2.length == 1) {
      this.jsontest(Buffer.from(JSON.stringify(mm)));
    }
    console.log("rename listing start");
    tmpL += this.moveHistory.length;
    // console.log(tmpL);
    console.log(this.renameHistory2);
    for (let c = 0; c < this.renameHistory2.length; c++) {
      if (this.renameHistory2[c].length != 0) {
        if (mm["datas"][tmpL + c] == undefined) {
          mm["datas"][tmpL + c] = {
            filename: null,
            success: null,
            before: null,
            after: null,
            date: null,
            workcode: null,
          };
        }
        mm["datas"][tmpL + c]["filename"] = this.renameHistory2[c][0];
        mm["datas"][tmpL + c]["success"] = this.renameHistory2[c][1];
        mm["datas"][tmpL + c]["before"] = this.renameHistory2[c][2];
        mm["datas"][tmpL + c]["after"] = this.renameHistory2[c][3];
        mm["datas"][tmpL + c]["date"] = this.renameHistory2[c][4];
        mm["datas"][tmpL + c]["workcode"] = this.renameHistory2[c][5];
      }
    }
    this.changeRenameHistory2([]);

    const mm2 = Buffer.from(JSON.stringify(mm));
    // console.log(mm2);

    this.jsontest(mm2);
  }

  jsontest(changedHistory: object) {
    const sortingarr: any[] = [];
    const mm = JSON.parse(changedHistory.toString());
    // console.log(changedHistory);
    console.log(mm);
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
    console.log(this.historyList);
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
    // constants 기준으로 출력할 값 바꾸기
    for (let h = 0; h < this.historyList.length; h++) {
      const d = new Date(this.historyList[h][4]);
      this.historyList[h][4] = d.toString();
      const wc = this.historyList[h][5];
      this.historyList[h][5] = constants.history.workcode[wc];
    }

    const newdata = JSON.stringify(mm);
    fs.writeFileSync("history_test.json", newdata);
    // console.log('saved');
  }

  resetHistory() {
    this.isLoading = false;
    const nulldata = {
      datas: {},
    };
    const nulldata2 = JSON.stringify(nulldata);
    this.historyList = [];

    fs.writeFileSync("history_test.json", nulldata2);
    this.isLoading = true;
  }

  created() {
    console.log(this.moveHistory);
    console.log(this.renameHistory2);
    this.isLoading = true;
    // console.log(this.isLoading);
  }
}
</script>
