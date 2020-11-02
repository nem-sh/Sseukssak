<template>
  <v-container class="screen rename-bg">
    <div class="mt-7">
      <h3><span>통일한 파일명 변경</span></h3>
    </div>
    <div>
      <FilterList/>
      <v-row style="margin:2px">
        <FileList/>`
        <div class="rename-bg mx-1"></div>
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
}
</script>

<style>
.rename-bg {
  background-color: #24303a;
  color: white;
}
.screen {
  width: 100%;
  height: 100%;
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
  text-shadow: 0 13.36px 8.896px black, 0 -2px 1px rgb(122, 120, 120);
  letter-spacing: -4px;
}
</style>