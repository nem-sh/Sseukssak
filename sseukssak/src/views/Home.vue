<template>
  <v-container class="from-to">
    <div>
      <v-app>
        <v-container fluid pa-0>
          <v-row align="center" justify="center" style="height: 100vh" dense>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="from lighten-2 fill-height d-flex flex-column"
            >
              <div class="from-part-first">
                <div class="select-folder">
                  <v-row>
                    <v-col cols="4">
                      <h3><span>From</span></h3></v-col
                    >
                    <v-col cols="8"> 폴더명 </v-col>
                  </v-row>
                </div>
                <div class="select-date">select date</div>
              </div>
              <div class="from-part-second">
                <FromPartition
                  class="pink lighten-4 rounded-xl from-file-list"
                />
              </div>
              <div class="from-part-third">Flex item</div>
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="to fill-height d-flex flex-column justify-center align-center"
            >
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>

    <v-row>
      <v-col>
        <v-row no-gutters>From <BtnSelectFromDir />{{ fromDir }}</v-row>
        <v-row no-gutters>
          <ListFrom />
        </v-row>
      </v-col>

      <v-col>
        <v-row no-gutters>To</v-row>
        <v-row no-gutters>
          <ListTo />
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
import BtnUploadGoogleDrive from '@/components/BtnUploadGoogleDrive.vue'

import FromPartition from "@/components/FromPartition.vue";

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
    FromPartition,
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

h3 {
  /* margin: 20px; */
  font-family: "Paytone One" !important;
  color: #202020;
  text-transform: uppercase;
  letter-spacing: -2px;
}

h3 span {
  display: block;
  margin: 0 0 17px 10px;
  font-size: 50px;
  line-height: 50px;
  color: #7288da;
  text-shadow: 0 13.36px 8.896px #c4b59d, 0 -2px 1px #fff;
  letter-spacing: -4px;
}
</style>
