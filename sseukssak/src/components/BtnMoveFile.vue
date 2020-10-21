<template>
  <v-btn @click="moveFile(fileList)">
    정리
  </v-btn>
</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'
import fs from 'fs'
import { mapState } from 'vuex'

@Component({
    computed: mapState([
      'fromDir',
      'fileList'
    ])    
})

export default class App extends Vue {
  fromDir!: string
  
  moveFile(fileList: string[], newDir: string) {
    let oldDir
    fileList.forEach(
      file=>{
        oldDir=this.fromDir+'\\'+file
        console.log(oldDir)
        fs.rename(oldDir,'C:\\foo\\'+file,err=>console.log(err))
      })
  }

}
</script>

<style>

</style>