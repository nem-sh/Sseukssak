<template>
  <v-container class="from-to">
    <div>
      <v-app>
        <v-container fluid pa-0>
          <v-row align="center" justify="center" style="height: 100vh" dense>
            <!-- From List -->

            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="from fill-height d-flex flex-column"
            >
              <div class="from-part-first">
                <div class="select-folder">
                  <v-row>
                    <v-col cols="4" class="from-to-name">
                      <h3><span>From</span></h3></v-col
                    >
                    <v-col
                      cols="8"
                      align="center"
                      justify="center"
                      class="folder-name"
                      ><div v-if="fromDir">{{ fromDir }}</div>
                      <div v-else>폴더를 선택해주세요!</div>
                    </v-col>
                  </v-row>
                </div>
                <div class="select-date"></div>
              </div>
              <div class="from-part-second">
                <FromFileList class="lighten-4 rounded-xl from-file-list" />
              </div>
              <div class="from-part-third" align="right">
                <BtnMoveFile mr-4 /><BtnDupCheck />
              </div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="to fill-height d-flex flex-column"
            >
              <ListTo />
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>

    <v-row>
      <v-col>
        <v-row no-gutters><BtnSelectFromDir />{{ fromDir }}</v-row>
        <v-row no-gutters>
          <ListFrom />
        </v-row>
      </v-col>
    </v-row>
    <v-col>
      <BtnMoveFile />
      <BtnDupCheck />
    </v-col>
    <v-col>
      <Exp1 />
    </v-col>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Exp1 from "@/components/Exp1.vue";
import BtnMoveFile from "@/components/BtnMoveFile.vue";
import BtnSelectFromDir from "@/components/BtnSelectFromDir.vue";
import BtnUploadGoogleDrive from "@/components/BtnUploadGoogleDrive.vue";

import FromFileList from "@/components/FromFileList.vue";

import ListTo from "@/components/ListTo.vue";
import ListFrom from "@/components/ListFrom.vue";

import BtnDupCheck from "@/components/BtnDupCheck.vue";

import { mapState } from "vuex";

@Component({
  components: {
    Exp1,
    BtnMoveFile,
    BtnSelectFromDir,
    BtnDupCheck,
    ListTo,
    ListFrom,
    FromFileList,
  },
  computed: mapState(["fromDir"]),
})
export default class Home extends Vue {}
</script>

<style scoped>
.from-file-list {
  height: 100%;
}

.from-part-first .select-folder {
  height: 70%;
}

.from-part-first .select-date {
  height: 30%;
}

.folder-name {
  font-size: 20px;
}
</style>
