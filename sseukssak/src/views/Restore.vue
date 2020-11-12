<template>
  <v-container>
<<<<<<< HEAD
    <br />
    <br />
    <br />
    <!-- <input type="text" v-model="inputs" /> -->
    <v-btn @click="resetHistory()">내역 초기화</v-btn>

    <hr />
    <!-- <div v-if="isLoading" style="overflow:scroll; height:400px;">
=======
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
>>>>>>> 356ea129e562a27a3988bb830c9219640eebe32b
      <div v-if="historyList.length != 0">
        <v-list
          v-for="historychunk in historyList"
          :key="historychunk.filename + historychunk.date + Math.random()"
        >
          <div class="chunkfail" v-if="historychunk.success == 0">
            <p>
              <b>파일명 : {{ historychunk.filename }}</b>
            </p>
            <p>실행시간 : {{ historychunk.date }}</p>
            <p>작업코드 : {{ historychunk.workcode }}</p>
          </div>
          <div class="chunksucc" v-if="historychunk.success == 1">
            <p>
              <b>파일명 : {{ historychunk.filename }}</b>
            </p>

            <p>실행시간 : {{ historychunk.date }}</p>
            <p>작업코드 : {{ historychunk.workcode }}</p>
          </div>
        </v-list>
      </div>
    </div> -->
    <div style="overflow:scroll; height:400px;">
      <v-list
        v-for="(timechunk, time) in timesortedList"
        :key="time"
        class="chunk"
      >
        <!-- {{ time }} -->
        <h1>{{ convertTime(time) }}</h1>
        <br />
        <div v-for="chunk in timechunk" :key="chunk + Math.random()">
          <div class="chunkfail" v-if="chunk.success == 0">
            <p>
              <b>파일명 : {{ chunk.filename }}</b>
            </p>
            <p>작업코드 : {{ chunk.workcode }}</p>
            <p>이전위치 : {{ chunk.before }}</p>
            <p>나중위치 : {{ chunk.after }}</p>
          </div>

          <div class="chunksucc" v-if="chunk.success == 1">
            <p>
              <b>파일명 : {{ chunk.filename }}</b>
            </p>
            <p>작업코드 : {{ chunk.workcode }}</p>
            <p>이전위치 : {{ chunk.before }}</p>
            <p>나중위치 : {{ chunk.after }}</p>
          </div>
        </div>
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

.chunk {
  padding: 2px;
  border: 3px black solid;
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

  convertTime(time: string) {
    // console.log(time)

    // let t = new Date(time);
    // console.log(t);
    return new Date(Number(time)).toString();
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
