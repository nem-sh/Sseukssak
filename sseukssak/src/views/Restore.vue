<template>
  <v-container>
    <v-btn @click="sortHistory()">이동 내역 불러오기</v-btn>
    <p>this is restore page</p>
    <hr />
    <div v-if="isLoading">
      <v-list v-for="history in historyList" :key="history.id">
        <div v-for="historychunk in history" :key="historychunk.id">
          <p>{{ historychunk }}</p>
        </div>
      </v-list>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import fs from 'fs';
import path from 'path';
import electron, { app } from 'electron';

import { mapMutations, mapState } from 'vuex';
import constants from '@/assets/constants.json';
import Home from './Home.vue';

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
  duplicatedList!: any[][];
  isLoading!: boolean;
  historyList: any[][] = [[]];
  // data() {
  //   return {
  //     historyList: [[]]
  //   };
  // }
  mounted() {
    // console.log(constants.history.workcode);
  }

  // array.sort(function(a,b){

  //   return new Date(b.date) - new Date(a.date);
  //   });
  sortHistory() {
    console.log('test');
    console.log(constants.history.workcode);
    for (let i = 0; i < this.duplicatedList.length; i++) {
      // console.log(this.duplicatedList[i]);

      if (this.duplicatedList[i][1] == 0) {
        this.duplicatedList[i][1] == '실패';
      } else if (this.duplicatedList[i][1] == 1) {
        this.duplicatedList[i][1] == '성공';
      }

      if (this.duplicatedList[i][5] == 1) {
        this.duplicatedList[i][5] = constants.history.workcode[1];
      } else if (this.duplicatedList[i][5] == 2) {
        this.duplicatedList[i][5] = constants.history.workcode[2];
      } else if (this.duplicatedList[i][5] == 3) {
        this.duplicatedList[i][5] = constants.history.workcode[3];
      }
    }
    this.historyList.push(this.duplicatedList);

    this.historyList.sort((a: any[], b: any[]) => {
      return b[4] - a[4];
    });
    this.jsontest();
  }

  jsontest() {
    console.log(this.duplicatedList);
    const m = fs.readFileSync(
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

    const mm = JSON.parse(m.toString());

    console.log(Object.keys(mm.datas).length);
    // mm['datas'][0]['date'] = 'has changed';
    // if (mm['datas'][1] == undefined) {
    //   mm['datas'][1] = {};
    // }

    // mm['datas'][1]['date'] = 'write test';
    // mm['datas'][1]['test3'] = 'write test 2';

    for (let k = 0; k < this.duplicatedList.length; k++) {
      if (mm['datas'][k] == undefined) {
        mm['datas'][k] = {};
      }
      mm['datas'][k]['filename'] = this.duplicatedList[k][0];
      mm['datas'][k]['success'] = this.duplicatedList[k][1];
      mm['datas'][k]['before'] = this.duplicatedList[k][2];
      mm['datas'][k]['after'] = this.duplicatedList[k][3];
      mm['datas'][k]['date'] = this.duplicatedList[k][4];
      mm['datas'][k]['workcode'] = this.duplicatedList[k][5];
    }

    const newdata = JSON.stringify(mm);
    fs.writeFileSync('history_test.json', newdata);
    console.log('saved');
  }

  created() {
    this.isLoading = true;
    // console.log(this.isLoading);
  }
}
</script>
