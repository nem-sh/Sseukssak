<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row no-gutters>From <BtnSelectFromDir />{{ fromDir }}</v-row>
        <v-row no-gutters>
          <FromList />
        </v-row>
      </v-col>

      <v-col>
        <v-row no-gutters>To</v-row>
        <v-row no-gutters>
          <ToList />
        </v-row>
      </v-col>
    </v-row>
    <v-footer absolute>
      <v-col>
        <BtnMoveFile />
        <DupCheck />
      </v-col>
      <v-col>
        <Exp1 />
      </v-col>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Exp1 from "@/components/Exp1.vue";
import BtnMoveFile from "@/components/BtnMoveFile.vue";
import BtnSelectFromDir from "@/components/BtnSelectFromDir.vue";

import ToList from "@/components/ToList.vue";
import FromList from "@/components/FromList.vue";

import DupCheck from "@/components/DupCheck.vue";

import { mapState } from "vuex";

@Component({
  components: {
    Exp1,
    BtnMoveFile,
    BtnSelectFromDir,
    DupCheck,
    ToList,
    FromList,
  },
  computed: mapState(["fromDir"]),
})
export default class Home extends Vue {}
</script>
