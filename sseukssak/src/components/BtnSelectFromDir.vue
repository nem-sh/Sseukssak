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
    'changeDir',
    'changeFileList'
  ])
})
export default class BtnSelectFromDir extends Vue {
    fromDir!: string
    changeDir!: (newDir) => void
    changeFileList!: (newList) => void

    async read () {
      const rs = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (!rs) return
      this.changeDir(rs[0])
      const fileList = fs.readdirSync(this.fromDir)
      this.changeFileList(fileList)
      
    }
}
</script>

<style>

</style>