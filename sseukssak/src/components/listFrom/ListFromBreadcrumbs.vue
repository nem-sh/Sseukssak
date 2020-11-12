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
  data: () => ({
    items: [
      {
        text: "Dashboard",
        disabled: false,
        href: "breadcrumbs_dashboard",
      },
      {
        text: "Link 1",
        disabled: false,
        href: "breadcrumbs_link_1",
      },
      {
        text: "Link 2",
        disabled: true,
        href: "breadcrumbs_link_2",
      },
    ],
  }),
})
export default class ListFromBreadcrumbs extends AppProps {
  get dirPaths() {
    const dirLists = this.fromDir.split("\\");
    const items: FilePath[] = [];
    dirLists.forEach((dirList) => {
      items.push({
        text: dirList,
        disabled: true,
      });
    });
    return items;
  }
  get breadName() {
    console.log(this.className);
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