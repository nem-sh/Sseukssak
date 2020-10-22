<template>
  <div>
    <v-btn icon @click="DuplicateCheck(fileList)">
      <v-icon>mdi-shopping-search</v-icon>
    </v-btn>
    <p>발사</p>
  </div>
</template>
<script lang="ts">
// import { dir } from 'console'
// import * as func from './js'

// const { shell } = require('electron')
import Vue from 'vue'
import Component from 'vue-class-component'

// import { mapState, mapMutations } from 'vuex'
const { dialog } = require('electron').remote
import fs from 'fs'
// const path = require('path')
// const byte = require('bytes')
// const Datastore = require('nedb-promises')
// const DBFile = Datastore.create('dbFiles.db')
import { mapState } from 'vuex'

@Component({
  computed: mapState(['fromDir', 'fileList'])
})
export default class DupCheck extends Vue {
  dir: string = ''
  fromDir!: string
  files: string[] = []

  flag: boolean = false
  filepath: string = ''
  extension: string = ''
  stats: string[] = []

  dupedfiles: string[][] = [[]]

  checkingQueuej: object = {}
  checkingQueuek: object = {}

  read() {
    const rs = dialog.showOpenDialogSync({
      properties: ['openDirectory']
    })
    if (!rs) return

    this.flag = true
    // this.fromDir = rs[0]

    this.files = fs.readdirSync(this.fromDir)
    // this.fetch()
  }

  selectfile(item) {
    let extIdx = -999
    for (let i = 0; i < item.length; i++) {
      if (item[i] == '.' && i >= extIdx) {
        extIdx = i
      }
    }
    if (extIdx == -999) {
      this['extension'] = 'folder'
    } else {
      this['extension'] = item.substr(extIdx, item.length)
    }
    // console.log(this.extension)
    this['filepath'] = this.fromDir + '\\' + item
  }
  stat(filepath, q) {
    if (q == 'j') {
      this.checkingQueuej = fs.statSync(filepath)
    } else if (q == 'k') {
      this.checkingQueuek = fs.statSync(filepath)
    }
  }
  DuplicateCheck(fileList: string[]) {
    console.log('dup check start')
    // let checkingFile = null
    const duplist = [[this.fromDir]]
    const dupchecked = Array(fileList.length).fill(1)
    for (let j = 0; j < fileList.length; j++) {
      const tmpduplist = [fileList[j]]
      if (dupchecked[j] == 1) {
        this.stat(this.fromDir + '\\' + fileList[j], 'j')
        for (let k = j + 1; k < fileList.length; k++) {
          // console.log(j, k)
          if (dupchecked[k] == 1) {
            this.stat(this.fromDir + '\\' + fileList[k], 'k')
            if (this.checkingQueuej['size'] == this.checkingQueuek['size']) {
              tmpduplist.push(fileList[k])
              dupchecked[k] = 0
            }
          }
        }
      }
      if (tmpduplist.length > 1) {
        duplist.push(tmpduplist)
      }
    }
    console.log(duplist)
    this.dupedfiles = duplist
    this.MoveDupedFiles()
  }
  MoveDupedFiles() {
    if (!fs.existsSync(this.fromDir + '\\' + 'duplicated files')) {
      fs.mkdirSync(this.fromDir + '\\' + 'duplicated files')
    }
    let movedfiles = 0
    for (let f1 = 1; f1 < this.dupedfiles.length; f1++) {
      // console.log(this.dupedfiles)
      for (let f2 = 1; f2 < this.dupedfiles[f1].length; f2++) {
        // fs.renameSync()
        if (!fs.existsSync(this.fromDir + '\\' + this.dupedfiles[f1][0])) {
          fs.mkdirSync(
            this.fromDir + '\\' + 'duplicated files\\this.dupedfiles[f1][0]'
          )
        }

        fs.renameSync(
          this.fromDir + '\\' + this.dupedfiles[f1][f2],
          this.fromDir +
            '\\' +
            'duplicated files' +
            '\\' +
            this.dupedfiles[f1][f2]
        )
        movedfiles += 1
      }
    }
    if (movedfiles == 0) {
      alert('중복된 파일이 없습니다.')
    } else {
      alert(
        movedfiles +
          '개의 복제된 파일을 duplicated files 폴더로 이동시켰습니다.'
      )
    }
  }
}
</script>
