<template>
  <v-container>
    <v-row>
      <v-col cols="10" class="pr-0" style="display: flex; align-items: center">
        <v-select
          :items="toLibraryNameList"
          v-model="selectedToName"
          label="Select Library"
          dense
        ></v-select>
      </v-col>
      <v-col cols="2" class="pl-0"><ModalCreateToLibrary /></v-col>
    </v-row>

    <div v-for="toLibrary in toLibraryList" :key="toLibrary.name">
      <div v-if="toLibrary.name == selectedToName">
        {{ toLibrary.name }}
        <div v-for="directory in toLibrary.directories" :key="directory.path">
          {{ directory }}
        </div>
      </div>
    </div>
  </v-container>
</template>

<script lang='ts'>
import { Vue, Component, Watch } from "vue-property-decorator";
import fs from "fs";
import { mapMutations, mapState } from "vuex";
import ModalCreateToLibrary from "@/components/ModalCreateToLibrary.vue";
interface ToLibrary {
  name: string;
  directories: object[];
}

@Component({
  components: { ModalCreateToLibrary },
  computed: mapState(["toLibraryList", "toLibraryNameList"]),
  methods: mapMutations(["changeToLibraryList", "changeSelectedToName"]),
})
export default class ListTo extends Vue {
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
  selectedToName: string = "";
  toLibraryList!: object;
  toLibraryNameList!: object;
  changeToLibraryList!: (newList: ToLibrary[]) => void;
  changeSelectedToName!: (newName: string) => void;

  @Watch("selectedToName")
  watchSelectedToName() {
    this.changeSelectedToName(this.selectedToName);
  }
}
</script>

<style>
</style>