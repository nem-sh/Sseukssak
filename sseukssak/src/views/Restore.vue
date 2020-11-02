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

import { mapMutations, mapState } from 'vuex';
import constants from '@/assets/constants.json';

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
    console.log(constants.history.workcode);
  }

  // array.sort(function(a,b){

  //   return new Date(b.date) - new Date(a.date);
  //   });
  sortHistory() {
    console.log('test');
    console.log(constants.history.workcode);
    for (let i = 0; i < this.duplicatedList.length; i++) {
      console.log(this.duplicatedList[i]);

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
  }

  created() {
    this.isLoading = true;
    console.log(this.isLoading);
  }
}
</script>
