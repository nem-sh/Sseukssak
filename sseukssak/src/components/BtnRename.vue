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
        <div class="text-left">
            <p class="pl-10">파일명 형식 : 생성 날짜_<span class="font-italic font-weight-bold">아래에 입력한 통일할 파일명</span>_버전[마지막 수정 날짜 기준]</p>
            <p class="pl-10">EX) 201021_<span class="font-italic font-weight-bold">sseukssak_발표자료</span>_v1</p>
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
                    기존 파일명
                    <v-list-item v-for="(item, i) in beforeItems" :key="i">
                        <v-list-item-content>
                            {{i + 1}}. {{item.name}}
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col cols="6">
                    바뀔 파일명
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
import Component from 'vue-class-component'
import fs from 'fs'
import path from 'path'

@Component({

})

export default class Rename extends Vue {
    dialog: boolean = false
    changeFileName: string = ''
    nameRules: object = [
        v => !!v || 'File name is required',
        v => v.length <= 20 || 'File name must be less than 20 characters',]
    beforeItems: Array<object> = [{name: "test.txt"}]
    afterItems: Array<object> = []
    dir: string  = ''

    change() {
        this.afterItems = []
        this.beforeItems.forEach((item, i) => {
            // 확장자
            // 날짜
            // 이름 변경
            const tmp = Object.assign({}, item, {name: this.changeFileName + "_v" + (i+1)});
            this.afterItems.push(tmp)
        })
    }

    rename() {
        if (!this.changeFileName) {
          alert("통일할 파일명을 입력해주세요")
        } else {
          this.beforeItems.forEach((item, i) => {
              const o = path.join(this.dir, item[name])
              const n = path.join(this.dir, this.afterItems[i][name])
              fs.renameSync(o, n)
          })
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