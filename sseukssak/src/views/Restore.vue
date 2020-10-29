<template>
  <v-container>
    <p>this is restore page</p>
    <hr />
    <v-list v-for="dupfile in duplicatedList" :key="dupfile.id">
      <v-list-item>파일명 : {{ dupfile[0] }}</v-list-item>
      <v-list-item>보고요약 : {{ dupfile[1] }}</v-list-item>
      <v-list-item>시행시각 : {{ dupfile[2] }}</v-list-item>
      <hr />
    </v-list>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import { mapMutations, mapState } from 'vuex';

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
  duplicatedList!: string[][];
}
</script>
