<template>
  <v-container>
    <br />
    <br />
    <br />
    <!-- <input type="text" v-model="inputs" /> -->
    <v-btn @click="resetHistory()">내역 초기화</v-btn>

    <hr />
    <div v-if="isLoading" style="overflow:scroll; height:400px;">
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
  historyList: (string | number)[][] = [[]];
  inputs: string = "";

  // @Watch("inputs")
  // onPropertyChanged(value: string, oldValue: string) {
  //   console.log(value, oldValue);
  // }

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
    // console.log(mm);
    console.log(mm);

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
          mm["datas"][a]["workcode"]
        ]);
      } catch (err) {
        console.log("error", err);
      }
    }

    // 날짜순으로 정렬
    sortingarr.sort(function(a, b) {
      return a[4] > b[4] ? -1 : a[4] < b[4] ? 1 : 0;
    });
    // console.log(sortingarr);

    //historylist 변경
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
    const nulldata = [];
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
