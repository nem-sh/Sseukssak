<template>
  <v-container>
    <div class="ma-5">
      <h3>
        <div @click="select = 0" style="display: inline; cursor: pointer">
          <div v-if="select == 0" style="display: inline">전체보기</div>
          <div v-if="select != 0" style="display: inline; color: #e0e0e0">
            전체보기
          </div>
        </div>
        |
        <div @click="select = 1" style="display: inline; cursor: pointer">
          <div v-if="select == 1" style="display: inline">오늘 생성된</div>
          <div v-if="select != 1" style="display: inline; color: #e0e0e0">
            오늘 생성된
          </div>
        </div>
        |
        <div @click="select = 2" style="display: inline; cursor: pointer">
          <div v-if="select == 2" style="display: inline">오늘 수정된</div>
          <div v-if="select != 2" style="display: inline; color: #e0e0e0">
            오늘 수정된
          </div>
        </div>
      </h3>
    </div>
    <h5>directories</h5>
    <v-list v-for="directory in fileSortList.directories" :key="directory.file">
      <div
        v-if="
          select == 0 ||
          (select == 1 && compareTime(directory.birthTime)) ||
          (select == 2 && compareTime(directory.updatedTime))
        "
      >
        <v-list-item>{{ directory }}</v-list-item>
      </div>
    </v-list>
    <h5>files</h5>
    <v-list v-for="file in fileSortList.files" :key="file.file">
      <div
        v-if="
          select == 0 ||
          (select == 1 && compareTime(file.birthTime)) ||
          (select == 2 && compareTime(file.updatedTime))
        "
      >
        <v-list-item @click="openFile(file.file)">{{ file }}</v-list-item>
      </div>
    </v-list>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component } from "vue-property-decorator";
// import fs from "fs";
import { mapMutations, mapState } from "vuex";
import childProcess from "child_process";
@Component({
  components: {},
  computed: mapState(["fileSortList", "fromDir"]),
  methods: mapMutations([]),
})
export default class FromList extends Vue {
  now: Date = new Date();
  select: number = 0;

  fromDir!: string;

  openFile(file: string) {
    // const { spawn } = require("child_process");
    childProcess.execSync('"' + this.fromDir + "\\" + file + '"');
  }
  compareTime(time: number) {
    const timeValue = new Date(time);
    if (
      timeValue.getMonth() == this.now.getMonth() &&
      timeValue.getFullYear() == this.now.getFullYear() &&
      timeValue.getDate() == this.now.getDate()
    ) {
      return true;
    }
    return false;
  }
}
</script>

<style>
</style>