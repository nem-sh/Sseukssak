<template>
  <v-container>
    <v-select
      :items="toLibraryNameList"
      v-model="selectedFromName"
      label="Select Library"
      dense
    ></v-select>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";

interface ToLibrary {
  name: string;
  directroy: object[];
}

@Component({
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations(["changeToLibraryList"]),
})
export default class BtnSelectFromDir extends Vue {
  created() {
    const tempToLibrary: ToLibrary[] = JSON.parse(
      fs
        .readFileSync("C:/Users/multicampus/Desktop/selectedFromData.txt")
        .toString()
        .trim()
    );
    this.changeToLibraryList(tempToLibrary);
  }
  selectedFromName: string = "";
  toLibrary!: object;
  toLibraryNameList!: object;
  changeToLibraryList!: (newList: ToLibrary[]) => void;
}
</script>

<style>
</style>