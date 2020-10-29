<template>
  <v-container>
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
    <v-footer>
      <v-col>
        <BtnMoveFile />
        <BtnDupCheck />
      </v-col>
      <v-col>
        <Exp1 />
        <BtnUploadGoogleDrive/>
      </v-col>
    </v-footer>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Exp1 from '@/components/Exp1.vue';
import BtnMoveFile from '@/components/BtnMoveFile.vue';
import BtnSelectFromDir from '@/components/BtnSelectFromDir.vue';
import BtnUploadGoogleDrive from '@/components/BtnUploadGoogleDrive.vue'

import ListTo from '@/components/ListTo.vue';
import ListFrom from '@/components/ListFrom.vue';

import BtnDupCheck from '@/components/BtnDupCheck.vue';

import { mapState } from 'vuex';

@Component({
  components: {
    Exp1,
    BtnMoveFile,
    BtnSelectFromDir,
    BtnDupCheck,
    ListTo,
    ListFrom,
    BtnUploadGoogleDrive
  },
  computed: mapState(['fromDir'])
})
export default class Home extends Vue {}
</script>
