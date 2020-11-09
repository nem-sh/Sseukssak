<template>
  <v-breadcrumbs :items="items" class="bread">
    <template v-slot:divider>
      <i class="fas fa-caret-right" color="var(--color-purple)"></i>
    </template>
  </v-breadcrumbs>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

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
export default class ListFromBreadcrumbs extends Vue {}
</script>

<style>
.bread {
  padding: 0;
}
</style>