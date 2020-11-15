<template>
  <v-breadcrumbs :items="dirPaths" :class="breadName">
    <template v-slot:divider>
      <i class="fas fa-caret-right arrow-right"></i>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { mapState } from "vuex";

interface FilePath {
  text: string;
  disabled: boolean;
}
const AppProps = Vue.extend({
  props: {
    fromDir: String,
    className: String,
  },
});

@Component({
  computed: mapState(["osPlatform"]),
})
export default class ListFromBreadcrumbs extends AppProps {
  osPlatform!: string;
  get dirPaths() {
    const items: FilePath[] = [];
    const dirLists = this.fromDir
      .split("\\")
      .join(",")
      .split("/")
      .join(",")
      .split(",");
    dirLists.forEach((dirList) => {
      if (dirList.length > 11) {
        items.push({
          text: dirList.slice(0, 7) + "...",
          disabled: true,
        });
      } else {
        items.push({
          text: dirList,
          disabled: true,
        });
      }
    });

    if (items.length > 5) {
      const fisrtValue = [
        {
          text: "...",
          disabled: true,
        },
      ];
      return fisrtValue.concat(items.slice().reverse().slice(0, 4));
    }
    return items;
  }
  get breadName() {
    return this.className;
  }
}
</script>

<style scoped>
.bread-from {
  padding: 5px 25px 2px 25px !important;
  font-size: 5px !important;
}
.bread-to {
  padding: 0 !important;
}
.bread-to > li {
  font-size: 3px !important;
}
.v-breadcrumbs li:nth-child(even) {
  padding: 0 2px !important;
}
.arrow-right {
  color: var(--color-purple);
}
</style>
