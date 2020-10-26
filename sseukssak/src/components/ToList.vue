<template>
  <v-container>
    <v-select
      :items="toLibraryNameList"
      v-model="selectedFromName"
      label="Select Library"
      dense
    ></v-select>

    <CreateToLibraryModal />
    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedFromName">
        {{ toLibrary.name }}
        <div v-for="directory in toLibrary.directories" :key="directory.path">
          {{ directory }}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang='ts'>
import Vue from "vue";
import Component from "vue-class-component";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import CreateToLibraryModal from "@/components/CreateToLibraryModal.vue";
interface ToLibrary {
  name: string;
  directories: object[];
}

@Component({
  components: { CreateToLibraryModal },
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations(["changeToLibraryList"]),
})
export default class ToList extends Vue {
  created() {
    if (!fs.existsSync("C:/Users/multicampus/Desktop/selectedFromData.txt")) {
      fs.writeFileSync(
        "C:/Users/multicampus/Desktop/selectedFromData.txt",
        "[]"
      );
    }
    const tempToLibrary: ToLibrary[] = JSON.parse(
      fs
        .readFileSync("C:/Users/multicampus/Desktop/selectedFromData.txt")
        .toString()
        .trim()
    );
    this.changeToLibraryList(tempToLibrary);
  }
  selectedFromName: string = "";
  toLibraryList!: object;
  toLibraryNameList!: object;
  changeToLibraryList!: (newList: ToLibrary[]) => void;
}
</script>

<style>
</style>