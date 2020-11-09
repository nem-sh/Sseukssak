<template>
  <v-container class="screen" :class="bgMode">
    <div class="mt-10">
      <h3 :class="titleMode"><span>통일한 파일/폴더명 변경</span></h3>
    </div>

    <v-stepper v-model="e1">
      <v-stepper-items>
        <v-stepper-content v-for="n in steps" :key="`${n}-content`" :step="n">
          <v-row>
            <v-col cols="1" v-show="n === 2" class="text-center px-0 my-auto">
              <v-btn dark text color="#7288da" @click="nextStep(n)">
                <i class="fas fa-angle-double-left fa-3x"></i>
              </v-btn>
            </v-col>
            <v-col cols="11">
              <FileList v-show="n === 1" />
              <v-row style="margin: 2px" v-show="n === 2">
                <FilterList />
                <PreviewList @finish="e1 = 1" />
              </v-row>
            </v-col>
            <v-col cols="1" v-show="n === 1" class="text-center px-0 my-auto">
              <v-btn
                dark
                text
                color="#7288da"
                @click="nextStep(n)"
                class="px-0"
              >
                <i class="fas fa-angle-double-right fa-3x"></i>
              </v-btn>
            </v-col>
          </v-row>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import FileList from "@/components/rename/FileList.vue";
import FilterList from "@/components/rename/FilterList.vue";
import PreviewList from "@/components/rename/PreviewList.vue";

@Component({
  components: {
    FileList,
    FilterList,
    PreviewList,
  },
})
export default class Rename extends Vue {
  e1: number = 1;
  steps: number = 2;
  title: string[] = ["이름 변경할 폴더/파일 선택", "Rename"];

  get bgMode() {
    return this.$vuetify.theme.dark ? "rename-bg-d" : "rename-bg";
  }
  get titleMode() {
    return this.$vuetify.theme.dark ? "rename-title-d" : "rename-title";
  }
  get partMode() {
    return this.$vuetify.theme.dark ? "rename-part-bg-d" : "rename-part-bg";
  }

  nextStep(n) {
    if (n === this.steps) {
      this.e1 = 1;
    } else {
      this.e1 = n + 1;
    }
  }
}
</script>

<style>
.rename-bg-d {
  background-color: #24303a;
  color: white;
}
.screen {
  width: 100%;
  height: 100%;
  overflow: auto;
}
.rename-title,
.rename-title-d {
  /* margin: 20px; */
  /* font-family: "Paytone One" !important; */
  color: #202020;
  text-transform: uppercase;
  letter-spacing: -2px;
}
.rename-title span {
  display: block;
  font-size: 30px;
  line-height: 30px;
  color: #7288da;
}
.rename-title-d span {
  display: block;
  margin: 0 0 17px 10px;
  font-size: 30px;
  line-height: 30px;
  color: #7288da;
  text-shadow: 0 13.36px 8.896px black, 0 -2px 1px rgb(122, 120, 120);
  letter-spacing: -4px;
}
.rename-part-bg {
  margin: 2px;
  background-color: #f6f8fa;
}
.rename-part-bg-d {
  margin: 2px;
  background-color: #1e2730;
}
.part-title {
  background-color: #c4cef54f;
}
.part-title-d {
  background-color: #24303a;
}
.theme--light.v-icon,
.theme--dark.v-icon {
  color: #7288da;
}
.folder {
  color: #7288da;
}
.folder-d {
  color: white;
}
.v-stepper {
  box-shadow: none !important;
}
.v-stepper__content {
  padding: 0 !important;
}
.screen::-webkit-scrollbar {
  display: none;
}
</style>