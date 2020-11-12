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

    this.jsontest(mm2);
  }

  jsontest(changedHistory: object) {
    const sortingarr: any[] = [];
    const mm = JSON.parse(changedHistory.toString());

    //arr에 담기
    mm.forEach(function(chunk: any) {
      console.log(chunk);
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
