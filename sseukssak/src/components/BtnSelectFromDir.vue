<template>
  <v-btn @click="read">
    찾기
  </v-btn>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { mapMutations, mapState } from 'vuex'
const { dialog } = require('electron').remote

@Component({
  computed: mapState([
    'fromDir'
  ]),
  methods: mapMutations([
    'changeDir'
  ])
})
export default class BtnSelectFromDir extends Vue {
    changeDir!: (newDir) => void

    async read () {
      const rs = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (!rs) return
      this.changeDir(rs[0])
    }
}
</script>

<style>

</style>