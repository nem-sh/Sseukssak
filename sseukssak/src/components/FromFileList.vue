<template>
  <div>
    <v-virtual-scroll :items="items" height="400" item-height="90">
      <div :key="item" class="d-flex justify-space-between mx-5 pt-3">
        <div v-for="n in 3" :key="n" class="pa-2" outlined tile>
          <div class="file--icon">PNG</div>
          <div align="center">file</div>
        </div>
      </div>
      <!-- <v-divider></v-divider> -->
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({})
export default class FromFileList extends Vue {
  get length() {
    return 10;
  }

  get items() {
    return Array.from({ length: this.length }, (k, v) => v + 1);
  }
}
</script>
