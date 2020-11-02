<template>
  <v-container class="screen" :class="bgMode">
    <div class="mt-7">
      <h3 :class="titleMode"><span>통일한 파일명 변경</span></h3>
    </div>
    <div>
      <FilterList/>
      <v-row style="margin:2px">
        <FileList/>`
        <div class="mx-1" :class="partMode"></div>
        <PreviewList/>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
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
  get bgMode() {
    return this.$vuetify.theme.dark? "rename-bg-d" : "rename-bg"
  }
  get titleMode() {
    return this.$vuetify.theme.dark? "rename-title-d" : "rename-title"
  }
  get partMode() {
    return this.$vuetify.theme.dark? "rename-part-bg-d" : "rename-part-bg"
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
}
.rename-title, .rename-title-d {
  /* margin: 20px; */
  font-family: "Paytone One" !important;
  color: #202020;
  text-transform: uppercase;
  letter-spacing: -2px;
}
.rename-title span {
  display: block;
  margin: 0 0 17px 10px;
  font-size: 40px;
  line-height: 40px;
  color: #7288da;
  text-shadow: 0 13.36px 8.896px #c4b59d, 0 -2px 1px #fff;
  letter-spacing: -4px;
}
.rename-title-d span {
  display: block;
  margin: 0 0 17px 10px;
  font-size: 40px;
  line-height: 40px;
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
.theme--light.v-icon, .theme--dark.v-icon {
  color: #7288da;
}
.folder {
  color: #7288da;
}
.folder-d {
  color: white;
}
</style>