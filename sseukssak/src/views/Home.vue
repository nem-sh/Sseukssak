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
              class="from fill-height d-flex flex-column"
              :class="fromBgMode"
            >
              <ListFrom />
            </v-col>
            <v-col
              cols="12"
              lg="6"
              md="6"
              sm="6"
              class="to fill-height d-flex flex-column"
              :class="toBgMode"
            >
              <ListTo />
            </v-col>
          </v-row>
        </v-container>
      </v-app>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import Exp1 from "@/components/Exp1.vue";
import BtnMoveFile from "@/components/BtnMoveFile.vue";

import ListTo from "@/components/ListTo.vue";
import ListFrom from "@/components/ListFrom.vue";

import BtnDupCheck from "@/components/BtnDupCheck.vue";

import { mapState } from "vuex";

@Component({
  components: {
    Exp1,
    BtnMoveFile,
    BtnDupCheck,
    ListTo,
    ListFrom,
  },
  computed: mapState(["fromDir"]),
})
export default class Home extends Vue {
  get fromBgMode() {
    return this.$vuetify.theme.dark ? "from-d" : "from";
  }
  get toBgMode() {
    return this.$vuetify.theme.dark ? "to-d" : "to";
  }
}
</script>

