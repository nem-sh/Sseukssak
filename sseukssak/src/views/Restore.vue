<template>
  <v-container>
    <br />
    <br />
    <br />
    <p>현재 중복파일 체크 내역만 확인 가능함</p>
    <!-- <v-btn @click="sortHistory(localHistory)">이동 내역 불러오기</v-btn> -->

    <hr />
    <div
      v-if="isLoading"
      class="history"
      style="overflow:scroll; height:400px;"
    >
      <v-list v-for="history in historyList" :key="history.id">
        <div
          v-for="historychunk in history"
          :key="historychunk.id"
          class="chunk"
        >
          <p>
            <b>파일명 : {{ historychunk.filename }}</b>
          </p>
          <p>실행시간 : {{ historychunk.date }}</p>
          <p>작업코드 : {{ historychunk.workcode }}</p>
        </div>
      </v-list>
    </div>
  </v-container>
</template>

<style>
div.history {
  border: 1px blue;
  background-color: #9900ff;
}

div.chunk {
  border: 1px black;
  background-color: #cceeff;
  color: black;
  font-size: 10px;
  line-height: 8px;
}
</style>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import fs from 'fs';
import path from 'path';
// import electron, { app } from 'electron';

import { mapMutations, mapState } from 'vuex';
// import constants from '@/assets/constants.json';
// import Home from './Home.vue';

@Component({
  components: {},

  computed: mapState(['fileSortList', 'fromDir', 'duplicatedList', 'fileList']),

  methods: mapMutations([
    'changeDir',
    'changeFileList',
    'changeFileSortList',
    'changeDuplicatedList'
  ])
})
export default class Restore extends Vue {
  // localHistory: Record<string, any> = {
  //   datas: {}
  // };
  changeDuplicatedList!: (newList: any[][]) => void;
  localHistory: any;
  duplicatedList!: any[][];
  isLoading!: boolean;
  historyList: (string | number)[][] = [[]];

  // data() {
  //   return {
  //     historyList: [[]]
  //   };
  // }

  mounted() {
    // console.log(constants.history.workcode);
    console.log(this.duplicatedList);
    this.readHistory();
  }

  readHistory() {
    // console.log('readhistory');
    console.log(this.duplicatedList);
    const nulldata = {
      datas: {
        '0': {
          date: null
        }
      }
    };
    const nulldata2 = JSON.stringify(nulldata);

    let localHistory;
    try {
      localHistory = fs.readFileSync(
        path.resolve(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          '..',
          '..',
          'history_test.json'
        )
      );
    } catch (error) {
      fs.writeFileSync('history_test.json', nulldata2);
    }

    localHistory = fs.readFileSync(
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        '..',
        '..',
        'history_test.json'
      )
    );

    console.log(this.duplicatedList.length);
    const mm = JSON.parse(localHistory.toString());
    console.log(mm);

    if (this.duplicatedList == undefined || this.duplicatedList.length == 1) {
      this.jsontest(localHistory);
      return;
    }
    const tmpL = Object.keys(mm.datas).length;
    for (let i = 1; i < this.duplicatedList.length; i++) {
      // console.log(i);
      // console.log(tmpL + i);
      if (this.duplicatedList[i].length != 0) {
        if (mm['datas'][tmpL + i] == undefined) {
          mm['datas'][tmpL + i] = {
            filename: null,
            success: null,
            before: null,
            after: null,
            date: null,
            workcode: null
          };
        }
        // console.log(mm);
        // console.log(this.duplicatedList[i]);
        mm['datas'][tmpL + i]['filename'] = this.duplicatedList[i][0];
        mm['datas'][tmpL + i]['success'] = this.duplicatedList[i][1];
        mm['datas'][tmpL + i]['before'] = this.duplicatedList[i][2];
        mm['datas'][tmpL + i]['after'] = this.duplicatedList[i][3];
        mm['datas'][tmpL + i]['date'] = this.duplicatedList[i][4];
        mm['datas'][tmpL + i]['workcode'] = this.duplicatedList[i][5];
      }
    }
    // this.localHistory = mm;
    const mm2 = Buffer.from(JSON.stringify(mm));
    this.changeDuplicatedList([]);
    this.jsontest(mm2);
  }

  jsontest(changedHistory: object) {
    // console.log(changedHistory);
    // console.log(typeof changedHistory);
    // let mm;
    // try {
    //   mm = Buffer.from(JSON.stringify(changedHistory));
    // } catch {
    //   mm = changedHistory;
    // }
    const mm = JSON.parse(changedHistory.toString());
    // console.log(mm);

    this.historyList = JSON.parse(changedHistory.toString());
    for (let k = 0; k < this.historyList.length; k++) {
      console.log(mm.datas[k]);
      if (mm['datas'][k].length != 0) {
        if (mm['datas'][k] == undefined) {
          mm['datas'][k] = {
            filename: null,
            success: null,
            before: null,
            after: null,
            date: null,
            workcode: null
          };
        }

        mm['datas'][k]['filename'] = this.duplicatedList[k][0];
        mm['datas'][k]['success'] = this.duplicatedList[k][1];
        mm['datas'][k]['before'] = this.duplicatedList[k][2];
        mm['datas'][k]['after'] = this.duplicatedList[k][3];
        mm['datas'][k]['date'] = this.duplicatedList[k][4];
        mm['datas'][k]['workcode'] = this.duplicatedList[k][5];

        // console.log(this.historyList);
      }
    }

    const newdata = JSON.stringify(mm);
    fs.writeFileSync('history_test.json', newdata);
    // console.log('saved');
  }

  created() {
    this.isLoading = true;
    // console.log(this.isLoading);
  }
}
</script>
