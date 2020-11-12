<template>
  <v-container>
    <v-card-title>History</v-card-title>
    <hr />
    <div
      style="overflow-x:hidden; overflow-y:scroll; width:100%; height:400px;"
    >
      <v-list v-for="(timechunk, time) in timesortedList" :key="time">
        <v-expansion-panels color="grey lighten-4" style="chunk">
          <br />
          <span>{{ convertTime(time) }}</span>
          <br />
          <br />
          <v-expansion-panel
            v-for="chunk in timechunk"
            :key="chunk + Math.random()"
          >
            <v-expansion-panel-header
              :class="{ ss: chunk.success == 1, ff: chunk.success == 0 }"
            >
              <span
                class="d-inline-block text-truncate"
                style="max-width: 300px;"
                >파일명 : {{ chunk.filename }}</span
              >
              <span style="text-align: right;"
                >작업분류 : {{ chunk.workcode }}</span
              >
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <span>
                {{ chunk.success == 1 ? "해당 작업 성공" : "" }}
                {{ chunk.success == 0 ? "해당 작업 실패" : "" }}
                {{ chunk.success == -1 ? "복구 작업 성공" : "" }}
              </span>
              <br />
              <span
                class="d-inline-block text-truncate"
                style="max-width: 700px;"
                >이동 전 위치 : {{ chunk.before }}</span
              >
              <br />
              <span
                class="d-inline-block text-truncate"
                style="max-width: 700px;"
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
    "moveHistory"
  ]),

  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
    "changeRenameHistory2",
    "changeMoveHistory"
  ])
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

  convertTime(time: string) {
    return ":: " + new Date(Number(time)).toString();
  }

  selectchunk(t) {
    console.log(t);
  }

  jsontest(changedHistory: object) {
    const sortingarr: any[] = [];
    const mm = JSON.parse(changedHistory.toString());

    //arr에 담기
    mm.forEach(function(chunk: any) {
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
    sortingarr.sort(function(a, b) {
      return a.date > b.date ? -1 : a.date < b.date ? 1 : 0;
    });
    // console.log(sortingarr);

    //historylist 변경
    this.historyList = sortingarr.slice(0, 100);

    this.historyList.forEach(function(history: any) {
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
    mm.forEach(function(chunk: any) {
      // console.log(chunk);

      if (chunk.date) {
        chunk.workcode = constants.history.workcode[chunk.workcode];

        let zz;
        zz = Math.round(chunk.date / 1000) * 1000;
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

    keys.sort(function(a, b) {
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
    this.historyList = [];

    fs.writeFileSync("history_test.json", nulldata2);
    this.isLoading = true;
  }

  created() {
    this.isLoading = true;
  }
}
</script>
