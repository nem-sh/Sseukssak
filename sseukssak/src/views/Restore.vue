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
    <hr />
    <div
      style="overflow-x: hidden; overflow-y: scroll; width: 100%; height: 400px"
    >
      <v-list v-for="(timechunk, time) in timesortedList" :key="time">
        <v-expansion-panels color="grey lighten-4" style="chunk">
          <br />
          <!-- 시간대별로 묶어놓았으며, 그 기준에 따른 시간 표시 -->
          <span>{{ convertTime(time) }}에 작업한 파일들</span>
          <br />
          <br />
          <v-expansion-panel
            v-for="chunk in timechunk"
            :key="chunk + Math.random()"
          >
            <div
              :class="{
                worktype1: chunk.workcode == 1,
                worktype2: chunk.workcode == 2,
                worktype3: chunk.workcode == 3,
                worktype4: chunk.workcode == 4,
              }"
            >
              <!-- 성공 실패에 따른 카드 색상 변경 -->

              <v-expansion-panel-header
                :class="{
                  ss: chunk.success == 1,
                  ff: chunk.success == 0,
                  rr: chunk.success == -1,
                }"
              >
                <span
                  class="d-inline-block text-truncate"
                  style="max-width: 300px"
                  >파일명 : {{ chunk.filename }}</span
                >
                <span style="text-align: right"
                  >작업분류 : {{ convertWorkcode(chunk.workcode) }}</span
                >
              </v-expansion-panel-header>
            </div>
            <v-expansion-panel-content>
              <span>
                {{ chunk.success == 1 ? "해당 작업 성공" : "" }}
                {{ chunk.success == 0 ? "해당 작업 실패" : "" }}
                {{ chunk.success == -1 ? "복구 작업 성공" : "" }}
              </span>
              <br />
              <!-- 텍스트 길이가 길어지면 ...으로 표현하도록 하였음 -->
              <!-- 해당 속성은 text-truncate이며 필요없다면 삭제 -->
              <span
                class="d-inline-block text-truncate"
                style="max-width: 700px"
                >이동 전 위치 : {{ chunk.before }}</span
              >
              <br />
              <span
                class="d-inline-block text-truncate"
                style="max-width: 700px"
                >이동 후 위치 : {{ chunk.after }}</span
              >
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list>
    </div>
    <div align="right" class="mt-3">
      <v-btn color="#7288da" rounded dark @click="resetHistory()">초기화</v-btn>
    </div>
  </v-container>
</template>

<style>
.restorebtn {
  float: right;
  width: 500px;
}
/* 성공:ss, 실패:ff, 복구:rr로 할 예정 */
.ss {
  background-color: #6699ff;
}

.ff {
  background-color: #ff6699;
}
.rr {
  background-color: #99ff66;
}

.worktype1 {
  border: solid 0px;
  border-left-width: 15px;
  border-left-color: black;
}
.worktype2 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: teal;
}
.worktype3 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: lightblue;
}
.worktype4 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: darkblue;
}

.smallchunk {
  padding: 7px;
  /* border: 1px black solid; */
  font-size: 10px;
  line-height: 8px;
  margin-top: 8px;
  margin-bottom: 8px;
}

.chunk {
  padding: 3px;
  /* border: 3px black solid; */
  font-size: 20px;
  line-height: 8px;
  /* margin: 8px; */
  /* margin-top: 8px;
  margin-bottom: 8px; */
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
import { Watch } from "vue-property-decorator";
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
  historyList: any[][] = [[]];
  inputs: string = "";
  timesortedList: Object = [];

  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }
  mounted() {
    this.readHistory();
  }
  get succfail() {
    return {};
  }

  readHistory() {
    const nulldata = [];
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

    const mm2 = Buffer.from(JSON.stringify(mm));
    this.sortbyTimeChunk(mm2);
    // this.jsontest(mm2);
  }

  convertWorkcode(code: any) {
    return constants.history.workcode[code];
  }

  convertTime(time: string) {
    // console.log(new Date(Number(time)));

    let a = new Date(Number(time)).getMonth();
    let b = new Date(Number(time)).getDate();
    let c = new Date(Number(time)).getHours();

    let d = new Date(Number(time)).getMinutes();

    return `${a}월 ${b}일 ${c}시 ${d}분`;
  }

  selectchunk(t) {
    // console.log(t);
  }

  jsontest(changedHistory: object) {
    const sortingarr: any[] = [];
    const mm = JSON.parse(changedHistory.toString());

    //arr에 담기
    mm.forEach(function (chunk: any) {
      // console.log(chunk);
      try {
        if (chunk.date != undefined) {
          sortingarr.push(chunk);
        }
      } catch (err) {
        console.log(err);
      }
    });

    // 날짜순으로 정렬
    sortingarr.sort(function (a, b) {
      return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    });
    // console.log(sortingarr);

    //historylist 변경
    this.historyList = sortingarr.slice(0, 100);

    this.historyList.forEach(function (history: any) {
      // console.log(history);
      const d = new Date(history.date);
      history.date = d.toString();
      const wc = history.workcode;
      history.workcode = constants.history.workcode[wc];
    });
  }

  sortbyTimeChunk(changedHistory: object) {
    let sortingarr: any = {};
    const mm = JSON.parse(changedHistory.toString());
    // console.log(mm);
    mm.forEach(function (chunk: any) {
      // console.log(chunk);

      if (chunk.date) {
        let zz;
        zz = Math.round(chunk.date / 60000) * 60000;
        // zz = new Date(zz);
        if (sortingarr[zz] == undefined) {
          sortingarr[zz] = [];
          sortingarr[zz].push(chunk);
        } else {
          sortingarr[zz].push(chunk);
        }
      }
    });
    // console.log(sortingarr);

    let keys = Object.keys(sortingarr);

    keys.sort(function (a, b) {
      return Number(b) - Number(a);
    });
    let sorted: any = {};

    for (let ya = 0; ya < keys.length; ya++) {
      sorted[keys[ya]] = sortingarr[keys[ya]];
    }

    // console.log(sorted);

    this.timesortedList = sorted;
  }

  resetHistory() {
    this.isLoading = false;
    const nulldata = [];
    const nulldata2 = JSON.stringify(nulldata);
    // this.historyList = [];
    this.timesortedList = [];

    fs.writeFileSync("history_test.json", nulldata2);
    this.isLoading = true;
  }

  created() {
    this.isLoading = true;
  }
}
</script>
