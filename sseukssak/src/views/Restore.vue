<template>
  <v-container>
    <p>this is restore page</p>
    <hr />
    <v-list v-for="dupfile in duplicatedList" :key="dupfile.id">
      <p>실행시각 : {{ dupfile[4] }}</p>
      <p>파일명 : {{ dupfile[0] }}</p>
      <p v-if="dupfile[1] == 1">성공</p>
      <p v-if="dupfile[1] == 0">실패</p>
      <p>실행 전 위치 : {{ dupfile[2] }}</p>
      <p>실행 후 위치 : {{ dupfile[3] }}</p>
      <hr />
    </v-list>
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
  mounted() {
    console.log(constants);
  }
}
</script>
