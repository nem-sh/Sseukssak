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
    <div style="helpbtn" class="mt-3" align="right">
      <v-dialog width="600px">
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon color="indigo lighten-1" dark v-bind="attrs" v-on="on">
            <v-icon>far fa-question-circle</v-icon>
          </v-btn>
        </template>
        <v-card :class="{ 'modal-d': this.$vuetify.theme.dark }">
          <v-card-title>
            <div class="text-center">
              <span class="headline text-center">History 기능</span>
            </div>
          </v-card-title>
          <v-card-text>
            <span>
              1. 좌측의 박스 색상을 통해 어떤 작업인지 바로 알 수 있습니다.
              <hr />
            </span>
            <br />
            <v-icon color="#78909c">fas fa-square</v-icon> 파일 이동 <br />
            <v-icon color="#69f0ae">fas fa-square</v-icon> 중복 파일 체크 <br />
            <v-icon color="#40c4ff">fas fa-square</v-icon> 파일 이름 변경 <br />
            <v-icon color="#7c4dff">fas fa-square</v-icon> 구글 드라이브 이동
            <br />
            <br />

            <div align="right">
              <span>
                2. 우측의 아이콘을 통해 해당 작업의 결과를 알 수 있습니다.
                <hr /> </span
              ><br />
              <span>해당 작업에 성공했습니다. </span>
              <v-icon color="teal lighten-1" size="10">fas fa-circle</v-icon>
              <br />
              <span>해당 작업에 실패했습니다. </span>
              <v-icon color="red darken-1" size="10"
                >fas fa-exclamation-circle</v-icon
              >
              <br />
              <span>복구 작업을 진행하였습니다. </span>
              <v-icon color="blue lighten-3" size="10">fas fa-undo-alt</v-icon>
              <br />
              <br />
              <br />
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <br />
    <div
      v-if="Object.keys(timesortedList).length < 1"
      style="text-align:center"
    >
      <h1>파일 이동 내역이 없습니다.</h1>
    </div>

    <div
      style="overflow-x:hidden; overflow-y:scroll;  height:410px;"
      :class="scrollerBgMode"
      v-if="Object.keys(timesortedList).length >= 1"
    >
      <v-list
        class="mx-5"
        v-for="(timechunk, time) in timesortedList"
        :key="time"
      >
        <v-expansion-panels color="grey lighten-4" style="chunk">
          <br />
          <!-- 시간대별로 묶어놓았으며, 그 기준에 따른 시간 표시 -->
          <h5><i class="far fa-calendar-alt"></i> {{ convertTime(time) }}</h5>
          <br />
          <br />
          <v-expansion-panel
            v-for="chunk in timechunk"
            :key="chunk + Math.random()"
            :class="{
              worktype1: chunk.workcode == 1,
              worktype2: chunk.workcode == 2,
              worktype3: chunk.workcode == 3,
              worktype4: chunk.workcode == 4
            }"
          >
            <!-- 성공 실패에 따른 카드 색상 변경 -->

            <v-expansion-panel-header expand-icon=" ">
              <h5
                class="d-inline-block text-truncate"
                style="max-width: 450px;"
              >
                파일명 : {{ chunk.filename }}
              </h5>
              <div align="right">
                <v-icon
                  color="teal lighten-1"
                  size="10"
                  v-if="chunk.success == 1"
                  >fas fa-circle</v-icon
                >
                <v-icon color="red darken-1" size="10" v-if="chunk.success == 0"
                  >fas fa-exclamation-circle</v-icon
                >
                <v-icon
                  color="blue lighten-3"
                  size="10"
                  v-if="chunk.success == -1"
                  >fas fa-undo-alt</v-icon
                >
              </div>
            </v-expansion-panel-header>
            <v-expansion-panel-content style="chunkcontent">
              <hr />
              <h5 style="text-align: right;" class="d-inline-block py-3">
                요약 : {{ convertWorkcode(chunk.workcode) }}
                {{ convertWorkName(chunk.success) }}
              </h5>

              <hr />
              <!-- 텍스트 길이가 길어지면 ...으로 표현하도록 하였음 -->
              <!-- 해당 속성은 text-truncate이며 필요없다면 삭제 -->
              <h5
                class="d-inline-block text-truncate pt-3"
                style="max-width: 700px"
              >
                이동 전 위치 : {{ chunk.before }}
              </h5>
              <br />
              <h5 class="d-inline-block text-truncate" style="max-width: 700px">
                이동 후 위치 : {{ chunk.after }}
              </h5>
              <div
                style="btnrestore"
                align="right"
                v-if="chunk.success == 1 || chunk.success == -1"
              >
                <v-btn icon>
                  <v-icon @click="selectchunk(chunk)" size="12" color="brown">
                    fas fa-redo
                  </v-icon>
                </v-btn>
              </div>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-list>
    </div>
    <div align="right" class="mt-3">
      <v-btn
        v-if="Object.keys(timesortedList).length >= 1"
        color="red accent-2"
        rounded
        style="color:white"
        @click="resetHistory()"
        >초기화</v-btn
      >
    </div>
  </v-container>
</template>

<style>
.helpbtn {
  float: right;
}

.hsempty {
  text-align: center;
  height: 410px;
}

.helpmodal {
  text-align: center;
}

.btnrestore {
  position: float;
  height: 1px;
}
.restorebtn {
  float: right;
  width: 500px;
}
/* 성공:ss, 실패:ff, 복구:rr로 할 예정 */
.ss {
  color: greenyellow;
}

.ff {
  color: #ff6699;
}
.rr {
  color: teal;
}

.worktype1 {
  border: solid 0px;
  border-left-width: 15px;
  border-left-color: #78909c;
}
.worktype2 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: #69f0ae;
}
.worktype3 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: #40c4ff;
}
.worktype4 {
  border: solid 0px;

  border-left-width: 15px;
  border-left-color: #7c4dff;
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
import Swal from "sweetalert2";

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
    "restoreRedoList"
  ]),

  methods: mapMutations([
    "changeDir",
    "changeFileList",
    "changeFileSortList",
    "changeDuplicatedList",
    "changeRenameHistory2",
    "changeMoveHistory",
    "changerestoreRedoList"
  ])
})
export default class Restore extends Vue {
  changeDuplicatedList!: (newList: [][]) => void;
  changeRenameHistory2!: (newList: [][]) => void;
  changeMoveHistory!: (newList: [][]) => void;
  changerestoreRedoList!: (newList: [][]) => void;

  restoreRedoList!: any[][];
  localHistory: any[] = [];
  duplicatedList!: any[][];
  renameHistory2!: any[][];
  moveHistory!: any[][];
  isLoading!: boolean;
  historyList: any[][] = [[]];
  inputs: string = "";
  timesortedList: Object = [];

  get refreshHistory() {
    return this.timesortedList;
  }

  get scrollerBgMode() {
    return this.$vuetify.theme.dark ? "file-scroller-d" : "file-scroller";
  }
  mounted() {
    this.readHistory();
    // console.log(this.timesortedList);
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

  convertWorkName(code: any) {
    return constants.history.success[code];
  }

  convertTime(time: string) {
    // console.log(new Date(Number(time)));

    let a = new Date(Number(time)).getMonth();
    let b = new Date(Number(time)).getDate();
    let c = new Date(Number(time)).getHours();

    let d = new Date(Number(time)).getMinutes();

    return `${a + 1}월 ${b}일 ${c}시 ${d}분`;
  }

  selectchunk(chunk) {
    // console.log(t);
    const d = new Date().setTime(Date.now());
    Swal.fire({
      position: "center",
      icon: "question",
      text: "해당 파일에 실행한 작업을 취소하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: `예`,
      showConfirmButton: true,
      cancelButtonText: "아니오"
    }).then((res) => {
      if (res.isConfirmed) {
        let sf = -1;
        if (!fs.existsSync(chunk.before)) {
          try {
            fs.renameSync(chunk.after, chunk.before);
            sf = 1;
          } catch {
            sf = 0;
          }
        }
        console.log(sf);
        if (sf == 1) {
          let filename = chunk.filename;
          if (chunk.workcode == 3) {
            const ss = chunk.filename.split(" => ");
            filename = ss[1] + " => " + ss[0];
          }
          this.changerestoreRedoList([]);
          this.changerestoreRedoList([
            filename,
            -1,
            chunk.after,
            chunk.before,
            d,
            chunk.workcode
          ]);
          Swal.fire({
            position: "center",
            icon: "success",
            text: `해당 작업을 되돌렸습니다.`,
            showConfirmButton: false,
            timer: 1000
          });
          setTimeout(() => {
            this.readHistory();
          }, 1000);
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            text: "오류가 발생했습니다.",
            showConfirmButton: false,
            timer: 1000
          });
        }
      }
    });
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
    Swal.fire({
      position: "center",
      icon: "warning",
      text: "히스토리 초기화를 진행합니다.",
      showCancelButton: true,
      confirmButtonText: `예`,
      showConfirmButton: true,
      cancelButtonText: "아니오"
    }).then((res) => {
      if (res.isConfirmed) {
        // console.log("selected yes");
        const nulldata = [];
        const nulldata2 = JSON.stringify(nulldata);
        // this.historyList = [];
        this.timesortedList = [];

        fs.writeFileSync("history_test.json", nulldata2);

        Swal.fire({
          position: "center",
          icon: "warning",
          text: `초기화되었습니다.`,
          showConfirmButton: false,
          timer: 1000
        });
      }
      // } else {
      //   console.log("selected no");
      // }
    });
  }

  created() {
    this.isLoading = true;
  }
}
</script>
<style scoped>
.theme--dark.v-list {
  background-color: #24303a !important;
}

.theme--dark.v-expansion-panels .v-expansion-panel {
  background-color: #1e2730 !important;
}
</style>
