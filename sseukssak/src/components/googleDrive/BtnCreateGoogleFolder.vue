<template>
    <v-dialog
                    class="file-scroller"
                    v-model="dialog3"
                    persistent
                    max-width="500"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="green" text v-bind="attrs" v-on="on">
                        <i class="fas fa-folder-plus mr-2"></i>구글 드라이브
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        생성할 구글 드라이브 폴더 명을 입력해 주세요
                      </v-card-title>
                     
                      <v-card-text>
                        <v-text-field
                          v-model="readFromDirName"
                          label="새 폴더명 입력"
                        >
                        </v-text-field
                      ></v-card-text>

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          color="green darken-1"
                          text
                          @click="dialog3 = false"
                        >
                          취소
                        </v-btn>
                        <v-btn color="green darken-1" text @click="readFromDir">
                          추가
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-dialog>

</template>

<script lang='ts'>
import Vue from 'vue'
import Component from 'vue-class-component'


@Component
export default class BtnCreateGoogleFolder extends Vue {

}
</script>