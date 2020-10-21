<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      max-width="800px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          통일한 파일명 변경
        </v-btn>
      </template>
      <v-card class="text-center">
        <h1 class="my-5">통일한 파일명 변경</h1>
        <div class="text-right mr-10">
          <v-btn icon @click="read()">
            <p>폴더 열기</p>
          </v-btn>
        </div>
        <div class="text-left">
            <p class="pl-10">파일명 형식 : 생성 날짜_<span class="warning--text font-weight-bold">아래에 입력한 통일할 파일명</span>_버전[마지막 수정 날짜 기준]</p>
            <p class="pl-10">ex) 201021_<span class="warning--text font-weight-bold">sseukssak_발표자료</span>_v1</p>
        </div>
        <div class="d-flex mb-5">
            <v-text-field
            class="mx-10"
            v-model="changeFileName"
            @input="change"
            :rules="nameRules"
            :counter="20"
            label="통일할 파일명을 입력해주세요"
            required
          ></v-text-field>
          <v-btn
            color="error"
            class="my-auto mr-5"
            @click="rename"
            >
            Rename
            </v-btn>
        </div>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
            <v-row>
                <v-col cols="6">
                    <span>기존 파일명 (마지막 수정 날짜 오래된 순)</span>
                    <v-list-item v-for="(item, i) in beforeItems" :key="i">
                        <v-list-item-content>
                            {{i + 1}}. {{item.name}}
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="6">
                    <span>바뀔 파일명</span>
                    <v-list-item v-for="(item, i) in afterItems" :key="i">
                        <v-list-item-content>
                            {{i + 1}}. {{item.name}}
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
            </v-row>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="mx-auto">
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component } from 'vue-property-decorator';
import fs from 'fs'
import path from 'path'
const { dialog } = require('electron').remote


export interface FileInfo{
  name: string;
  path: string;
  time: Date;
}

@Component({

})
export default class Rename extends Vue {

    dialog: boolean = false
    changeFileName: string = ''
    nameRules: object = [
        v => !!v || 'File name is required',
        v => v.length <= 20 || 'File name must be less than 20 characters',]
    beforeItems: Array<FileInfo> = []
    afterItems: Array<FileInfo> = []
    dir: string  = ''

    async read () {
      const rs = dialog.showOpenDialogSync({
        properties: ['openDirectory']
      })
      if (!rs) return
      this.dir = rs[0]
      const files = fs.readdirSync(this.dir)
      if (!files.length) return
      this.beforeItems = []
      this.afterItems = []
      for (const v of files) {
        const p = path.join(this.dir, v)
        const stat = fs.statSync(p)
        const item = {
          name: v,
          path: p,
          time: stat.mtime,
        }
        await this.beforeItems.push(item)
      }
      await this.beforeItems.sort(function (a, b) {
        return (a.time > b.time) ? 1 : -1
      })
    }

    change() {
        this.afterItems = []
        this.beforeItems.forEach((item, i) => {
            // 확장자
            const _lastDot = item.name.lastIndexOf('.')
            const _fileType = item.name.substring(_lastDot, item.name.length)
            // 날짜
            const sYear = item.time.getFullYear()
            let sMonth: string | number = item.time.getMonth() + 1
            let sDate: string | number = item.time.getDate()
            sMonth = sMonth > 9 ? sMonth : '0' + sMonth
            sDate = sDate > 9 ? sDate : '0' + sDate
            const _date = String(sYear).substring(2,4) + sMonth + sDate
            // 이름 변경
            const tmp = Object.assign({}, item, {name: _date + "_" + this.changeFileName + "_v" + (i+1) + _fileType})
            this.afterItems.push(tmp)
        })
    }

    rename() {
        if (!this.changeFileName) {
          alert("통일할 파일명을 입력해주세요")
        } else if (this.changeFileName.length > 20) {
          alert("파일명은 20자 이하로 입력해주세요")
        } else if (!this.beforeItems) {
          alert("변경할 파일이 없습니다")
        } else {
          this.beforeItems.forEach((item, i) => {
              const o = path.join(this.dir, item.name)
              const n = path.join(this.dir, this.afterItems[i].name)
              fs.renameSync(o, n)
          })
          alert("파일명이 변경되었습니다")
          this.dialog = false
          this.changeFileName = ''
          this.beforeItems = this.afterItems = []
        }
    }

    mounted() {
        // root dir 가져오기
        // 선택된 파일 목록 store에서 가져오기
        // 마지막 수정 날짜 오름차순으로 정렬
    }
}
</script>

<style>

</style>